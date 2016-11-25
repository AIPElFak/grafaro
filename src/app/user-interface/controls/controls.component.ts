import {Component, OnInit, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'grf-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

    @Output()
    public stateNumberChange = new EventEmitter<string>();

    public onNext(): void {
        this.stateNumberChange.emit('next');
    }

    public onPrev(): void {
        this.stateNumberChange.emit('prev');
    }

    public onFirst(): void {
        this.stateNumberChange.emit('first');
    }

    public onLast(): void {
        this.stateNumberChange.emit('last');
    }

    constructor() {
    }

    ngOnInit() {
    }

}