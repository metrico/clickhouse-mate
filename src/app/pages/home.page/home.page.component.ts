import { Functions } from './../../helper/functions';
import { HashParams } from './../../app.component';
import { DocsService } from './../../services/docs.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ApiService, QUERY_LIST } from 'src/app/services/api.service';
import { getStorage, saveToFile, setLink, setStorage } from '@app/helper/windowFunctions';
import { Row } from '@app/models/grid.model';
import { Dictionary } from '@app/components/ace-editor-ext/dictionary-default';
import { promiseWait, cloneObject } from '@app/helper/functions';
import { getParam } from '@app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogKioskComponent } from '../dialogs/dialog-kiosk/dialog-kiosk.component';

@Component({
    templateUrl: './home.page.component.html',
    styleUrls: ['./home.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
    getParam: HashParams = getParam;
    isAccess = true;
    isReadonly = true;
    isDarkMode = false;
    isDocsShows = false;
    dbItems: any[] = [];
    isLeftPanel = true;
    dbLink: string = '';
    dbLogin: string = '';
    dbPassword: string = '';
    sqlRequest: any = 'SHOW DATABASES';
    _selectedDB: any;
    set selectedDB(val: any) {
        console.log('set new value', val);

        if (this.dbLink === val?.value?.dbLink &&
            this.dbLogin === val?.value?.dbLogin &&
            this.dbPassword === val?.value?.dbPassword
        ) {
            this._selectedDB = val;
            return;
        }

        if (this._selectedDB && this._selectedDB?.value?.dbLink !== val?.value?.dbLink) {
            this._selectedDB = val;
            this.connectToDB(this._selectedDB.value);
            this.cdr.detectChanges();
        } else if (!this._selectedDB) {
            // start app
            this._selectedDB = val;
            this.cdr.detectChanges();
        }
    }
    get selectedDB() {
        return this._selectedDB;
    }
    dictionary: Dictionary[] = [];

    dataForFile: any = null;
    isLoadingDetails = false;
    details: any = [];
    columns: any[] = [];
    errorMessage: string = '';
    authErrorMessage: string = '';
    authSuccessMessage: string = '';
    PopularQueries: string[] = [
        'SHOW DATABASES',
        'SHOW TABLES',
    ];
    _SqlArchive: any = [];

    set SqlArchive(value: any) {
        this._SqlArchive[this.checkSqlHistory()] = value;

    }
    get SqlArchive(): any[] {
        return this._SqlArchive[this.checkSqlHistory()];
    }

    checkSqlHistory() {
        const key = this.keyOfSqlHistory();
        if (!this._SqlArchive[key]) {
            this._SqlArchive[key] = [];
            const json = localStorage.getItem(key);
            if (json) {
                this._SqlArchive[key] = JSON.parse(json);
            }
        }
        return key;
    }
    dbTreeData: any[] = [];
    pageSize: number = 50;
    isPaginator: boolean = true;
    currentRow: Row = new Map();
    parseFloat = parseFloat;
    constructor(
        private apiService: ApiService,
        private docsService: DocsService,
        private cdr: ChangeDetectorRef,
        public dialog: MatDialog
    ) {
        if (getParam.kiosk) {
            this.isDarkMode = getParam.mode === 'dark';
        }
        if (getParam.query) {
            this.sqlRequest = getParam.query;
        }
    }

    ngOnInit(): void {


        const auth: any = getParam.kiosk ? {
            dbURL: getParam.db_host,
            login: getParam.db_login,
            password: getParam.db_pass
        } : getStorage('AUTH_DATA');
        console.log("auth", !!auth?.dbURL)

        if (auth?.dbURL) {
            this.dbLink = auth.dbURL;
            this.dbLogin = auth.login;
            this.dbPassword = auth.password;
        } else {
            this.isAccess = false;
        }
        if (!!auth?.dbURL) {
            this.connectToDB().then(async () => {
                await this.getDynamicDictionary();
            });
        }
        console.log(this.currentRow.size)
        this.docsService.listen().subscribe(doc_link => {
            this.isDocsShows = false;
            this.cdr.detectChanges();
            requestAnimationFrame(() => {
                this.isDocsShows = !!doc_link;
                this.cdr.detectChanges();
            })
            // this.isLeftPanel = !doc_link;
        });


    }
    async getDynamicDictionary() {
        if (getParam.kiosk && !getParam.query_field) {
            return await promiseWait(0);
        }
        const queryList: string[] = [
            'SELECT name FROM system.functions',
            'SELECT name FROM system.formats'
        ];

        const stack = async (query: any) => {
            const { data } = await this.apiService.runQuery(query) || {};
            const bool = query.includes('system.functions');
            const r: Dictionary[] = data?.map((value: any) => ({
                name: value[0] + '()',
                icon: bool ? 1 : 2,
                type: bool ? 'function' : 'format'
            })) || [];

            this.dictionary.push(...r);
            if (queryList.length > 0) {
                await promiseWait(20);
                stack(queryList.shift())
            } else {
                // END OF LOOP
                this.cdr.detectChanges();
            }
        };

        stack(queryList.shift())
    }
    async initDbTree() {
        if (getParam.kiosk && !getParam.panel) {

            return await promiseWait(0);
        }
        const result: any = await this.apiService.runQuery(QUERY_LIST.getDatabases);

        let { data } = result || {};

        if (!data && typeof result === 'string') {
            data = result.split('\n').map(i => ([i]));
        }
        console.log({ data });
        const dbTreeData: any[] = [];
        const stack = async ([dbName]: any) => {
            await promiseWait(5);
            let lvf;
            try {
                lvf = await this.apiService.runQuery(QUERY_LIST.useDatabase(dbName));
            } catch (err) {
                dbTreeData.push({
                    name: dbName,
                })
            }
            if (lvf === null) {
                const tablesList: any = await this.apiService.runQuery(QUERY_LIST.getTables);
                dbTreeData.push({
                    name: dbName,
                    type: 'database',
                    children: tablesList?.data?.map((t: any) => {
                        const [tableName] = t;
                        const tableId = `${dbName}."${tableName}"`;
                        this.dictionary.push({
                            name: tableId,
                            icon: 3,
                            type: 'table',
                        });
                        let type = 'table';
                        if (tableId.match(/\.\./g)) {
                            type = 'non-table';
                        }
                        return {
                            name: tableName,
                            description: tableId,
                            type
                        }
                    })
                });
            }
            if (data?.length > 0) {
                stack(data.shift())
            } else {
                this.dbTreeData = dbTreeData;
                this.cdr.detectChanges();
            }
        };
        if (data?.length > 0) {
            stack(data.shift())
        } else {
            this.dbTreeData = [{
                name: '...no data',
                // type: 'database'
            }]
        }
    }

    onDbChoose(event?: any): void {
        const LIMIT = 50;
        const sqlStr = `SELECT * FROM ${event.description} LIMIT ${LIMIT}`;
        if (event?.level === 1) {
            this.SQL(sqlStr)
        }
    }

    isObjectData() {
        return typeof this.details === 'object';
    }

    formatData(data: any) {
        data = data || (window as any).data || {};
        console.log(data);
        if (typeof data === 'string') {
            this.details = data;
        } else {
            this.columns = data.meta?.map((i: any) => i.name);
            this.details = data.data?.map((i: any) => {
                const itemArray: any[] = i instanceof Array ? i : Object.values(i);
                let out: any = {};
                itemArray.forEach((j: any, k: any) => {
                    out[this.columns[k]] = j;
                });
                return out;
            });
        }
    }

    getHash() {
        if (!location.hash) {
            return false;
        }
        // console.log((location.hash + '').replace('#', ''))
        try {
            // const sqlRequest = atob((location.hash + '').replace('#', ''));
            const sqlRequest = getParam.query;
            this.sqlRequest = sqlRequest;
            this.SQL(this.sqlRequest);
            this.isAccess = true;
            return true;
        } catch (error) {
            console.log('ERROR', error)
            // location.hash = '';
            return false;
        }
    }

    setHash() {
        if (!getParam.kiosk) {
            location.hash = '#query=' + encodeURI(this.sqlRequest);
        } else {
            location.hash = setLink(this.sqlRequest);
            console.log(location.hash)
        }
    }

    keyOfSqlHistory() {
        return 'SqlArchive-' + Functions.md5(this.dbLink);
    }

    async SQL(sqlStr: string, isAuthenticated: boolean = false) {
        await promiseWait(100);
        if (!isAuthenticated) {
            this.sqlRequest = sqlStr;
        }
        this.isLoadingDetails = true;
        this.cdr.detectChanges();

        this.details = [];

        if (!isAuthenticated) {
            this.setHash();
        }

        if (!this.SqlArchive.includes(sqlStr)) {
            this.SqlArchive.unshift(sqlStr);
            localStorage.setItem(this.keyOfSqlHistory(), JSON.stringify(this.SqlArchive));
        }

        try {
            const response = await this.apiService.runQuery(sqlStr);
            this.dataForFile = response;
            this.formatData(response);
            this.errorMessage = '';
            this.isLoadingDetails = false;
            this.cdr.detectChanges();
            return true;

        } catch (error: any) {
            console.error(error, isAuthenticated);
            this.details = [];
            if (!isAuthenticated) {
                this.errorMessage = error.error || error.message;
            } else {
                this.authErrorMessage = error.error || error.message;
                this.isAccess = false;
                console.error({ authErrorMessage: this.authErrorMessage });
                requestAnimationFrame(() => {
                    this.cdr.detectChanges();
                })
            }
            this.isLoadingDetails = false;
            this.cdr.detectChanges();

            return false;
        }
    }

    onClickRun(event?: any): void {
        if (event) {
            console.log(event);
            this.sqlRequest = event;
        }
        this.SQL(this.sqlRequest);
    }
    async connectToDB(event?: any, isTestConnection = false) {
        if (event) {
            this.dbLink = event.dbLink;
            this.dbLogin = event.dbLogin;
            this.dbPassword = event.dbPassword;
        }
        const auth = {
            dbURL: this.dbLink,
            login: this.dbLogin,
            password: this.dbPassword,
        };
        this.apiService.setLoginData(auth);
        const res = await this.SQL(QUERY_LIST.getDatabases, true);
        if (res) {
            this.authErrorMessage = '';
            this.errorMessage = '';
            this.authSuccessMessage = '';
            if (!isTestConnection) {
                setStorage('AUTH_DATA', auth)
                this.formatData({ meta: [], data: [] });
                this.isAccess = true;
                this.getHash();

                this.isLoadingDetails = true;
                this.cdr.detectChanges();

                await promiseWait(100);
                this.cdr.detectChanges();

                await this.initDbTree();
                this.cdr.detectChanges();

                this.isLoadingDetails = false;
            } else {
                this.authSuccessMessage = 'Connection is successfully established.';
                setTimeout(() => {
                    this.authSuccessMessage = '';
                    this.cdr.detectChanges();
                }, 5000);
            }
            // this.isAccess = false;
            this.cdr.detectChanges();
            return true;
        } else {
            this.isLoadingDetails = true;
            this.authErrorMessage = 'Can not connect to DB server, check login / password / link to DB, please';
            this.cdr.detectChanges();
        }
        this.errorMessage = '';
        return false;
    }
    openRow(event: Map<string, any>) {
        this.currentRow = event;
    }
    setReadonly(bool: boolean) {
        this.isReadonly = bool;
        this.apiService.setReadOnly(bool);
    }
    save(buttonName: string) {
        let type: string = '';
        let format: string = '';
        let isCompact: boolean = false;
        const FORMAT = 'FORMAT';
        const fname = 'tableData.';
        switch (buttonName) {
            case 'Save as JSON':
                type = 'JSON';
                format = type;
                break;
            case 'Save as JSONCompact':
                type = 'JSON';
                format = type;
                isCompact = true;
                break;
            case 'Save as CSV':
                type = 'CSVWithNames';
                format = 'csv'
                break;
            default: return;
        }

        let [sqlStr] = this.sqlRequest.split(FORMAT);

        sqlStr += ` ${FORMAT} ` + (isCompact ? 'JSONCompact' : type);

        this.apiService.runQuery(sqlStr).then(result => {
            console.log(result, sqlStr)
            if (type === 'csv') {
                saveToFile(result, fname + format);
            } else {
                saveToFile(JSON.stringify(result, null, 2), fname + format);

            }
        })
    }
    bytesToSize(bytes: any): string | null{
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return bytes + ' Bytes';
        }
        const i = Math.floor(+Math.log(bytes) / +Math.log(1024))
        if (i === 0) {
            return `${bytes} ${sizes[i]}`;
        }
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
    timeShorter(sec: number): string {
        const ms = Math.round((sec) * 1000);
        const _ = (n: number) => (n + '').length === 1 ? '0' + n : n;
        const o = {
            'hours': _(Math.floor(ms / (1000 * 60 * 60))),
            'min': _(Math.floor(ms / (1000 * 60) % 60)),
            'sec': _(Math.floor((ms / 1000) % 60)),
            'ms': ((ms % 1000) / 1000) ? ((ms % 1000) / 1000).toString().replace('0.', '') : '000'
        };
        if (ms < 1000) { // ms
            return `${ms} ms`;
        } else if (ms < 1000 * 60) { // sec
            return `${o.sec}.${o.ms} sec`;
        } else if (ms < 1000 * 60 * 60) { // min
            return `${o.min}:${o.sec}.${o.ms} min`;
        } else { // hours
            return `${o.hours}:${o.min}:${o.sec}.${o.ms} hour(s)`;
        }


    }

    getStatistic(dataForFile: any): string {
        const stat = dataForFile?.statistics;
        const rows = dataForFile?.rows || 0;
        const elapsed = this.timeShorter(stat?.elapsed || 0);
        const rows_read = stat?.rows_read || rows;
        const bytes_read = this.bytesToSize(stat?.bytes_read || 0)
        const rowsPerSec = Math.ceil((rows > 0 ? rows / (stat?.elapsed || 1) : 0));

        const bytesPerSec = this.bytesToSize(
            (stat?.bytes_read || 0) /
            (parseFloat(stat?.elapsed || 0) || 0.001)
        );

        console.log({
            stat,
            rows,
            elapsed,
            rows_read,
            bytes_read,
            rowsPerSec,
            bytesPerSec
        })
        return [
            `${rows} rows in set. Elapsed ${elapsed}`,
            rows_read && ` Processed ${rows_read} rows`,
            `${bytes_read} (${rowsPerSec} rows/s. ${bytesPerSec}/s.)`
        ].filter(i => !!i).join(', ');
    }
    setDBItems(DBItems: any = null) {
        if (DBItems) {
            this.dbItems = DBItems;
        }
        this.selectedDB = DBItems.find((item: any) => {
            return item.value.dbLink === this.dbLink
        })
        console.log(this.dbItems, this.selectedDB);
        requestAnimationFrame(() => {
            this.cdr.detectChanges();
        })
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(DialogKioskComponent, {
            width: '650px',
            data: {
                dbLink: this.dbLink,
                dbLogin: this.dbLogin,
                dbPassword: this.dbPassword,
                sqlRequest: this.sqlRequest
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed', { result });
            requestAnimationFrame(() => {
                this.cdr.detectChanges();
            });
        });
    }
    removeItemHistory(item: any): void {
        this.SqlArchive = this.SqlArchive.filter(i => i !== item);
        console.log(this.SqlArchive, item);
        localStorage.setItem(this.keyOfSqlHistory(), JSON.stringify(this.SqlArchive));
    }
}
