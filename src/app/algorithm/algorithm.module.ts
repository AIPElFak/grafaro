import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlgorithmComponent} from './algorithm.component';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import {LineNumberStylePipe} from './line-number-style.pipe';
import {AnnotationModule} from '../annotation/annotation.module';

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
        AnnotationModule,
    ],
    declarations: [
        AlgorithmComponent,
        LineNumberStylePipe,
    ],
    exports: [
        AlgorithmComponent,
    ],
})
export class AlgorithmModule {
}
