import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GetParamsService } from './services/get-params.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = 'ClickHousePlay';

    constructor(private getParamsService: GetParamsService) {
    }
}
