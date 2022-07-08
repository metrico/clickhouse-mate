import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit{
    @Input() isAccess: boolean = false;
    @Input() settings = {
        dbPassword: '',
        dbLogin: '',
        dbLink: ''
    };

    dbItems: any[] = [
    ];

    @Input() errorMessage: any = '';

    @Output() ready: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.dbItems = [
            {
                value: `${this.settings.dbLink}|${this.settings.dbLogin}`,
                viewValue: `${this.settings.dbLink} | ${this.settings.dbLogin} | ${this.hidePassword(this.settings.dbPassword)}`
            },
            { value: 'pizza-1', viewValue: 'Pizza' },
            { value: 'tacos-2', viewValue: 'Tacos' },
        ];
    }
    hidePassword(str: string) {
        return Array.from({ length: (str + '').length }, () => '•').join('');
    }
    connectToDB() {
        this.ready.emit(this.settings);
    }

}
