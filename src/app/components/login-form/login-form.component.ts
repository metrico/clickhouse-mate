import {
    Component, OnInit, Input, Output, EventEmitter,
    ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { getStorage, setStorage } from '@app/helper/windowFunctions';

function shallowClone(obj: any) {
    return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj)
    );
}
const NEW_CONNECT = '(new connect)';
@Component({
    selector: 'app-login-form',
    templateUrl: 'login-form.component.html',
    styleUrls: ['login-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit, AfterViewInit {
    _isAccess: boolean = false;
    @Input() set isAccess(val) {
        // console.log("set isAccess", val);
        this._isAccess = val;
        // if (val) {
        this.ngAfterViewInit();
        this.cdr.detectChanges();
        // }
    }
    get isAccess(): boolean {
        return this._isAccess;
    }
    emptyConnectionTemplate = {
        value: {
            dbPassword: '',
            dbLogin: '',
            dbLink: '',
            isSucceeded: null
        },
        get viewValue() {
            const rx = /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
            return (this.value.dbLink + '').match(rx)?.[0] || NEW_CONNECT;
        },
    };
    @Input() settings: any = {};
    inProcess = false;
    dbItems: any[] = [];
    _errorMessage: any = '';
    @Input() set errorMessage(val) {
        this.inProcess = false;
        this._errorMessage = val;
        if (!!val && this.dbItems?.length > 0) {
            const dbItem = this.dbItems.find(dbItem => dbItem?.value?.dbLink === this.settings?.dbLink);
            if (dbItem) {
                dbItem.value.isSucceeded = false;
                setStorage('dbItems', this.dbItems);
                this.cdr.detectChanges();
            }
        }
        this.cdr.detectChanges();
    }
    get errorMessage() {
        return this._errorMessage;
    }

    _successMessage: any = '';
    @Input() set successMessage(val) {
        this.inProcess = false;
        this._successMessage = val;
        if (!!val && this.dbItems?.length > 0) {
            const dbItem = this.dbItems.find(dbItem => dbItem?.value?.dbLink === this.settings?.dbLink);
            if (dbItem) {
                dbItem.value.isSucceeded = true;
                setStorage('dbItems', this.dbItems);
                this.cdr.detectChanges();
            }
        }

        this.cdr.detectChanges();
    }
    get successMessage() {
        return this._successMessage;
    }
    @Output() ready: EventEmitter<any> = new EventEmitter();
    @Output() testConnection: EventEmitter<any> = new EventEmitter();
    @Output() changeDbItems: EventEmitter<any> = new EventEmitter();
    @ViewChild('dbServer') connectionList: any;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        const localDBList = getStorage('dbItems');
        if (localDBList?.length > 0) {
            this.dbItems = [];
            localDBList.forEach((item: any) => {
                const connect = shallowClone(this.emptyConnectionTemplate);
                connect.value = Object.assign({}, connect.value, item.value);
                this.dbItems.push(connect);
            })
            // if (!this.settings) {
                this.settings = this.dbItems[0];
                this.cdr.detectChanges();
            // }
        } else {
            const connect = shallowClone(this.emptyConnectionTemplate);
            connect.value = Object.assign({}, connect.value, this.settings||{});

            this.dbItems = [connect];
            this.cdr.detectChanges();
        }
        this.changeDbItems.emit(this.dbItems);
    }
    checkIfHasOneConnect() {
        const s = this.connectionList?.selectedOptions?.selected?.[0]?.value?.value;
        const b = s?.isSucceeded === true;
        const c = s?.dbLink !== '';
        // console.log({ b, c, s:this.connectionList?.selectedOptions?.selected });
        return b && c;
    }
    ngAfterViewInit() {
            this.selectConnection();
        // const c = () => {
        //     const listItem = this.connectionList?.options?.find(
        //         (connection: any) => connection?.value?.value?.dbLink === this.settings?.dbLink
        //     );
        //     if (listItem) {
        //         listItem.toggle();
        //         this.cdr.detectChanges();
        //     } else {
        //         requestAnimationFrame(c)
        //     }
        // }
        // requestAnimationFrame(c);
    }
    hidePassword(str: string) {
        return Array.from({ length: (str + '').length }, () => '•').join('');
    }
    isSucceeded(shoe: any, value: any) {

        return shoe.value?.isSucceeded === value || false;
    }
    addNew() {
        if (!this.connectionList.options?.find(
            (connection: any) => connection?.value?.viewValue === NEW_CONNECT
        )) {
            const newConnection = shallowClone(this.emptyConnectionTemplate);
            newConnection.value = {
                dbPassword: '',
                dbLogin: '',
                dbLink: '',
                isSucceeded: null
            };
            this.dbItems.push(newConnection);
            this.settings = newConnection.value;
            // console.log('connectionList', this.connectionList);
            this.cdr.detectChanges();
        }
        requestAnimationFrame(() => {
            this.connectionList.options?.find(
                (connection: any) => connection?.value?.viewValue === NEW_CONNECT
            )?.toggle()
            this.cdr.detectChanges();
        })
    }
    selectConnection(event?: any) {
        console.log(event)
        // if (!this.connectionList?.selectedOptions?.selected?.[0]?.value?.value) {
        //     console.log(this.connectionList.options)
        //     this.connectionList.options.first.toggle();
        // }
        try {

            this.settings = this.connectionList.selectedOptions.selected[0].value.value;
            // console.log(this.settings);
            this.cdr.detectChanges();
        } catch (e) {
            requestAnimationFrame(() => {
                this.selectConnection(event);
            })
        }
    }
    removeConnection() {
        this.dbItems = this.dbItems.filter(
            connection => connection.viewValue !== this.connectionList.selectedOptions.selected[0].value.viewValue
        );
        console.log(this.connectionList.options)
        this.connectionList.options.first.toggle();
        this.settings = this.dbItems[0];
        this.selectConnection();
        this.cdr.detectChanges();
        this.changeDbList();
    }
    connectToDB() {
        this.testToConnect();
        this.changeDbList();
        this.ready.emit(this.settings);
    }
    changeDbList() {
        setStorage('dbItems', this.dbItems);
        this.changeDbItems.emit(this.dbItems);
        this.cdr.detectChanges();
    }
    testToConnect() {
        this.inProcess = true;
        this.cdr.detectChanges();
        // this.changeDbList();
        this.testConnection.emit(this.settings);
    }

}
