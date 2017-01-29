import {Component, OnInit, Input} from '@angular/core';
import {DebugDataValue} from '../../algorithms/algorithm-base';

@Component({
    selector: 'grf-node',
    templateUrl: 'debug-value-single.component.html',
    styleUrls: ['debug-value-single.component.scss'],
})
export class NodeComponent implements OnInit {

    @Input() data: DebugDataValue;

    constructor() {
    }

    ngOnInit() {
    }

}
