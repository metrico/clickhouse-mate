import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService, QUERY_LIST } from 'src/app/services/api.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

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
    sqlRequest: string = 'SHOW DATABASES';

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
        const auth: any = getStorage('AUTH_DATA');
        console.log(auth)
        if (auth) {
            this.dbLink = auth.dbURL;
            this.dbLogin = auth.login;
            this.dbPassword = auth.password;
        }



        this.connect_to_DB()
    }

    initDbTree(): void {
        this.apiService.runQuery(QUERY_LIST.getDatabases).subscribe(async (result) => {
            console.log(result)
            const { data } = result || {}
            const dbTreeData: any[] = [];
            console.log({ data })
            const stack = async ([dbName]: any) => {
                let lvf;
                try {
                    lvf = await firstValueFrom(this.apiService.runQuery(QUERY_LIST.useDatabase(dbName)))
                    console.log({ lvf, dbName });
                } catch (err) {
                    dbTreeData.push({
                        name: dbName,
                    })
                }
                if (lvf === null) {
                    const tablesList: any = await firstValueFrom(this.apiService.runQuery(QUERY_LIST.getTables))

                    console.log({ tablesList })

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
                    console.log({ dbTreeData });
                    this.dbTreeData = dbTreeData;
                    this.cdr.detectChanges();
                }
            };
            if (data.length > 0) {
                stack(data.shift())
            }
        })
    }
    promiseWait(sec = 1000): Promise<any> {
        return new Promise<any>((require) => {
            setTimeout(() => {
                require(true);
            }, sec)
        })
    }

    onDbChoose(event?: any): void {
        console.log({ event })
        const sqlStr = `select * from ${event.name} limit 10`
        if (event?.level === 1) {
            this.SQL(sqlStr)
        }
    }
    isObjectData() {
        return typeof this.details === 'object';
    }
    formatData(data: any) {
        console.log({ data })
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


        console.log(this.columns, this.details)
    }

    async SQL(sqlStr: string) {
        this.sqlRequest = sqlStr;
        this.details = [];
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
            console.log(error);
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
    async connect_to_DB() {
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
        }
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

