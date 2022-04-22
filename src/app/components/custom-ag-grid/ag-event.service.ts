import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgEventService {

    bo = new BehaviorSubject<any | null>(null);
    itemList: any[] = [];
    constructor() { }

    listen(): Observable<any | null> {
        return this.bo.asObservable();
    }
    emit(event: any) {
        this.bo.next(event);
        this.bo.next(null); // for clear observer
    }

}
