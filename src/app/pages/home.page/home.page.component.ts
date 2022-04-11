import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService, QUERY_LIST } from 'src/app/services/api.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
    templateUrl: './home.page.component.html',
    styleUrls: ['./home.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
    panelOpenState: boolean = false;
    dbLink: string = '';
    dbLogin: string = '';
    dbPassword: string = '';
    sqlRequest: string = 'SHOW DATABASES';

    details: any[] = [];
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
        this.apiService.setLoginData({
            dbURL: this.dbLink,
            login: this.dbLogin,
            password: this.dbPassword,
        });
        this.initDbTree();
    }

    initDbTree(): void {
        this.apiService.runQuery(QUERY_LIST.getDatabases).subscribe(async (result) => {
            console.log(result)
            const { data } = result || {}
            const dbTreeData: any[] = [];
            console.log({data})
            const stack = async ([dbName]: any) => {
                let lvf;
                try {
                    lvf = await firstValueFrom(this.apiService.runQuery(QUERY_LIST.useDatabase(dbName)))
                    console.log({ lvf, dbName });
                } catch (err) {
                    // console.log(err)
                    dbTreeData.push({
                        name: dbName,
                        // children: [{ name: '..no access..' }]
                    })
                    // this.cdr.detectChanges();
                }
                if (lvf === null) {
                    // await this.promiseWait(10);
                    const tablesList = await firstValueFrom(this.apiService.runQuery(QUERY_LIST.getTables))

                    console.log({ tablesList })

                    dbTreeData.push({
                        name: dbName,
                        type: 'database',
                        children: tablesList?.data?.map((t: any) => {
                            const [tableName] = t;
                            return {
                                name: `${dbName}.${tableName}`,
                                // children: children
                                type: 'table'
                            }
                        })
                    });

                }
                if (data.length > 0) {
                    stack(data.shift())
                } else {
                    console.log({ dbTreeData });
                    // await this.promiseWait(1000);
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
        // event.name: "hepic_archive"
        const sqlStr = `select * from ${event.name} limit 10`
        if (event?.level === 1) {
            this.sqlRequest = sqlStr;
            this.SQL(sqlStr)

        }
    }

    formatData(data: any) {
        data = data || (window as any).data || {};

        this.columns = data.meta?.map((i: any) => i.name);
        this.details = data.data.map((i: any) => {
            let out: any = {};
            i.forEach((j: any, k: any) => {
                out[this.columns[k]] = j
            });
            return out;
        });

        console.log(this.columns, this.details)
    }

    SQL(strSQL: string): void {
        this.details = [];
        if (!this.SqlArchive.includes(strSQL)) {
            this.SqlArchive.unshift(strSQL);
            localStorage.setItem('SqlArchive', JSON.stringify(this.SqlArchive));
        }
        this.apiService.runQuery(strSQL)
            .subscribe(response => {
                this.formatData(response);
                console.log(response);
                this.cdr.detectChanges();
            }, error => {
                this.details = [];
                console.log(error);
                this.errorMessage = error.error || error.message;
                this.cdr.detectChanges();
            })
    }

    @HostListener('document:keydown', ['$event'])
    onClickRun(event?: any): void {

        if (!event || event.code === 'Enter' && event.ctrlKey) {
            this.SQL(this.sqlRequest);
        }
    }

}
