/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {WebSocketService} from './websocket.service';

// TODO
xdescribe('Service: WebSocket', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebSocketService]
        });
    });

    it('should ...', inject([WebSocketService], (service: WebSocketService) => {
        expect(service).toBeTruthy();
    }));
});
