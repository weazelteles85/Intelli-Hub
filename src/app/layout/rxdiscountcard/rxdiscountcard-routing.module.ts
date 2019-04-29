import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RxdiscountcardComponent } from './rxdiscountcard.component';

const routes: Routes = [
    {
        path: '', component: RxdiscountcardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RxdiscountcardRoutingModule { }
