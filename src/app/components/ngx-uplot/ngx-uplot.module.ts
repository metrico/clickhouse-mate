import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUplotComponent } from './ngx-uplot.component';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [NgxUplotComponent],
    exports: [NgxUplotComponent]
})
export class NgxUplotModule { }
