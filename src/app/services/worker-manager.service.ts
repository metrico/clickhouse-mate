import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WorkerManagerService {
    static worker: any;
    worker: any;

    constructor() {
        if (!WorkerManagerService.worker) {
            WorkerManagerService.worker = new Worker(
                new URL('src/app/workers/data-processor.worker', import.meta.url),
                { type: 'module' }
            );
        }
        // console.log('==== WorkerManagerService[constructor] ====');
        this.worker = WorkerManagerService.worker;
    }
    makeNewWorkerInstance() {
        return new Worker(
            new URL('src/app/workers/data-processor.worker', import.meta.url),
            { type: 'module' }
        );
    }
    async post(url: string, query: any, headers: any[] = []) {
        return new Promise<any>((resolve, reject) => {
            const w: Worker = this.makeNewWorkerInstance();
            w.onmessage = (res: any) => {
                // console.log(`async post[${query}]`, res);
                if (res.data === "") {
                    resolve(null);
                    return;
                }
                resolve(res.data);
            };
            w.postMessage(JSON.stringify({
                url, query, headers
            }));
        })
    }
}
