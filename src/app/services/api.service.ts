import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    constructor(private http: HttpClient) { }

    setLoginData({ dbURL, login, password }: any) {
        this.dbURL = dbURL;
        this.login = login;
        this.password = password;
    }
    post(dbURL: string = this.dbURL, postData: any) {
        const { login = this.login, password = this.password, query = '' } = postData;

        const SESSION_ID = ApiService.SESSION_ID;
        const queryObject = {
            session_id: SESSION_ID,
            add_http_cors_header: 1,
            user: login,
            password,
            default_format: 'JSONCompact',
            max_result_rows: 1000,
            max_result_bytes: 10000000,
            result_overflow_mode: 'break'
        }
        // const getStr = `?add_http_cors_header=1&user=${login}&password=${password}&default_format=JSONCompact&max_result_rows=1000&max_result_bytes=10000000&result_overflow_mode=break`
        const getStr = '?' + Object.entries(queryObject)
            .map(([key, value]: any) => `${key}=${value}`).join('&');

        return this.http.post<any>(`${dbURL}${getStr}`, query);
    }

    runQuery(query: string) {
        return this.post(this.dbURL, { query })
    }
}
export function rndStr() {
    return [0, 0, 0, 0, 0, 0, 0, 0].map(() => Math.floor(Math.random() * 10 ** 12).toString(32)).join('-');
}
