import { JSON_parse } from "./functions";

export function getUriJson(): any {
    if (window.location.search) {
        try {
            return JSON.parse(
                decodeURIComponent(window.location.search.slice(1, -1))
            );
        } catch (err) {
            // console.error(new Error(err));

            const out = window.location.search
                .slice(1)
                .split('&')
                .reduce((a: any, i) => {
                    const [key, value]: any = i.split('=');
                    if (key && value) {
                        a[key] = value;
                    }
                    return a;
                }, {});
            if (JSON.stringify(out) === '{}') {
                return null;
            } else {
                return out;
            }
        }
    } else {
        return null;
    }
}
export function getUriParams(): any {
    if (!!window.location.hash) {
        return window.location.hash.replace('#', '');
    }
    const lSearch = window.location.search || '';
    return lSearch
        ? lSearch
            .split('&')
            .map((i) => i.replace('?', '').split('='))
            .reduce((a: any, b) => ((a[b[0]] = b[1]), a), {})
        : { callid: null, from: null, to: null, uuid: null };
}
export function shareLinkUUID(): string|null {
    if (!!window.location.hash) {
        return window.location.hash.replace('#', '');
    }
    return null;
}
export function emitWindowResize(): void {
    setTimeout(() => {
        try {
            window.dispatchEvent(new Event('resize'));
        } catch (e) { }
    });
}
export function getJsonFileDataByLink(name: string): Promise<any> {
    return new Promise((resolve) => {
        resolve((window as any)[`file__json_data_${name}`] || {});
    });
}
export function saveToFile(data: any, filename: any, type = 'application/octet-stream') {
    const file = new Blob([data], { type: type });
    const nav: any = window.navigator as any;
    if (nav.msSaveOrOpenBlob) {
        // IE10+
        nav.msSaveOrOpenBlob(file, filename);
    } else {
        // Others
        const a = document.createElement('a'),
            url = URL.createObjectURL(file);
        a.href = url;
        a.target = '(file)';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
export function console2file(data: any, filename: any) {
    if (!data) {
        console.error('Console.save: No data');
        return;
    }

    if (!filename) {
        filename = 'console.json';
    }

    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4);
    }

    saveToFile(data, filename, 'txt/json');
}
export function setStorage(key: string, value: any): void {
    // saving JSON from object data
    // log('setStorage >>>', key, value);
    return localStorage.setItem(key, JSON.stringify(value));
}
export function getStorage(key: string ): any {
    // log('getStorage <<<', key, Functions.JSON_parse(localStorage.getItem(key)));
    return JSON_parse(localStorage.getItem(key + '') || '') || null;
}

export function getSelectedText() {
    let selectedText: any = '';

    // window.getSelection
    if (window.getSelection) {
        selectedText = window.getSelection();
    }
    // document.getSelection
    else if (document.getSelection) {
        selectedText = document.getSelection();
    }
    // document.selection
    else if ((document as any)['selection']) {
        selectedText = (document as any)['selection']?.createRange()?.text;
    } else {
        return '';
    }
    // To write the selected text into the textarea
    return selectedText + '';
}
