import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    ComponentFactory
} from '@angular/core';
import {GraphOptionsService} from '../graph-options.service';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {ToastService} from '../toast/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {JoinSocketService} from '../project-browser/join.service';
import {GraphSocketService} from './graph-socket.service';
import {GraphManager} from '../managers/graph.manager';
import {MasterSocketService} from './master-socket.service';
import {GraphTemplateService} from './graph-template.service';
import {Observable} from 'rxjs';
import {GraphPath} from '../user-interface/file-list/file-list.service';

@Component({
    selector: 'grf-user-interface',
    templateUrl: 'project-view.component.html',
    styleUrls: ['project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {

    public graphTemplate$: Observable<any>;

    public isSaveDialogOpen: boolean = false;
    public isLoadDialogOpen: boolean = false;

    @ViewChild('renamePopupOutlet', {read: ViewContainerRef})
    public viewContainerRef: ViewContainerRef;

    @ViewChild('toastOutlet', {read: ViewContainerRef})
    public toastOutlet: ViewContainerRef;

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

    public save() {
        console.log('TODO save graph');
    }

    public saveDialogToggle(): void {
        this.isSaveDialogOpen = !this.isSaveDialogOpen;
    }

    public loadDialogToggle(): void {
        this.isLoadDialogOpen = !this.isLoadDialogOpen;
    }

    public loadGraph(path: GraphPath): void {
        this._graphTemplateService.getGraph(path.folder, path.filename)
            .subscribe(graphJson => {
                this._graphManager.graphFromSocket(graphJson);
                this.loadDialogToggle();
            });
    }

    constructor(private graphOptionsService: GraphOptionsService,
                componentFactoryResolver: ComponentFactoryResolver,
                private toastService: ToastService,
                private _graphTemplateService: GraphTemplateService,
                private activeRoute: ActivatedRoute,
                private _joinService: JoinSocketService,
                private graphSocketService: GraphSocketService,
                private _graphManager: GraphManager,
                private _masterSocket: MasterSocketService,
                private _router: Router) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);

    }

    ngOnInit() {
        this._joinService.joinSocket$
            .subscribe(joinMessage => {
                // On error, change route to 404
                if (joinMessage.error != '') {
                    this._router.navigate(['/error']);
                    console.log('TODO: better error handling');
                    console.error(joinMessage.error);
                } else {
                    this._joinService.setRoom(joinMessage.roomId);
                }
            });

        const roomId = this.activeRoute.snapshot.params['id'];
        this._joinService.joinRoom(roomId);

        this.graphSocketService.graphSocket$.subscribe(graphMessage => {
            this._graphManager.graphFromSocket(graphMessage.graph);
        });

        this._masterSocket.masterSocket$
            .subscribe(masterMessage => {
                this.graphSocketService.canSend = masterMessage.isMaster;
            });

        this._graphManager.graph$.subscribe(graph => {
            this.graphSocketService.send(graph.writeJson());
        });

        // Initial settings
        this.graphOptionsService.setOptions([
            {name: 'physics.enabled', value: false},
        ]);

        this.graphTemplate$ = this._graphTemplateService.getGraphsInfo();
    }

}
