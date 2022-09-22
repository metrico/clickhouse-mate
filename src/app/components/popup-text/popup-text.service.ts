import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PopupTextService {
    top = 0;
    left = 0;
    text = '';
    obs: BehaviorSubject<any | null> = new BehaviorSubject(null);

    listen() {
        return this.obs.asObservable();
    }
    setPosition({ top, left }: any) {
        this.top = top;
        this.left = left;
        this.obs.next({ top, left });
    }

    setText(text: string) {
        this.text = text;
        this.obs.next({ text });
    }
}
