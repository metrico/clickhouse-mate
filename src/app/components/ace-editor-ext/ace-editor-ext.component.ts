import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { DictionaryDefault } from './dictionary-default';

@Component({
    selector: 'ace-editor-ext',
    templateUrl: './ace-editor-ext.component.html',
    styleUrls: ['./ace-editor-ext.component.scss']
})
export class AceEditorExtComponent implements OnInit, AfterViewInit {

    @Input() sqlRequest: any = '';
    @Input() dictionaryFull: any[] = [];

    @Output() sqlRequestChange: any = new EventEmitter<string>();
    @Output() ready: any = new EventEmitter<string>();

    @ViewChild('editor') editor: any;
    @ViewChild('autocomplete') autocomplete: any;

    dictionary: any[] = [];
    wasClick: boolean = false;
    lastWord: any;
    isAutocompleteVisible: boolean = false;

    options = {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    };

    ngOnInit() {
        this.dictionaryFull.push(...DictionaryDefault);
    }

    ngAfterViewInit() {
        this.editor.getEditor().$blockScrolling = Infinity;
        document.body.appendChild(this.autocomplete.nativeElement);
    }

    textChange(event?: any) {
        if (this.wasClick) {
            this.wasClick = false;
            return;
        }

        this.sqlRequest = event;
        this.lastWord = (event + '').split(/\s+/).pop();
        const position: any = document.querySelector('.ace_text-input')?.getBoundingClientRect();
        const el = this.autocomplete.nativeElement;
        el.style.left = `${position.left || 0}px`;
        el.style.top = `${position.top || 0}px`;

        if (this.lastWord) {
            this.dictionary = this.dictionaryFull.filter(i => i.toLowerCase().includes(this.lastWord.toLowerCase()));
        } else {
            this.dictionary = this.dictionaryFull;
        }

        this.isAutocompleteVisible = !!this.lastWord;
        console.log(this.lastWord, position);
    }
    onClickRun(event?: any) {
        this.ready.emit(event)
    }
    onItemClick(event: any) {
        const W = this.sqlRequest.split(/\s+/);
        if (W[W.length - 1] == "") {
            W.push(event);
        } else {
            W[W.length - 1] = event;
        }
        this.sqlRequest = W.join(" ") + " ";
        this.wasClick = true;
        this.textChange(this.sqlRequest);
        this.isAutocompleteVisible = false;

        console.log(event, W)
    }
}
