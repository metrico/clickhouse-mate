import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { JSON_parse } from '@app/helper/functions';
import { emitWindowResize } from '@app/helper/windowFunctions';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NgxCsvParser } from 'ngx-csv-parser';
import { AgEventService } from './ag-event.service';
import { isExpanded } from './custom-ag-grid.component';

type ImportEvents = 'submit' | 'drag' | 'dragstart' | 'dragend' | 'dragover' | 'dragenter' | 'dragleave' | 'drop' | 'change'

@Component({
    selector: 'app-setting-button',
    templateUrl: 'setting-button.html',
    styleUrls: ['setting-button.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingButtonComponent implements ICellRendererAngularComp {
    @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef | null = null;
    public params: any;
    callid: string | null= null;
    isFilterOpened: boolean = false;
    allColumnIds: any[] = [];
    apiColumn: any;
    headerName = '';
    isDragOver: boolean = false;
    files: Array<any> = [];
    details: Array<any> = [];
    menuList: any;

    @Input() isTab = false;
    constructor(
        private cdr: ChangeDetectorRef,
        private agEventService: AgEventService,
        private ngxCsvParse: NgxCsvParser
    ) { }

    agInit(params: any): void {
        this.params = params;
        // console.log(params.context.componentParent)
        this.callid = this.params.value || null;
        this.headerName = this.params.displayName || '';
        this.apiColumn = this.params.columnApi;

        this.menuList = this.agEventService.itemList;

        Object.values(this.params.columnApi.getAllGridColumns() as Object)
            .filter((column) => !['', 'id', isExpanded].includes(column.colDef.field))
            .forEach((column, index) => this.allColumnIds.push({
                name: column.colDef.headerName || column.colDef.field,
                field: column.colDef.field,
                selected: column.visible,
                idx: index
            }));
        this.cdr.detectChanges();
    }
    togglePaginator() {
        this.params.context.componentParent.togglePaginator();
    }
    ngAfterViewInit() {
        const hsp = (e: Event) => {
            this.isDragOver = e.type === 'dragover';
            e.preventDefault();
            e.stopPropagation();
        };
        const handlerDrop = (e: any) => {
            hsp(e);
            this.onImport(e.dataTransfer.files)
        };
        const objEvents = {
            submit: hsp, drag: hsp, dragstart: hsp, dragend: hsp,
            dragover: hsp, dragenter: hsp, dragleave: hsp,
            drop: handlerDrop, change: (e: any) => this.onImport(e?.target?.files)
        };
        Object.keys(objEvents).forEach((eventName: any) => {
            this.fileUpload?.nativeElement.addEventListener(eventName, objEvents[eventName as ImportEvents]);
        });
    }
    menuClick(item: any) {
        this.agEventService.emit(item);
    }
    refresh(): boolean {
        return false;
    }
    hideFilter() {
        this.isFilterOpened = false;
        this.cdr.detectChanges();
    }
    onUpdateList({ event: { container } }: any) {
        if (this.apiColumn.getAllColumns()) {
            const activeListView = container.id === 'activeListView' ? container : null;
            const inactiveListView = container.id === 'inactiveListView' ? container : null;
            const columnState = this.apiColumn.getColumnState();
            const setVisible = (fName: string, bool: boolean) => {
                if (columnState.find(({ colId }: any) => colId === fName)?.hide === bool) {
                    this.apiColumn.setColumnVisible(fName, bool);
                }
            };
            inactiveListView?.data.forEach(({ field, selected }: any) => setVisible(field, selected));
            activeListView?.data.forEach(({ field, selected }: any, key: number) => {
                setVisible(field, selected);
                this.apiColumn.moveColumn(field, key + 1);
            });
            setTimeout(() => emitWindowResize(), 100);
        }
    }
    doOpenFilter() {
        if (this.isFilterOpened) {
            return;
        }
        setTimeout(() => {
            this.isFilterOpened = true;
            this.cdr.detectChanges();
        });
        this.cdr.detectChanges();
    }
    onImport(e: any) {
        for (const property in e) {
            if (property !== 'length' && property !== 'item') {
                this.files.push({ data: e[property], inProgress: false, progress: 0, canRetry: false, canCancel: true });
            }
        }
        this.uploadFiles();
    }
    private uploadFiles() {
        if (this.fileUpload) {
            this.fileUpload.nativeElement.value = '';
        }
        this.files.forEach((file: any, index) => {
            this.uploadFile(file, index);
        });
    }
    uploadFile(file: any, fileIndex: number) {
        file.data.text().then((data: any) => {
            let meta = [];
            if(file.data.type === 'application/json') {
                const parsedJSON = JSON_parse(data);
                this.details = this.details.concat(parsedJSON.data);
                meta = parsedJSON?.meta?.map((i: any) => i.name)
                if (this.files.length === fileIndex + 1) {
                    this.params.context.componentParent.import(this.details, meta)
                }
            } else if (file.data.type === 'text/csv') {
                this.ngxCsvParse.parse(file.data, {header: true, delimiter: ','}).pipe().subscribe({
                    next: (result:any): void => {
                        if (this.files.length === fileIndex + 1) {
                            const meta = Object.keys(result[0])
                            this.params.context.componentParent.import(result, meta)
                        }
                    }
                })
            }

        })
        const formData = new FormData();
        formData.append('file', file.data);
        console.log(file.data)
        file.inProgress = true;
        this.cdr.detectChanges();

    }
}
