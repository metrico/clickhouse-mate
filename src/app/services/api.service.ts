import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

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
    constructor(private http: HttpClient) { }
    setReadOnly(bool: boolean) {
        this.isReadonly = bool;
    }
    setLoginData({ dbURL, login, password }: any) {
        this.dbURL = dbURL;
        this.login = login;
        this.password = password;
    }
    post(dbURL: string = this.dbURL, postData: any) {
        const {
            login = this.login,
            password = this.password,
            query = ''
        } = postData;

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
            .map(([key, value]: any) => `${key}=${value}`).join('&');

        // return this.http.post<any>(`${dbURL}${getStr}`, query);

        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        return this.http.post(
            `${dbURL}${getStr}`,
            query,
            { headers, responseType: 'text' }
        ).pipe(map(response => {
            console.log({ response })
            if (response === '') {
                return null;
            }
            try {
                return JSON.parse(response)
            } catch (error) {
                return response;
            }
            // return { data: [] };
        }))
        //.pipe(catchError(this.errorHandlerService.handleError));
    }

    runQuery(query: string) {
        return this.post(this.dbURL, { query })
    }
}
export function rndStr() {
    return [0, 0, 0, 0, 0, 0, 0, 0].map(() => Math.floor(Math.random() * 10 ** 12).toString(32)).join('-');
}
