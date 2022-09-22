import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { PopupTextService } from '@app/components/popup-text/popup-text.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { maxRowHeight } from '../custom-ag-grid.component';
import { defaultRowHeight } from '../custom-ag-grid.component';

@Component({
    selector: 'app-cell-type-detector',
    templateUrl: './cell-type-detector.component.html',
    styleUrls: ['./cell-type-detector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellTypeDetectorComponent implements ICellRendererAngularComp {
    public params: any;
    selected = false;
    value: any = null;
    isNumber: boolean = false;
    isNULL: boolean = false;
    isMultiLine: boolean = false;
    rowHeight = defaultRowHeight;
    defaultRowHeight = defaultRowHeight;

    @ViewChild('cell') cell: any;

    constructor(private popupTextService: PopupTextService) { }

    agInit(params: any): void {
        this.params = params;
        // if (/[\n\r]/.test(params.value)) {
        //     this.isMultiLine = true
        //     const newLineCount = params.value.split(/\n|\r\n/).length - 1;
        //     const rowHeightWithNewLines = newLineCount * defaultRowHeight;
        //     this.rowHeight = Math.min(rowHeightWithNewLines, maxRowHeight);
        // }
        if (!isNaN(+params.value)) {
            this.isNumber = true;
        }
        if (params.value === null) {
            this.isNULL = true;
        } else if (params.value instanceof Array) {
            params.value = JSON.stringify(params.value)
        }
        this.value = params.value;
        // console.log(params.value);
    }

    onClick() {
        const rect = this.cell.nativeElement.getBoundingClientRect();

        this.popupTextService.setText(this.value);
        this.popupTextService.setPosition({
            top: rect.top,
            left: rect.left
        })
    }

    refresh(): boolean {
        return false;
    }
}
