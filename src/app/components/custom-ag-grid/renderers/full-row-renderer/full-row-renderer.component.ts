import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ICellRendererParams } from 'ag-grid-community';
import { isExpanded } from '../../custom-ag-grid.component';

@Component({
    selector: 'app-full-row-renderer',
    templateUrl: './full-row-renderer.component.html',
    styleUrls: ['./full-row-renderer.component.scss'],
})
export class FullRowRendererComponent implements OnInit {
    params: ICellRendererParams | null = null;
    dataSource: MatTableDataSource<any> | null = null;
    columns: Array<string> = ['name', 'value'];
    constructor() {}
    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.dataSource = new MatTableDataSource();
        const data = Object.entries(params.data).map(([key, value]) => {
            let type = ''
            let output = value
            if (!isNaN(value as any)) {
                type = 'number';
                value = parseInt(value as string);
            } else {
                type = typeof value;
            }
            if (type === 'string') {
                try {
                    output = JSON.parse(value as string);
                    type = 'object';
                } catch (error) {}
            }
            return {
                name: {value:key},
                value: {
                    value: output,
                    type: type
                }
            }}
        ).filter(column => column.name.value !== isExpanded);
        this.dataSource.data = data;
    }
    ngOnInit(): void {}
    updateRow() {
        if (this.params) {
            this.params.node.setDataValue(isExpanded, !this.params?.data.isExpanded);
            this.params.fullWidth = false;
            this.params?.api.redrawRows({rowNodes: [this.params.node]});
            if(!this.params.context.componentParent.gridColumnApi.columnModel.autoHeightActive) {
                this.params?.api.resetRowHeights();
            }
            this.params?.context.componentParent.resizeGrid();
        }
    }
}
