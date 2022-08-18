import { Md5 } from 'ts-md5/dist/md5';

export class Functions {
    static JSON_parse(jsonString: string): any {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return null;
        }
    }
    static cloneObject(src: any): any {
        try {
            return JSON.parse(JSON.stringify(src));
        } catch (err) { }

        return src;
    }
    static md5object(obj: any): string {
        try {
            return Functions.md5(JSON.stringify(obj) || '');
        } catch (err) {
            return Functions.md5('');
        }
    }
    static md5(str: string): string {
        str = str || '';
        return Md5.hashAsciiStr(str) + '';
    }
    static emitWindowResize(): void {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        });
    }

}

export function promiseWait(sec = 1000): Promise<any> {
    return new Promise<any>((require) => {
        setTimeout(() => {
            require(true);
        }, sec)
    })
}

export function hash(str: string, lenHash: number = 32) {
    lenHash = lenHash || 32;
    str = str || "";
    let ar = str.split('').map((a) => a.charCodeAt(0)),
        s2alength = ar.length || 1,
        i = ar.length ? ar.reduce((p, c) => p + c) : 1,
        s = "",
        A,
        B,
        k = 0,
        tan = Math.tan;
    while (s.length < lenHash) {
        A = ar[k++ % s2alength] || 0.5;
        B = ar[k++ % s2alength ^ lenHash] || 1.5 ^ lenHash;
        i = i + (A ^ B) % lenHash;
        s += tan(i * B / A).toString(16).split('.')[1].slice(0, 10);
    }
    return s.slice(0, lenHash);
}

export function cloneObject(src: any): any {
    try {
        return JSON.parse(JSON.stringify(src));
    } catch (err) { }

    return src;
}
export function JSON_parse(jsonString: string): any {
    try {
        if (typeof JSON.parse(jsonString) === 'object') {
            return JSON.parse(jsonString);
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}
