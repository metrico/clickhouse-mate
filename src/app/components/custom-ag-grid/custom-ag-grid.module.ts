import { AgEventService } from './ag-event.service';
import { DragDropListComponent } from './drag-drop-list/drag-drop-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { SettingButtonComponent } from './setting-button';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAgGridComponent } from './custom-ag-grid.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { ExpandRendererComponent } from './renderers/expand-renderer/expand-renderer.component';
import { MatIconModule } from '@angular/material/icon';
import { FullRowRendererComponent } from './renderers/full-row-renderer/full-row-renderer.component';
import { MatTableModule } from '@angular/material/table';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatButtonModule,
        FormsModule,
        AgGridModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        DragDropModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        NgxCsvParserModule,
        NgxJsonViewerModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        CustomAgGridComponent,
        SettingButtonComponent,
        DragDropListComponent,
        ExpandRendererComponent,
        FullRowRendererComponent
    ],
    exports: [CustomAgGridComponent],
    providers: [AgEventService]
})
export class CustomAgGridModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas as any, fab as any, far as any);
    }
}
