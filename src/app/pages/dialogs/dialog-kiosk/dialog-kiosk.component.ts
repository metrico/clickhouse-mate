import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AfterContentChecked, Component, Inject, OnInit } from '@angular/core';
import { Functions } from '@app/helper/functions';

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog-kiosk.component.html',
    styleUrls: ['./dialog-kiosk.component.scss']
})
export class DialogKioskComponent implements OnInit, AfterContentChecked {
    config = {
        query: '',
        db_host: '',
        db_login: '',
        // db_pass: '',
        kiosk: true,
        mode: false,
        table: true,
        chart: true,
        panel: true,
        query_field: true,
    }

    link: string = "";
    ngOnInit(): void {
        this.setLink();
    }
    constructor(
        public dialogRef: MatDialogRef<DialogKioskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar
    ) {
        this.config.db_host = data.dbLink;
        this.config.db_login = data.dbLogin;
        // this.config.db_pass = data.dbPassword;
        this.config.query = data.sqlRequest;
        this.config.kiosk = true;
    }
    getHash() {
        return Functions.md5(
            Object.values(this.config).join('')
        )
    }
    dataHash: string = '';
    ngAfterContentChecked(): void {
        if (this.dataHash !== this.getHash()) {
            this.dataHash = this.getHash();
            console.log(
                this.getHash()
            )

            this.setLink()
        }
    }
    onOkClick(data: any): void {
        this.dialogRef.close(data);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    setLink() {
        this.link = location.origin + location.pathname + '#' +
            Object.entries(this.config).map(([key, value]: [string, any]) => {
                if (!value && typeof value !== 'boolean') {
                    return '';
                }
                if (key === 'query') {
                    return `${key}=${encodeURI(value + '')}`
                }
                if (+this.config.kiosk === 1 && key !== 'query') {
                    if (
                        (key === 'panel' && +value === 1) ||
                        (key === 'query_field' && +value === 1) ||
                        (key === 'table' && +value === 1) ||
                        (key === 'mode' && value === 'light') ||
                        (key === 'chart' && +value === 1)
                    ) {
                        return '';
                    }
                    if (key === 'mode') {
                        console.log([key, value]);
                        return value ? 'mode=dark' : '';
                    }

                    if (typeof value === 'boolean') {
                        return `${key}=${+value}`
                    }
                } else {
                    return '';
                }

                return `${key}=${value}`

            }).filter((i: any) => !!i).join('&');
    }
    copyUrl() {
        this.copy(this.link);
    }
    openNewTab() {
        window.open(this.link, '_blank');
    }
    copy(copyData: string) {
        const openAlert = () => {
            this._snackBar.open('The Link Copied to Clipboard!', '', {
                duration: 3000,
                horizontalPosition: 'start'
            });
        }
        if (navigator.clipboard) {
            navigator.clipboard.writeText(copyData);
            openAlert();
        } else {
            const el = document.createElement('textarea');
            el.value = copyData;
            el.focus();
            el.select();
            el.style.display = 'none';
            document.body.appendChild(el);
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    openAlert();
                    console.log('was copied')
                }

            } catch (err) {
            }
            requestAnimationFrame(() => {
                document.body.removeChild(el);
            })
            el.blur();
        }
    }
}
