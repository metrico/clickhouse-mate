export class HttpClientWorker {

    public async post(url: string, postData: any, headers: any[] = []) {
        return new Promise<any>((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('POST', url, true)
            if (headers.length > 0) {
                headers.forEach(h => {
                    Object.entries(h).forEach(([key, value]: any) => {
                        xhr.setRequestHeader(key, value);
                    })
                })
            }
            xhr.send(postData);

            xhr.onload = function (data) {
                if (xhr.status === 200) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            }
        });
    }
}
