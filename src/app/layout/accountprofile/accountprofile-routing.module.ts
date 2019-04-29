import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { AccountProfileComponent} from './accountprofile.component';

const routes: Routes = [
  {
      path: '', component: AccountProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountProfileRoutingModule { }
