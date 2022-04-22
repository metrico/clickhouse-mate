import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
    @Input() isAccess: boolean = false;
    @Input() settings = {
        dbPassword: '',
        dbLogin: '',
        dbLink: ''
    };
    @Output() ready: EventEmitter<any> = new EventEmitter();

    connectToDB() {
        this.ready.emit(this.settings);
    }

}
