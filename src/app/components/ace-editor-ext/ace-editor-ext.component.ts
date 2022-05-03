import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { DictionaryDefault } from './dictionary-default';

@Component({
    selector: 'ace-editor-ext',
    templateUrl: './ace-editor-ext.component.html',
    styleUrls: ['./ace-editor-ext.component.scss']
})
export class AceEditorExtComponent implements OnInit, AfterViewInit {

    @Input() sqlRequest: any = '';

    _dictionaryFull: any[] = [];

    @Input()
    set dictionaryFull(val: any[]) {
        console.log(val);
        this._dictionaryFull = val;
        this._dictionaryFull.sort();
    }
    get dictionaryFull() {
        return this._dictionaryFull;
    }

    @Output() sqlRequestChange: any = new EventEmitter<string>();
    @Output() ready: any = new EventEmitter<string>();

    @ViewChild('editor') editor: any;
    @ViewChild('wrapperAceEditor') wrapperAceEditor: any;
    @ViewChild('autocomplete') autocomplete: any;
    @ViewChild('autocompleteForm') autocompleteForm: any;

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
        this._dictionaryFull.push(...DictionaryDefault);
        this._dictionaryFull.sort();
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
        const position: any = this.getTextElement()?.getBoundingClientRect() || {
            left: 0,
            right: 0
        };
        const el = this.autocomplete.nativeElement;
        el.style.left = `${position.left || 0}px`;
        el.style.top = `${position.top || 0}px`;

        if (this.lastWord) {
            // this.dictionary = this.dictionaryFull.filter(i => i.toLowerCase().includes(this.lastWord.toLowerCase()));
            this.dictionary = this.dictionaryFull.filter(i => i.toLowerCase().match(new RegExp('^' + this.lastWord.toLowerCase(), 'g')));
        } else {
            this.dictionary = this.dictionaryFull;
        }

        this.isAutocompleteVisible = !!this.lastWord;
        if (this.isAutocompleteVisible === false) {
            this.getTextElement()?.focus();
        } else {
            this.setFocusMenu();
        }
        console.log(this.lastWord, position);
    }
    getTextElement(): HTMLElement {
        return this.wrapperAceEditor?.nativeElement?.querySelector('.ace_text-input');
    }
    setFocusMenu() {
        return;
        const f = () => {
            requestAnimationFrame(() => {
                this.isAutocompleteVisible = true;
                this.autocompleteForm.nativeElement.focus();
                console.log('this.autocompleteForm.nativeElement.focus();', this.autocompleteForm.nativeElement)
                console.log(document.activeElement)
                if (document.activeElement) {

                }
                // f();
            })
        }
        f();

    }

    @HostListener('document:keydown', ['$event'])
    onClickRun(event?: any) {
        console.log({ event })
        if (!event || event.ctrlKey) {
            if (event.code === 'Space') {
                this.setFocusMenu();
            }
            if (event.code === 'Enter') {
                this.ready.emit(this.sqlRequest);
            }
        }
    }
    keydown(event: KeyboardEvent) {
        console.log('keydown', event);
    }

    onItemClick(event: any) {
        const W = this.sqlRequest.split(/\s+/);
        if (W[W.length - 1] == "") {
            W.push(event);
        } else {
            W[W.length - 1] = event;
        }
        this.sqlRequest = W.join(" ") + " ";
        // this.wasClick = true;
        this.textChange(this.sqlRequest);
        this.isAutocompleteVisible = false;

        console.log(event, W)
    }
}
