import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DynamicComponent } from './components/dynamic/dynamic.component';
import { AuthGuard } from '../shared';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UsersComponent } from './users/users.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            //{ path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'dynamic', component: DynamicComponent, canActivate: [AuthGuard] },
            //{ path: 'register-user', component: RegisterUserComponent, canActivate: [AuthGuard] },
            { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
            { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
           // { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
           // { path: 'forms', loadChildren: './form/form.module#FormModule' },
           // { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
           // { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
           // { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
           // { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'accountprofile', loadChildren: './accountprofile/accountprofile.module#AccountProfileModule'}
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
