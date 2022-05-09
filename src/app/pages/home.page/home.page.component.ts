import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService, QUERY_LIST } from 'src/app/services/api.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { saveToFile } from '@app/helper/windowFunctions';

@Component({
    templateUrl: './home.page.component.html',
    styleUrls: ['./home.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
    isAccess = false;
    isReadonly = true;
    isLeftPanel = true;
    dbLink: string = '';
    dbLogin: string = '';
    dbPassword: string = '';
    sqlRequest: any = 'SHOW DATABASES';

    dictionary: any = [];

    dataForFile: any = null;

    details: any = [];
    columns: any[] = [];
    errorMessage: string = '';
    PopularQueries: string[] = [
        'SHOW DATABASES',
        'SHOW TABLES',
    ];
    SqlArchive: string[] = [];
    dbTreeData: any[] = [];
    pageSize: number = 50;
    isPaginator: boolean = true;
    constructor(
        private apiService: ApiService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const json = localStorage.getItem('SqlArchive');
        if (json) {
            this.SqlArchive = JSON.parse(json);
        }

        const auth: any = getStorage('AUTH_DATA');
        if (auth) {
            this.dbLink = auth.dbURL;
            this.dbLogin = auth.login;
            this.dbPassword = auth.password;
        }

        this.connectToDB().then(() => {
            this.getDynamicDictionary();
        });
    }
    getDynamicDictionary() {
        const queryList = [
            'select name from system.functions',
            'select name from system.formats'
        ];

        const stack = async (query: any) => {
            const { data } = await lastValueFrom(this.apiService.runQuery(query)) || {};

            const r = data?.map((value: any) => value[0] + '()');

            this.dictionary.push(...r);
            if (queryList.length > 0) {
                stack(queryList.shift())
            } else {
                // END OF LOOP
                this.cdr.detectChanges();
            }
        };

        stack(queryList.shift())
    }
    async initDbTree() {
        const _q = (q: any) => firstValueFrom(this.apiService.runQuery(q));

        const result = await _q(QUERY_LIST.getDatabases);
        const { data } = result || {}
        const dbTreeData: any[] = [];
        const stack = async ([dbName]: any) => {
            await promiseWait(20);
            let lvf;
            try {
                lvf = await _q(QUERY_LIST.useDatabase(dbName));
            } catch (err) {
                dbTreeData.push({
                    name: dbName,
                })
            }
            if (lvf === null) {
                const tablesList: any = await _q(QUERY_LIST.getTables);
                dbTreeData.push({
                    name: dbName,
                    type: 'database',
                    children: tablesList?.data?.map((t: any) => {
                        const [tableName] = t;
                        const tableId = `${dbName}.${tableName}`;
                        // this.dictionary.push(tableId);
                        return {
                            name: tableId,
                            type: 'table'
                        }
                    })
                });

            }
            if (data.length > 0) {
                stack(data.shift())
            } else {
                this.dbTreeData = dbTreeData;
                this.cdr.detectChanges();
            }
        };
        if (data.length > 0) {
            stack(data.shift())
        }
    }

    onDbChoose(event?: any): void {
        const LIMIT = 50;
        const sqlStr = `select * from ${event.name} limit ${LIMIT}`;
        if (event?.level === 1) {
            this.SQL(sqlStr)
        }
    }

    isObjectData() {
        return typeof this.details === 'object';
    }

    formatData(data: any) {
        data = data || (window as any).data || {};
        if (typeof data === 'string') {
            this.details = data;
        } else {
            this.columns = data.meta?.map((i: any) => i.name);
            this.details = data.data.map((i: any) => {
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
            const sqlRequest = atob((location.hash + '').replace('#', ''));
            this.sqlRequest = sqlRequest;
            this.SQL(this.sqlRequest);
            this.isAccess = true;

            return true;
        } catch (error) {
            console.log('ERROR', error)
            location.hash = '';
            return false;
        }
    }

    setHash() {
        location.hash = '#' + btoa(this.sqlRequest);
    }

    async SQL(sqlStr: string, isAuthenticated: boolean = false) {
        await promiseWait(100);
        this.sqlRequest = sqlStr;
        this.details = [];

        if (!isAuthenticated) {
            this.setHash();
        }

        if (!this.SqlArchive.includes(sqlStr)) {
            this.SqlArchive.unshift(sqlStr);
            localStorage.setItem('SqlArchive', JSON.stringify(this.SqlArchive));
        }

        try {
            const response = await lastValueFrom(this.apiService.runQuery(sqlStr));
            this.dataForFile = response;
            this.formatData(response);
            this.errorMessage = '';
            this.cdr.detectChanges();
            return true;

        } catch (error: any) {
            this.details = [];
            if (!isAuthenticated) {
                this.errorMessage = error.error || error.message;
            }
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
    async connectToDB(event?: any) {
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
        if (await this.SQL(QUERY_LIST.getDatabases, true)) {
            setStorage('AUTH_DATA', auth)
            this.formatData({ meta: [], data: [] });
            this.errorMessage = '';

            this.isAccess = true;
            this.initDbTree();
            this.getHash();
            this.cdr.detectChanges();
            return true;
        }
        this.errorMessage = '';
        return false;
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

        lastValueFrom(this.apiService.runQuery(sqlStr)).then(result => {
            console.log(result, sqlStr)
            if (type === 'csv') {
                saveToFile(result, fname + format);
            } else {
                saveToFile(JSON.stringify(result, null, 2), fname + format);

            }
        })
    }
}

export function promiseWait(sec = 1000): Promise<any> {
    return new Promise<any>((require) => {
        setTimeout(() => {
            require(true);
        }, sec)
    })
}
export function setStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
}

