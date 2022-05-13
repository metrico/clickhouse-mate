import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
    selector: 'app-cell-header',
    template: `<span style="font-size: 12px !Important;">{{value}}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellHeaderComponent implements ICellRendererAngularComp {
    public params: any;
    value: string = '';
    agInit(params: any): void {
        this.params = params;
        // console.log(this.params);
        this.value = params?.column?.colId + '';
    }
    refresh(): boolean {
        return false;
    }
}
