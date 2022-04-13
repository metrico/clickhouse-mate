import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-drag-drop-list',
    templateUrl: './drag-drop-list.component.html',
    styleUrls: ['./drag-drop-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DragDropListComponent implements OnInit {
    _list: Array<any>;
    inactiveList: Array<any> = [];
    activeList: Array<any> = [];

    @Output() change = new EventEmitter<any> ();
    @Output() order = new EventEmitter<any> ();
    @Input() sortlistactive: Array<any>;
    @Input('list') set list(val) {
        this._list = val;
        this.activeList = [];
        this.inactiveList = [];
        this.list.forEach((item: any) => {
            if (item.selected) {
                this.activeList.push(item);
            } else {
                this.inactiveList.push(item);
            }
        });
    }

    get list() {
        return this._list;
    }

    ngOnInit () {
        if (this.sortlistactive && this.sortlistactive.length > 0) {
            const _activeList = [];
            this.sortlistactive.forEach((item: any) => {
                _activeList.push(this.activeList.find(i => i.id === item.field_name));

            });
            this.activeList = _activeList;
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
        this.inactiveList.forEach((item: any) => {
            item.selected = false;
        });

        this.activeList.forEach((item: any) => {
            item.selected = true;
        });
        const newProto = [].concat(this.activeList, this.inactiveList);
        const sortedProto = newProto.sort((a, b) => a.idx - b.idx);
        this.change.emit(newProto);
        this.order.emit({
            sortedProto: sortedProto,
            newProto: newProto,
            event: event
        });
    }
}
