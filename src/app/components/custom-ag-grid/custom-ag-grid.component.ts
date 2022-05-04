import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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

    @Input()
    set pageSize(size: number) {
        this.agGridSizeControl.pageSize = size;
    }
    get pageSize(): number {
        return this.agGridSizeControl.pageSize;
    }
    @Output()
    pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    set isPaginator(size: boolean) {
        this.agGridSizeControl.isPaginator = size;
    }
    get isPaginator(): boolean {
        return this.agGridSizeControl.isPaginator;
    }
    @Output()
    isPaginatorChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    agGridSizeControl = {
        selectedType: GRID_FIT,
        pageSize: 50,
        isPaginator: true
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
    gridColumnApi: any;
    totalPages: number = 1;
    @Input() set details(val) {
        console.log(val)
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
                console.log(firstItemOfDetails)
                const regex = new RegExp(/[\n\r]/)
                this._columns = Object.entries(firstItemOfDetails)
                    .map(([key]: any) => {
                        let isAutoHeight = false;
                        if ( typeof firstItemOfDetails[key] === 'string' && this.details.some(value => regex.test(value[key]))) {
                            isAutoHeight = true;
                        }
                        return {
                            field: key,
                            hide: !val.includes(key),
                            filter: 'agTextColumnFilter',
                            headerComponent: 'cellHeader',
                            cellRenderer: 'cellTypeDetector',
                            autoHeight: isAutoHeight
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
    onDblClick() {
        requestAnimationFrame(() => {
            if (this.agGridSizeControl.selectedType === GRID_FIT) {
                this.gridColumnApi?.autoSizeAllColumns();
            } else {
                this.gridApi?.sizeColumnsToFit();
            }
        });
    }

    @HostListener('window:resize')
    onResize() {
        if (!this.gridApi || !this.gridColumnApi || this.agGridSizeControl.selectedType !== GRID_FIT) {
            return;
        }

        requestAnimationFrame(() => {
            if (this.agGridSizeControl.selectedType === GRID_FIT) {
                this.gridColumnApi?.autoSizeAllColumns();
            }
        });
    }
    onGridReady(params: any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.re_new();
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
        this.agEventService.listen().subscribe((data) => {
            // console.log('listening', data)
            if (data) {
                this.menuClick.emit(data);
            }
        })
    }
    private re_new() {
        this.onResize();
        if (this.gridApi) {
            this.totalPages = this.gridApi.paginationGetRowCount();
        }
        this.cdr.detectChanges();
    }
    private sizeToFit() {
        // setTimeout(() => {
        //     this.gridOptions.api?.sizeColumnsToFit();
        //     this.cdr.detectChanges();
        // }, 100);
    }
    paginationControls(e: PageEvent) {
        if (typeof e.previousPageIndex !== 'undefined' && e.previousPageIndex > e.pageIndex) {
            this.gridApi.paginationGoToPreviousPage();
        } else if (typeof e.previousPageIndex !== 'undefined' &&  e.previousPageIndex < e.pageIndex) {
            this.gridApi.paginationGoToNextPage();
        } else {
            this.gridApi.paginationGoToPage(e.pageIndex)
        }
        if (e.pageSize !== this.agGridSizeControl.pageSize) {
            this.agGridSizeControl.pageSize = e.pageSize;
            this.pageSizeChange.emit(e.pageSize);
            this.gridApi.paginationSetPageSize(e.pageSize);
        }
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
