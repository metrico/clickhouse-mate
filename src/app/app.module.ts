// import { MatButtonModule } from '@angular/material/button';
import { ChHelpModule } from './components/ch-help/ch-help.module';
import { AceEditorExtModule } from './components/ace-editor-ext/ace-editor-ext.module';
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
import { LoginFormModule } from './components/login-form/login-form.module';
import { AlertService } from './services/alert.service';
import { LoadingCircleModule } from './components/loading-circle/loading-circle.module';
import { NgxUplotModule } from './components/ngx-uplot/ngx-uplot.module';
import { DialogKioskComponent } from './pages/dialogs/dialog-kiosk/dialog-kiosk.component';
// import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        DialogKioskComponent
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
        CustomAgGridModule,
        LoginFormModule,
        AceEditorExtModule,
        LoadingCircleModule,
        ChHelpModule,
        NgxUplotModule,
        // MatDialogModule,
        // MatButtonModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        { provide: APP_BASE_HREF, useValue: (window as any)['base-href'] },
        AlertService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
