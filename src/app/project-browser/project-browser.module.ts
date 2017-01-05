import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectBrowserComponent} from './project-browser.component';
import {RouterModule} from '@angular/router';
import {UserInterfaceModule} from '../user-interface/user-interface.module';
import {ProjectCardComponent} from './project-card/project-card.component';
import {ProjectsService} from './projects.service';
import {JdenticonModule} from '../jdenticon/jdenticon.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import {JoinService} from "./join.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UserInterfaceModule,
        JdenticonModule,
        FormsModule,
        ReactiveFormsModule,
        UtilPipesModule,
    ],
    declarations: [
        ProjectBrowserComponent,
        ProjectCardComponent,
    ],
    providers: [
        ProjectsService,
        JoinService,
    ],
})
export class ProjectBrowserModule {
}
