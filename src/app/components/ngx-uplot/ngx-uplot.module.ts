import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUplotComponent } from './ngx-uplot.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        FormsModule
    ],
    declarations: [NgxUplotComponent],
    exports: [NgxUplotComponent]
})
export class NgxUplotModule { }
