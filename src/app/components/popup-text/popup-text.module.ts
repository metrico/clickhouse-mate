import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupTextComponent } from './popup-text.component';

@NgModule({
  imports: [
        CommonModule,
        NgxJsonViewerModule
  ],
  declarations: [PopupTextComponent],
  exports: [PopupTextComponent]
})
export class PopupTextModule { }
