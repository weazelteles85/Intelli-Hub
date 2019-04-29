import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataManagementService } from '../../shared/services/data-management.service';

@Component({
  selector: 'app-accountprofile',
  templateUrl: './accountprofile.component.html',
  styleUrls: ['./accountprofile.component.scss']
})
export class AccountProfileComponent implements OnInit, AfterContentInit {
  changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('',[Validators.required]),
  });
  get currentPassword(){
    return this.changePasswordForm.get("currentPassword");
  }
  get newPassword(){
    return this.changePasswordForm.get("newPassword");
  }

  constructor(private authService:AuthService, public router : Router, private dataManager: DataManagementService) { }

  ngOnInit() {     
  }

  ngAfterContentInit() {
    // this.dataManager.fl_Schemas.subscribe((schemas) => {
    //     console.log(schemas);
    //   }
    // );
    // this.dataManager.fl_Content.subscribe((content) => {
    //     console.log(content);
    //   }
    // );
    // this.dataManager.fl_Navigation.subscribe((navigation) => {
    //   console.log(navigation);
    // })
  }

  async changePassword(){
    var result = await this.authService.changePassword(this.currentPassword.value,this.newPassword.value);
    if (result == null)
    {
      
      await this.authService.logout(); 
      this.router.navigate(["/login"]);
      await swal('Oops!', 'You successfully changed password !', 'success');
    }
    else{
      await swal('Oops!', result , 'error');
    }

  }

}
