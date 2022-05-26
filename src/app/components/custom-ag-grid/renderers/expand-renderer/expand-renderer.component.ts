import { Component, OnInit } from '@angular/core';
import { isExpanded } from '../../custom-ag-grid.component';

@Component({
    selector: 'app-expand-renderer',
    template: `
        <button
            mat-icon-button
            (click)="updateRow()"
            style="width: 30px; height: 30px; line-height: 30px;"
        >
            <mat-icon>{{
                params.value ? 'expand_less' : 'expand_more'
            }}</mat-icon>
        </button>
    `,
    styles: [],
})
export class ExpandRendererComponent implements OnInit {
    params: any;
    constructor() {}

    ngOnInit(): void {}
    agInit(params: any): void {
        this.params = params;
    }
    updateRow() {
        this.params.node.setDataValue(isExpanded, !this.params.value);
        this.params.api.redrawRows({ rowNodes: [this.params.node] });
        if (
            !this.params.context.componentParent.gridColumnApi.columnModel
                .autoHeightActive
        ) {
            this.params?.api.resetRowHeights();
        }
    }
}
