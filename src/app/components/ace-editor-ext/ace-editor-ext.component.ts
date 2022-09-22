import { DocsService } from './../../services/docs.service';
import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    AfterViewInit,
    HostListener,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy
} from '@angular/core';
import { DictionaryDefault } from './dictionary-default';

@Component({
    selector: 'ace-editor-ext',
    templateUrl: './ace-editor-ext.component.html',
    styleUrls: ['./ace-editor-ext.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AceEditorExtComponent implements OnInit, AfterViewInit, OnDestroy {
    _sqlRequest: any = '';
    @Input()
    set sqlRequest(value: string) {
        this._sqlRequest = value;
        const el = this.getTextElement();
        if (el?.innerText !== value) {
            const caret = this.getCaretPosition();
            el.innerText = value;
            if (this.lastCaretPoint) {
                this.setCaret(caret);
            }
        }

    }
    get sqlRequest(): string {
        return this._sqlRequest;
    }


    @Input() isDarkMode = false;
    lastCaretPoint = 0;
    _dictionaryFull: any[] = [];
    delayShowPopup: number = 1500;
    _awaitInterval: any;

    @Input()
    set dictionaryFull(val: any[]) {
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
    @ViewChild('contenteditableContainer') contenteditableContainer: any;

    dictionary: any[] = [];
    wasClick: boolean = false;
    lastWord: any;
    isAutocompleteVisible: boolean = false;
    _interval: any;
    options = {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    };
    constructor(
        private docsService: DocsService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._dictionaryFull.push(...DictionaryDefault);
        this._dictionaryFull.sort();

        this._interval = setInterval(() => {
            this.cdr.detectChanges();
        }, 1000)
    }

    ngAfterViewInit() {
        this.editor.getEditor().$blockScrolling = Infinity;
        document.body.appendChild(this.autocomplete.nativeElement);
    }

    mouseUp() {
        this.getCaretPosition();
        if (this.isAutocompleteVisible) {
            this.textChange();
        }
    }
    textChange(event?: any) {
        if (this.wasClick) {
            this.wasClick = false;
            return;
        }

        if (event && ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            console.log('textChange', { event });
            return;
        }

        this.lastWord = this.getWordByCaretPosition();

        const selection: any = window.getSelection();
        const range = selection.getRangeAt(0);
        const [rect] = range.getClientRects();

        const position: any = rect || this.getTextElement()?.getBoundingClientRect() || {
            left: 0,
            right: 0
        };
        const el = this.autocomplete.nativeElement;
        el.style.left = `${position.left || 0}px`;
        el.style.top = `${(position.top || 0) + 15}px`;

        if (this.lastWord) {
            try {
                const rx = new RegExp('^' + this.lastWord.toLowerCase(), 'g');
                this.dictionary = this.dictionaryFull.filter(
                    i => i.name.toLowerCase().match(rx)
                );
            } catch (_) { }
        } else {
            this.dictionary = this.dictionaryFull;
        }

        this.isAutocompleteVisible = !!this.lastWord && this.dictionary.length > 0;
        console.log(this.lastWord, position);
        this.cdr.detectChanges();
    }
    getTextElement(): any {
        return document.querySelector('.hide-text-container');
    }

    @HostListener('document:keydown', ['$event'])
    onClickRun(event: any = null) {
        if (event?.code === 'Escape') {
            this.isAutocompleteVisible = false;
            this.cdr.detectChanges();
        }
        if (event?.ctrlKey && event?.code === 'Space') {
            console.log('CTRL + SPACE');
            this.textChange();
            this.cdr.detectChanges();
            return;
        }

        if (
            event === 'QUERY' || (event?.ctrlKey && event?.code === 'Enter')
        ) {
            console.log('CTRL + ENTER', event);
            this.isAutocompleteVisible = false;
            console.log('RUN QUERY SELECTION', event);
            this.ready.emit(this.sqlRequest);
            this.cdr.detectChanges();
        }
    }
    getCaretPosition() {
        const sel: any = window.getSelection();
        if (sel?.focusNode?.parentNode?.className === 'hide-text-container') {
            const an = sel.anchorNode;
            const sortedNodes = Array.from(an.parentElement.childNodes);
            const nodeIndex = sortedNodes.findIndex((i: any) => i === an);
            const beforeNodesLength = sortedNodes.reduce((a: number, b: any, k: number) => {
                if (nodeIndex > k) {
                    if (b.tagName === 'BR') {
                        a++;
                    } else {
                        a += b.length;
                    }
                }
                return a
            }, 0);
            const out = sel?.focusOffset + beforeNodesLength;
            this.lastCaretPoint = out;
        }

        return this.lastCaretPoint;
    }
    setCaret(position: number) {
        if (!position) {
            return;
        }
        position = Math.min(position, this.sqlRequest.length);
        const el = document.getElementsByClassName("hide-text-container");
        const range = document.createRange();
        const sel: any = window.getSelection();
        const { childNodes } = el[0];

        let n = position;
        let m = 0;
        const currentTextNode: any = Array.from(childNodes)
            .find((i: any) => {
                m = i.tagName === 'BR' ? 1 : i.length;
                n -= m;
                return n < 0
            });
        if (currentTextNode) {
            range.setStart(currentTextNode, n + m);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        }
        this.cdr.detectChanges();
    }
    autocompleteSelectorIndex = 0;

    keydown(event: KeyboardEvent) {
        console.log('keydown', event, this.isAutocompleteVisible);

        if (['Control'].includes(event.key) || event.ctrlKey) {
            this.onClickRun(event);
            return;
        }

        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
                if (!this.isAutocompleteVisible) {
                    return;
                }
                this.autocompleteSelectorIndex += (event.key === "ArrowDown" ? 1 : -1);
                this.autocompleteSelectorIndex = Math.max(Math.min(this.autocompleteSelectorIndex, this.dictionary.length - 1), 0);

                this.textChange();
                event.preventDefault();
                event.stopPropagation();
                this.cdr.detectChanges();
                return;

            case "Enter":
                if (this.isAutocompleteVisible) {
                    this.onItemClick(this.dictionary[this.autocompleteSelectorIndex]);
                    event.stopPropagation();
                    event.preventDefault();
                } else {
                    this.insertCharByCaretPosition(`\n`);
                    event.stopPropagation();
                    event.preventDefault();
                }
                return;
            case 'Tab':
                this.insertCharByCaretPosition(`  `);
                event.stopPropagation();
                event.preventDefault();
                return;

            case 'Escape':
                this.isAutocompleteVisible = false;
                this.cdr.detectChanges();
                return;

            default:
                // requestAnimationFrame(() => {
                console.log("keydown:event", event);
                this.textChange(this.sqlRequest)
                event.stopPropagation();
                // })
                break;
        }

        this.cdr.detectChanges();
    }
    insertCharByCaretPosition(char = '') {
        this.getCaretPosition();
        let start = this.sqlRequest.slice(0, this.lastCaretPoint);
        let end = this.sqlRequest.slice(this.lastCaretPoint);
        this.lastCaretPoint = (start + char).length;
        this.sqlRequest = start + char + end;
        requestAnimationFrame(() => {
            this.setCaret((start + char).length);
            this.cdr.detectChanges();
        })
        this.cdr.detectChanges();
    }
    onItemClick(event: any) {
        console.log('onItemClick', event);

        this.replaceByPositionCaret(event?.name);
        this.textChange(this.lastCaretPoint);
        this.isAutocompleteVisible = false;
        this.cdr.detectChanges();
    }
    replaceByPositionCaret(replacementWord: string) {
        this.getCaretPosition()
        let start = this.sqlRequest.slice(0, this.lastCaretPoint);
        let end = this.sqlRequest.slice(this.lastCaretPoint);
        start = start.match(/^.+\s/mg)?.join('') || '';
        end = end.match(/\s.+$/mg)?.join('') || '';
        this.sqlRequest = start + replacementWord + end;
        setTimeout(() => {
            let inc = 0;
            if (replacementWord.match(/\)$/g)) {
                // is a function word
                inc = -1;
            }
            this.setCaret((start + replacementWord).length + inc);
        }, 50)
    }
    setRequestData() {
        this.sqlRequest = this.getTextElement()?.innerText;
        this.cdr.detectChanges();
    }
    private getWordByCaretPosition() {
        this.getCaretPosition();
        // console.log(this.sqlRequest, this.lastCaretPoint);
        const [lastWord] = this.sqlRequest.slice(0, this.lastCaretPoint).match(/\S+$/g) || [''];
        // console.log({ lastWord });
        return lastWord;
    }
    setInfo(doc_link: string) {
        this.docsService.setLink(doc_link);
    }
    ngOnDestroy() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }
}
