import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DocsService {
    bs = new BehaviorSubject<any | null>(null);
    setLink(str: string | null): void {
        this.bs.next(str);
    }
    listen() {
        return this.bs.asObservable();
    }
    constructor() { }
}
