import { Component, Input, OnInit } from '@angular/core';
import { RowValue } from '@app/models/grid.model';

@Component({
  selector: 'app-object-row',
  template: `
    <ngx-json-viewer [json]='value.value'></ngx-json-viewer>
  `,
  styles: [
  ]
})
export class ObjectRowComponent implements OnInit {
    private _value: any;
    public get value(): any {
        return this._value;
    }
    @Input()
    public set value(value: RowValue) {

        this._value = value;
    }
    private _column: string = '';
    public get column(): string {
        return this._column;
    }
    @Input()
    public set column(value: string) {
        this._column = value;
        console.log(value);
    }
  constructor() { }

  ngOnInit(): void {
  }

}
