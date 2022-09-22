import { PopupTextService } from '@app/components/popup-text/popup-text.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-popup-text',
    templateUrl: './popup-text.component.html',
    styleUrls: ['./popup-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupTextComponent implements OnInit {

    text: string = '';
    top = 0;
    left = 0;
    @ViewChild('textPopup') textPopup: any;
    constructor(private popupTextService: PopupTextService, private cdr: ChangeDetectorRef) { }

    get isJson(): boolean {
        try {
            return !!JSON.parse(this.text);
        } catch (e) {
            return false;
        }
    }

    getJSON(): any {
        return JSON.parse(this.text);
    }

    ngOnInit() {
        this.popupTextService.listen().subscribe(data => {
            if (data?.text || data?.text === '') {
                this.text = data?.text;
            }

            if (data?.top || data?.left) {
                this.top = data?.top - 2;
                this.left = data?.left - 5;

                setTimeout(() => {
                    const el = this.textPopup?.nativeElement;
                    const rect = el?.getBoundingClientRect() || { height: 500, width: 500 };

                    this.top = Math.min(data.top - 2, window.innerHeight - rect.height - 50);
                    this.left = Math.min(data.left - 5, window.innerWidth - rect.width - 50);

                    this.cdr.detectChanges();
                }, 100);
            }

            this.cdr.detectChanges();
        });
    }

    onHide() {
        this.text = '';
        this.cdr.detectChanges();
    }

}
