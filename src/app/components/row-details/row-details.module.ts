import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowDetailsComponent } from './row-details.component';
import { NormalRowComponent } from './row-types/normal-row.component';
import { ObjectRowComponent } from './row-types/object-row.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
    declarations: [RowDetailsComponent, NormalRowComponent, ObjectRowComponent],
    imports: [CommonModule, NgxJsonViewerModule],
    exports: [RowDetailsComponent],
})
export class RowDetailsModule {}
