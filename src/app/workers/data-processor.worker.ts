/// <reference lib="webworker" />
import { HttpClientWorker } from './httpClientWorker'

export function rndStr() {
    return [0, 0, 0, 0].map(() => Math.floor(Math.random() * 10 ** 12).toString(32)).join('-');
}

addEventListener('message', ({ data: config }) => {
    try {
        config = JSON.parse(config);
    } catch (e) { }

    const http = new HttpClientWorker();
    const { url, query, headers } = config;

    // console.log("worker::addEventListener('message')", config);

    http.post(url, query, headers || []).then(
        data => {
            // console.log("http.post", data);
            postMessage(data.response);
        }, err => {
            // console.log("worker::error::", err);
            postMessage(JSON.stringify({
                isError: true,
                message: err.responseText
            }));
        });

});
