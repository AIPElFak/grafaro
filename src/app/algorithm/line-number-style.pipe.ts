import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'lineNumberStyle'})
export class LineNumberStylePipe implements PipeTransform {

    transform(lineNumber: number,
              box: HTMLElement,
              totalLineNumbers: number): string {
        if (totalLineNumbers == null) {
            totalLineNumbers = 0;
        }
        lineNumber--;
        const height = box.scrollHeight;
        const notch = height / totalLineNumbers;
        const yCenter = notch * lineNumber;
        return `${yCenter}px`;
    }

}
