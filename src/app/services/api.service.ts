import { WorkerManagerService } from './worker-manager.service';
import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, map, Observable } from 'rxjs';

export const QUERY_LIST = {
    getDatabases: 'SHOW DATABASES',
    useDatabase: (dbName: string) => `USE ${dbName}`,
    getTables: 'SHOW TABLES',
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    static SESSION_ID: string = rndStr();
    login = '';
    password = '';
    dbURL = '';
    isReadonly: boolean = true;
    private bufferParams: any;
    constructor(
        // private http: HttpClient,
        private work: WorkerManagerService
    ) { }

    setReadOnly(bool: boolean) {
        this.isReadonly = bool;
    }
    setLoginData({ dbURL, login, password }: any) {
        this.dbURL = dbURL;
        this.login = login;
        this.password = password;
    }
    private params(postData: any) {
        if (
            // !this.bufferParams &&
            this.login !== postData.login &&
            this.password !== postData.password
        ) {
            // console.log({ bufferParams: this.bufferParams });
            const {
                login = this.login,
                password = this.password
            } = postData;

            this.login = postData.login;
            this.password = postData.password;

            const SESSION_ID = ApiService.SESSION_ID;
            const queryObject: any = {
                session_id: SESSION_ID,
                add_http_cors_header: 1,
                user: login,
                default_format: 'JSONCompact',
                max_result_rows: 1000,
                max_result_bytes: 10000000,
                result_overflow_mode: 'break'
            }
            if (password) {
                queryObject.password = password;
            }
            if (this.isReadonly) {
                queryObject.readonly = 1;
            }
            const getStr = '?' + Object.entries(queryObject)
                .map(([key, value]: any) => `${key}=${value}`)
                .join('&');
            this.bufferParams = getStr;
        }
        return this.bufferParams;
    }

    post(dbURL: string = this.dbURL, postData: any) {
        const { query = '' } = postData;
        const getStr = this.params(postData);
        return new Observable<any>((observer) => {
            this.work.post(`${dbURL}${getStr}`, query, [
                { 'Content-Type': 'text/plain; charset=utf-8' }
            ]).then((response) => {
                if (response === '') {
                    return observer.next(null);
                }
                try {
                    const out = JSON.parse(response)
                    if (out.isError) {
                        observer.error(out);
                    } else {
                        observer.next(out);
                    }
                } catch (error) {
                    observer.next(response)
                }
                observer.complete();

            })
        });
    }

    runQuery(query: string) {
        return lastValueFrom(this.post(this.dbURL, { query }))
    }
}
export function rndStr() {
    return [0, 0, 0, 0].map(() => Math.floor(Math.random() * 10 ** 12).toString(32)).join('-');
}
