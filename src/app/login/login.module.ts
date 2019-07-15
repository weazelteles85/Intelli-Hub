import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material';
import { LoginAsAdminComponent } from './login-as-admin/login-as-admin.component';

@NgModule({
    imports: [CommonModule, 
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule],
    declarations: [LoginComponent, LoginAsAdminComponent]
})
export class LoginModule {}
