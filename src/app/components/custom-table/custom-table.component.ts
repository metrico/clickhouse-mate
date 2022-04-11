import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

function JSON_parse(jsonString: string): any {
  try {
    if (typeof JSON.parse(jsonString) === 'object') {
      return JSON.parse(jsonString);
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTableComponent implements AfterViewInit {
  @Input() columns: any[] = [];
  @Input() columnsFilter: any[] = [];

  @Output() rowClick: EventEmitter<any> = new EventEmitter();
  @Output() rowDblClick: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort, { static: false }) sort: any;
  @ViewChild(MatPaginator, { static: false }) paginator: any;

  dataSource = new MatTableDataSource([]);
  tableFilters: any[] = [];
  _details: any;
  @Input() isPaginator = true;
  @Input()
  set details(val: any) {
    this._details = val;
  }
  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
    if (this.isPaginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.data = this._details;
    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter: any = [];
      const filters = JSON_parse(filtersJson);

      filters.forEach((filter: any) => {
        const value = data[filter.id] === null ? '' : data[filter.id] + '';
        matchFilter.push(value.toLowerCase().includes((filter.value + '').toLowerCase()));
      });
      return matchFilter.every(Boolean);
    };
    this.cdr.detectChanges();
  }

  onRowClick(row: any, indexItem: any, event?: any) {
    this.rowClick.emit({ row, indexItem, event });
  }
  onRowDblClick(row: any, indexItem: any, event?: any) {
    this.rowDblClick.emit({ row, indexItem, event });
  }
  checkFilterColumn(columnName: string): boolean {
    return !!this.columnsFilter.includes(columnName);
  }
  applyFilter(event: any, columnId: string): void {
    const filterValue = event.target?.value || '';
    const itemFilter: any = this.tableFilters.find(i => i.id === columnId);
    if (itemFilter) {
      itemFilter.value = filterValue;
    } else {
      this.tableFilters.push({
        id: columnId,
        value: filterValue + ''
      });
    }
    this.tableFilters = this.tableFilters.filter((i: any) => !!i.value);
    this.dataSource.filter = JSON.stringify(this.tableFilters);
    if (this.isPaginator && this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    this.cdr.detectChanges();
  }
}
