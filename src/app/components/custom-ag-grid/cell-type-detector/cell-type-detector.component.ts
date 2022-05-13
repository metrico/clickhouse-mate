import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-cell-type-detector',
    templateUrl: './cell-type-detector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellTypeDetectorComponent implements ICellRendererAngularComp {
    public params: any;
    selected = false;
    value: any = null;
    isNumber: boolean = false;
    isNULL: boolean = false;
    isMultiLine: boolean = false;
    agInit(params: any): void {
        this.params = params;
        if(/[\n\r]/.test(params.value)) {
            this.isMultiLine = true
        }
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

    refresh(): boolean {
        return false;
    }
}
