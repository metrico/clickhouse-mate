import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    HttpClientModule
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app.material-module';
import { HomePageComponent } from './pages/home.page/home.page.component';
import { CustomTableModule } from './components/custom-table/custom-table.module';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import { TreeFilterModule } from './components/tree-filter/tree-filter.module';
import { CustomAgGridModule } from './components/custom-ag-grid/custom-ag-grid.module';
import { AceEditorModule } from 'ng2-ace-editor';
import { AceModule, ACE_CONFIG, AceConfigInterface } from 'ngx-ace-wrapper';
const DEFAULT_ACE_CONFIG: AceConfigInterface = {};
@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent
    ],
    imports: [
        BrowserModule,
        CustomTableModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        HttpClientModule,
        AngularSplitModule,
        TreeFilterModule,
        AceModule,
        AceEditorModule,
        CustomAgGridModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        { provide: APP_BASE_HREF, useValue: (window as any)['base-href'] },
        { provide: ACE_CONFIG, useValue: DEFAULT_ACE_CONFIG },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
