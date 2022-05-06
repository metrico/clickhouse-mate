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
            this.dictionary = this.dictionaryFull.filter(
                i => i.toLowerCase().match(
                    new RegExp('^' + this.lastWord.toLowerCase(), 'g')
                )
            );
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
    getTextElement(): any {
        return this.wrapperAceEditor?.nativeElement?.querySelector('.ace_text-input');
    }
    setFocusMenu() {
        // return;
        const f = () => {
            requestAnimationFrame(() => {
                this.isAutocompleteVisible = true;
                this.autocompleteForm.nativeElement.focus();
                this.autocompleteForm.nativeElement.value = this.sqlRequest;
                this.syncInternalFields();
            })
        }
        f();

    }

    @HostListener('document:keydown', ['$event'])
    onClickRun(event?: any) {
        console.log({ event })
        if (!event || event.ctrlKey) {
            if (event?.code === 'Space') {
                this.setFocusMenu();
            }
            if (event?.code === 'Enter' || typeof event === 'undefined') {
                this.ready.emit(this.sqlRequest);
            }
        }
    }
    syncInternalFields() {
        console.log('syncInternalFields' , this.getTextElement().value);
        // if (this.sqlRequest.length < this.autocompleteForm.nativeElement.value.length) {
            this.sqlRequest = this.autocompleteForm.nativeElement.value;
        // } else {
            // this.autocompleteForm.nativeElement.value = this.sqlRequest;
        // }
        // requestAnimationFrame(() => {

        //     // this.syncInternalFields();
        //     this.sqlRequest = this.autocompleteForm.nativeElement.value;
        // });
    }
    autocompleteSelectorIndex = 0;
    keydown(event: KeyboardEvent) {

        switch (event.key) {
            case "ArrowDown":
                this.autocompleteSelectorIndex++;
                event.preventDefault();
                break;
            case "ArrowUp":
                this.autocompleteSelectorIndex--;
                event.preventDefault();
                break;

            case "Enter":
            case "Space":
                this.onItemClick(this.dictionary[this.autocompleteSelectorIndex])
                event.preventDefault();
                break;

            default:
                console.log("event", event);
                this.syncInternalFields();
                // event.preventDefault();
                event.stopPropagation();
                break;
        }
        this.autocompleteSelectorIndex = Math.max(Math.min(this.autocompleteSelectorIndex, this.dictionary.length - 1), 0);
        console.log('keydown:SelectorIndex', this.autocompleteSelectorIndex);
        // const newEvent = new CustomEvent('keydown', event);
        // const txtArea = this.getTextElement();
        // console.log({ txtArea });
        // txtArea?.dispatchEvent(newEvent);
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
