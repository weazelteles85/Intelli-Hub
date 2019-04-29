import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RxdiscountcardComponent} from './rxdiscountcard.component'
import {RxdiscountcardRoutingModule} from './rxdiscountcard-routing.module'
import { PageHeaderModule } from '../../shared';
 
@NgModule({
  imports: [
    CommonModule,RxdiscountcardRoutingModule , PageHeaderModule
  ],
  declarations: [RxdiscountcardComponent]
})
export class RxdiscountcardModule { }
