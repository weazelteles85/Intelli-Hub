import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileRoutingModule } from './accountprofile-routing.module';
import {AccountProfileComponent} from './accountprofile.component'
import { PageHeaderModule } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    AccountProfileRoutingModule,PageHeaderModule,FormsModule,ReactiveFormsModule,CommonModule
  ],
  declarations: [AccountProfileComponent]
})
export class AccountProfileModule { }