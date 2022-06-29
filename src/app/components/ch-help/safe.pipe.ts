import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    public transform(value: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }

}
