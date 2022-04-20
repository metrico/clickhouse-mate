import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService, QUERY_LIST } from 'src/app/services/api.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import * as ace from "ace-builds";
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

    details: any = [];
    columns: any[] = [];
    errorMessage: string = '';
    PopularQueries: string[] = [
        'SHOW DATABASES',
        'SHOW TABLES',
    ];
    SqlArchive: string[] = [];
    dbTreeData: any[] = [];

    constructor(
        private apiService: ApiService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const json = localStorage.getItem('SqlArchive');
        if (json) {
            this.SqlArchive = JSON.parse(json);
        }
        if (!this.getHash()) {
            const auth: any = getStorage('AUTH_DATA');
            if (auth) {
                this.dbLink = auth.dbURL;
                this.dbLogin = auth.login;
                this.dbPassword = auth.password;
            }


            this.connectToDB();
        }
    }

    initDbTree(): void {
        this.apiService.runQuery(QUERY_LIST.getDatabases).subscribe(async (result) => {
            const { data } = result || {}
            const dbTreeData: any[] = [];
            const stack = async ([dbName]: any) => {
                let lvf;
                try {
                    lvf = await firstValueFrom(this.apiService.runQuery(QUERY_LIST.useDatabase(dbName)))
                    // console.log({ lvf, dbName });
                } catch (err) {
                    dbTreeData.push({
                        name: dbName,
                    })
                }
                if (lvf === null) {
                    const tablesList: any = await firstValueFrom(this.apiService.runQuery(QUERY_LIST.getTables))

                    // console.log({ tablesList })

                    dbTreeData.push({
                        name: dbName,
                        type: 'database',
                        children: tablesList?.data?.map((t: any) => {
                            const [tableName] = t;
                            return {
                                name: `${dbName}.${tableName}`,
                                type: 'table'
                            }
                        })
                    });

                }
                if (data.length > 0) {
                    stack(data.shift())
                } else {
                    // console.log({ dbTreeData });
                    this.dbTreeData = dbTreeData;
                    this.cdr.detectChanges();
                }
            };
            if (data.length > 0) {
                stack(data.shift())
            }
        })
    }

    onDbChoose(event?: any): void {
        const sqlStr = `select * from ${event.name} limit 10`
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
        console.log((location.hash + '').replace('#', ''))
        try {
            const [
                dbLink,
                dbLogin,
                dbPassword,
                sqlRequest
            ] = JSON.parse(atob((location.hash + '').replace('#', '')));

            this.dbLink = dbLink;
            this.dbLogin = dbLogin;
            this.dbPassword = dbPassword;
            this.sqlRequest = sqlRequest;

            const auth = {
                dbURL: this.dbLink,
                login: this.dbLogin,
                password: this.dbPassword,
            };
            this.apiService.setLoginData(auth);
            this.initDbTree();

            this.SQL(this.sqlRequest);
            this.isAccess = true;

            console.log('all OK', [dbLink,
                dbLogin,
                dbPassword,
                sqlRequest
            ]);

            return true;
        } catch (error) {
            console.log('ERROR', error)
            location.hash = '';
            return false;
        }
    }
    setHash() {
        const hashObject = [
            this.dbLink,
            this.dbLogin,
            this.dbPassword,
            this.sqlRequest
        ];

        location.hash = '#' + btoa(JSON.stringify(hashObject))
        console.log(location.hash);
    }
    async SQL(sqlStr: string) {
        this.sqlRequest = sqlStr;
        this.details = [];
        this.setHash();
        if (!this.SqlArchive.includes(sqlStr)) {
            this.SqlArchive.unshift(sqlStr);
            localStorage.setItem('SqlArchive', JSON.stringify(this.SqlArchive));

        }
        try {
            const response = await lastValueFrom(this.apiService.runQuery(sqlStr));
            this.formatData(response);
            this.errorMessage = '';
            this.cdr.detectChanges();
            return true;

        } catch (error: any) {
            this.details = [];
            this.errorMessage = error.error || error.message;
            this.cdr.detectChanges();

            return false;
        }
    }

    @HostListener('document:keydown', ['$event'])
    onClickRun(event?: any): void {
        if (!event || event.code === 'Enter' && event.ctrlKey) {
            this.SQL(this.sqlRequest);
        }
    }
    async connectToDB() {
        const auth = {
            dbURL: this.dbLink,
            login: this.dbLogin,
            password: this.dbPassword,
        };
        this.apiService.setLoginData(auth);
        if (await this.SQL(QUERY_LIST.getDatabases)) {
            setStorage('AUTH_DATA', auth)
            this.formatData({ meta: [], data: [] });
            this.errorMessage = '';
            this.isAccess = true;
            this.initDbTree();
            this.cdr.detectChanges();
            return true;
        }
        return false;
    }

    setReadonly(bool: boolean) {
        this.isReadonly = bool;
        this.apiService.setReadOnly(bool);
    }
}


export function setStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
}

