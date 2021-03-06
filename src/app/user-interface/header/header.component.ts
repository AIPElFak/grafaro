import {Component, OnInit, Input, ViewChild, ElementRef, HostBinding} from '@angular/core';
import {RoomEditService} from '../../room-view/room-edit.service';
import {Auth0Service} from '../../core/auth0.service';
import {Observable} from 'rxjs';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'grf-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() public projectTitle: string = 'Untitled';
    @Input() public projectDescription: string = `Project Untitled doesn't have a description.`;

    @HostBinding('class.project-view-mode')
    @Input() public isProjectViewMode: boolean = false;

    @Input() public isProjectTitleEditable: boolean = true;

    @ViewChild('titleInput') public newInputElRef: ElementRef;
    @ViewChild('descriptionInput') public newDescriptionElRef: ElementRef;
    @ViewChild('nameInput') public newNameElRef: ElementRef;

    public isTitleInEditMode: boolean = false;
    public isDescriptionInEditMode: boolean = false;

    public newTitle: string;
    public newDescription: string;

    public displayName: string = '';
    public newName: string;
    public isNameInEditMode: boolean = false;

    public isMaster$: Observable<boolean>;

    public openTitleEditMode() {
        this.isTitleInEditMode = true;
        setTimeout(() => {
            this.newInputElRef.nativeElement.focus();
            this.newInputElRef.nativeElement.select();
        });
    }

    public openDescriptionEditMode() {
        this.isDescriptionInEditMode = true;
        setTimeout(() => {
            this.newDescriptionElRef.nativeElement.focus();
            this.newDescriptionElRef.nativeElement.select();
        });
    }

    public openNameEditMode() {
        this.isNameInEditMode = true;
        setTimeout(() => {
            this.newNameElRef.nativeElement.focus();
            this.newNameElRef.nativeElement.select();
        });
    }

    public submitTitle() {
        if (this.projectTitle != this.newTitle) {
            this.updateNameDescription();
        }

        this.projectTitle = this.newTitle;
        this.isTitleInEditMode = false;
    }

    public submitDescription() {
        if (this.projectDescription != this.newDescription) {
            this.updateNameDescription();
        }

        this.projectDescription = this.newDescription;
        this.isDescriptionInEditMode = false;
    }

    public submitName() {
        if (this.displayName != this.newName) {
            this.updateDisplayName();
        }

        this.displayName = this.newName;
        this.isNameInEditMode = false;
    }

    public discardTitle() {
        this.isTitleInEditMode = false;
    }

    public discardDescription() {
        this.isDescriptionInEditMode = false;
    }

    public discardName() {
        this.isNameInEditMode = false;
    }

    private updateNameDescription() {
        const roomNameDescription = {
            name: this.newTitle,
            description: this.newDescription
        };
        this.roomEditService.update(roomNameDescription);
    }

    public updateDisplayName() {
        this.auth0.changeDisplayName(this.newName);
    }

    public logout(): void {
        this.auth0.logout();
    }

    public toHome(): void {
        if (this.isProjectViewMode) {
            this._router.navigate(['/']);
            this.isProjectViewMode = false;
        }
    }

    constructor(private roomEditService: RoomEditService,
                private _masterSocket: MasterStorageService,
                private auth0: Auth0Service,
                private _router: Router) {
    }

    ngOnInit() {
        this.roomEditService.name$.subscribe(name => {
            this.projectTitle = name;
            this.newTitle = this.projectTitle;
        });
        this.roomEditService.description$.subscribe(description => {
            this.projectDescription = description;
            this.newDescription = this.projectDescription;
        });
        this.newTitle = this.projectTitle;
        this.newDescription = this.projectDescription;

        this.auth0.user$.subscribe(user => {
            this.displayName = user.displayName;
            this.newName = this.displayName;
        });

        this.isMaster$ = this._masterSocket.masterMessages$
            .map(message => {
                return message.isMaster;
            });
    }
}
