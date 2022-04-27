import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AceEditorExtComponent } from './ace-editor-ext.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { AceModule, ACE_CONFIG, AceConfigInterface } from 'ngx-ace-wrapper';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {};

@NgModule({
    imports: [
        CommonModule,
        AceEditorModule,
        AceModule,
        MatIconModule,
        MatButtonModule,
    ],
    declarations: [AceEditorExtComponent],
    exports: [AceEditorExtComponent],
    providers: [
        { provide: ACE_CONFIG, useValue: DEFAULT_ACE_CONFIG }

    ],

})
export class AceEditorExtModule { }
