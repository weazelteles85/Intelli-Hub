import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginAsAdminComponent } from './login-as-admin/login-as-admin.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login-as-admin',
        component: LoginAsAdminComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
