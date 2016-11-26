import {Pipe, PipeTransform} from "@angular/core";
import {GrfGraphNodeOptions} from "./graph.module";
import {ColorThemeService} from "../color-theme.service";

@Pipe({
    name: 'graphNodeOptionsTransform',
})
export class GraphNodeOptionsTransformPipe implements PipeTransform {

    constructor(private theme: ColorThemeService) {}

    transform(options: GrfGraphNodeOptions): any {
        const colorVisited = {
            background: '#afafaf',
            border: '#6f6f6f',
            highlight: {
                background: '#cfcfcf',
                border: '#9f9f9f',
            },
            hover: {
                background: '#bfbfbf',
                border: '#7f7f7f',
            },
        };

        const colorDefault = {
            background: '#f7f7f7',
            border: '#afafaf',
            highlight: {
                background: '#efefef',
                border: '#b7b7b7',
            },
            hover: {
                background: '#e7e7e7',
                border: '#afafaf',
            },
        };

        const color = options.isAccentColor ? this.theme.palette.accent :
            options.isPrimaryColor ? this.theme.palette.primary :
                options.isSecondaryColor ? this.theme.palette.second :
                    options.isDimmedColor ? colorVisited : colorDefault;

        const shape = 'circle';

        return {
            id: options.id,
            label: options.label,
            color,
            shape,
        };
    }

}
