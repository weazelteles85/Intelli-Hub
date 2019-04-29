import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DynamicComponent } from './components/dynamic/dynamic.component';
import { FlSingleComponent } from './components/dynamic/fl-single/fl-single.component';
import { FlFormComponent } from './components/dynamic/fl-form/fl-form.component';
import { FlCollectionComponent } from './components/dynamic/fl-collection/fl-collection.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UsersComponent } from './users/users.component';
import { ScriptsComponent } from './components/scripts/scripts.component';




@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        ReactiveFormsModule,
        NgbDropdownModule.forRoot(),
        AlertModule.forRoot()
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent, 
        DynamicComponent, FlSingleComponent, FlFormComponent, FlCollectionComponent, RegisterUserComponent,  UsersComponent, ScriptsComponent]
})
export class LayoutModule {}
