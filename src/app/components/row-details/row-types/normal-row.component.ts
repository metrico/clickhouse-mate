import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Row, RowValue } from '@app/models/grid.model';

@Component({
    selector: 'app-normal-row',
    template: ` <p><span class="column">{{column}}</span> <span class="value">{{value.value}}</span></p> `,
    styles: [`
    .column {
        width: 30%;
        margin-right: 5px;
        border-bottom: 1px solid hsl(0, 0%, 0%);
    };
    p {
        
        border-bottom: 1px solid hsl(0, 0%, 0%);
    };
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalRowComponent implements OnInit {
    private _value: any;
    public get value(): any {
        return this._value;
    }
    @Input()
    public set value(value: RowValue) {
        this._value = value;
        console.log(value);
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
    constructor() {}

    ngOnInit(): void {}
}
