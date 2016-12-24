import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {VisNetworkModule} from '@lazarljubenovic/vis-ng/core';
import {GraphNodeOptionsTransformPipe} from './graph-node-options-transform.pipe';
import {GraphEdgeOptionsTransformPipe} from './graph-edge-options-transform.pipe';
import {ColorThemeService} from '../color-theme.service';

export interface GrfGraphNodeOptions {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    isStart: boolean;
    isEnd: boolean;
    isAccentColor: boolean;
    isPrimaryColor: boolean;
    isSecondaryColor: boolean;
    isDimmedColor: boolean;
}

export interface GrfGraphEdgeOptions {
    id: string;
    label: string;
    from: string;
    to: string;
}

@NgModule({
    imports: [
        CommonModule,
        VisNetworkModule.forRoot(),
    ],
    declarations: [
        GraphComponent,
        GraphNodeOptionsTransformPipe,
        GraphEdgeOptionsTransformPipe,
    ],
    exports: [
        GraphComponent,
    ],
    providers: [
        ColorThemeService,
    ],
})
export class GraphModule {
}
