import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,ReactiveFormsModule,MatTooltipModule
  ],
  declarations: [SignupComponent],
})
export class SignupModule { }
