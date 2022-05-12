import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-row-details',
    templateUrl: './row-details.component.html',
    styleUrls: ['./row-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowDetailsComponent implements OnInit {
    constructor(private cdr: ChangeDetectorRef) {}
    
    private _row: Map<string, any> = new Map();
    public get row(): Map<string, any> {
        return this._row;
    }
    @Input()
    public set row(value: Map<string, any>) {
        this._row = value;
        console.log(value)
        this.cdr.detectChanges()
    }
    ngOnInit(): void {}
}
