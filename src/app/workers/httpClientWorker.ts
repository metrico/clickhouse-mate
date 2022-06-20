export class HttpClientWorker {

    public async post(url: string, postData: any, headers: any[] = []) {
        return new Promise<any>((resolve, reject) => {
            try {

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

                xhr.onerror = (data) => {
                    console.log('xhr.onerror', { data });
                    reject(xhr);
                }

                xhr.onabort = (data) => {
                    console.log('xhr.onabort', { data });
                    reject(xhr);
                }

                xhr.ontimeout = (data) => {
                    console.log('xhr.ontimeout', { data });
                    reject(xhr);
                }

                xhr.onload = (data) => {
                    console.log({ data });
                    if (xhr.status === 200) {
                        resolve(xhr);
                    } else {
                        reject(xhr);
                    }
                }
            } catch (error) {
                console.error({ error });
            }
        });
    }
}
