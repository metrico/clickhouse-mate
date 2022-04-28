import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { cloneObject } from '@app/helper/functions';
import { GridOptions } from 'ag-grid-community';
import { AgEventService } from './ag-event.service';
import { CellHeaderComponent } from './cell-header/cell-header.component';
import { CellTypeDetectorComponent } from './cell-type-detector/cell-type-detector.component';
import { SettingButtonComponent } from './setting-button';


const GRID_FIT = 'autoSizeColumns';

@Component({
    selector: 'custom-ag-grid',
    templateUrl: './custom-ag-grid.component.html',
    styleUrls: ['./custom-ag-grid.component.scss']
})
export class CustomAgGridComponent implements OnInit {
    @Input()
    set itemList(list: any) {
        this.agEventService.itemList = list;
    }
    agGridSizeControl = {
        selectedType: 'sizeToFitContinuos', // 'sizeToFit',
        // pageSize: 100
    };
    agColumnDefs: any[] = [];
    _details: any[] = [];
    frameworkComponents: any = {};
    gridOptions: GridOptions = <GridOptions>{
        defaultColDef: {
            sortable: true,
            resizable: true,
        },
        enableCellTextSelection: true,
        ensureDomOrder: true,
        domLayout: 'normal', //'autoHeight',
        rowHeight: 38,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressPaginationPanel: true
    };
    _columns: any[] = [];
    gridApi: any;
    @Input() set details(val) {
        this._details = cloneObject(val);
        this.re_new();
    }
    get details() {
        return this._details;
    }
    @Input() set columns(val: string[]) {
        if (!val) {
            return;
        }
        const isDetailsReady = () => {
            if (this.details?.length) {
                const [firstItemOfDetails] = this.details;

                this._columns = Object.entries(firstItemOfDetails)
                    .map(([key]: any) => {
                        return {
                            field: key,
                            hide: !val.includes(key),
                            filter: 'agTextColumnFilter',
                            headerComponent: 'cellHeader',
                            cellRenderer: 'cellTypeDetector'
                        }
                    });

                this._columns.push({
                    field: '',
                    headerName: '',
                    headerComponent: 'settings',
                    hide: false,
                    pinned: 'left',
                    lockPinned: true,
                    resizable: false,
                    minWidth: 40,
                    maxWidth: 40
                });
                this.re_new();
            } else {
                setTimeout(() => {
                    isDetailsReady();
                });
            }
        };
        isDetailsReady();
    }
    get columns(): any {
        return this._columns;
    }
    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() menuClick: EventEmitter<any> = new EventEmitter();

    @HostListener('dblclick')
    @HostListener('window:resize')
    onDblClick() {
        requestAnimationFrame(() => {
            this.gridApi?.sizeColumnsToFit();
        });
    }

    onResize() {
        if (!this.gridApi || this.agGridSizeControl.selectedType !== GRID_FIT) {
            return;
        }

        requestAnimationFrame(() => {
            if (this.agGridSizeControl.selectedType === GRID_FIT) {
                this.gridApi?.sizeColumnsToFit();
            }
        });
    }
    onGridReady(params: any) {
        this.gridApi = params.api;
    }
    constructor(
        private cdr: ChangeDetectorRef,
        private agEventService: AgEventService
    ) {
        this.frameworkComponents = {
            settings: SettingButtonComponent,
            cellHeader: CellHeaderComponent,
            cellTypeDetector: CellTypeDetectorComponent
        };
    }

    ngOnInit() {
        this.re_new();
        this.agEventService.listen().subscribe((data) => {
            // console.log('listening', data)
            if (data) {
                this.menuClick.emit(data);
            }
        })
    }
    private re_new() {
        this.sizeToFit();
        this.cdr.detectChanges();
    }
    private sizeToFit() {
        setTimeout(() => {
            this.gridOptions.api?.sizeColumnsToFit();
            this.cdr.detectChanges();
        }, 100);
    }

    public getRowStyle(params: any) {
        const _style: any = {
            'border-bottom': '1px solid rgba(0,0,0,0.1)',
            'cursor': 'pointer'
        }
        if (params.node.rowIndex % 2 === 0) {
            _style.background = '#e4f0ec';
        }
        return _style;
    }
    sortChanged(event?: any) {
        this.cdr.detectChanges();
    }
    cellClicked(event?: any) {
        this.rowClick.emit(event);
    }
    doOpenFilter() {

    }
}
