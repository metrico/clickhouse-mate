import { MatIconModule } from '@angular/material/icon';
import { SafePipe } from './safe.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChHelpComponent } from './ch-help.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
    ],
    declarations: [ChHelpComponent, SafePipe],
    exports: [ChHelpComponent]
})
export class ChHelpModule { }
