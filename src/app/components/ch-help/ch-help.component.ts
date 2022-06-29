import { DocsService } from './../../services/docs.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ch-help',
    templateUrl: './ch-help.component.html',
    styleUrls: ['./ch-help.component.scss']
})
export class ChHelpComponent implements OnInit {
    link_prefix = 'https://clickhouse.com/docs/en/sql-reference/statements/';
    link = this.link_prefix;

    constructor(private docsService: DocsService) { }

    ngOnInit(): void {
        this.docsService.listen().subscribe(doc_link => {
            this.link = this.link_prefix + (doc_link || '');
        });
    }
    onClose() {
        this.docsService.setLink(null);
    }
}
