import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { PermissionService } from '../../shared/services/permission.service';
import { Permission } from '../../core/Permission.interface';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  showPermissionGroup: boolean;
  selecterPermission: Permission;
  selectedPermName: string = 'Select Permission'
  toastMsg: string = '';

  formSignup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    userName: new FormControl('', Validators.required),
    //location: new FormControl(''),
    confirmPassword: new FormControl('', [Validators.required ])
  });

  constructor(public authService: AuthService, public permService: PermissionService) { }

  ngOnInit() {
    this.showPermissionGroup = false;
  }

  cancelPermissionSelector(){
    if(this.showPermissionGroup) this.showPermissionGroup = false;
  }

  toggleShowPermission() {
    this.showPermissionGroup = !this.showPermissionGroup;
  }

  setPermission(perm: Permission) {
    this.selecterPermission = perm;
    this.selectedPermName = perm.name;
    this.formSignup.get('confirmPassword').setValue('');
  }

  onSubmitForm() {
    
    this.authService.registerNewUser(this.userName.value, this.firstName.value, 
      this.lastName.value, this.email.value, this.password.value, this.selecterPermission)
    .then((value) => {
      console.log('inside then in register');
      console.log(value);
      this.selecterPermission = null;
      this.selectedPermName = 'Select Permission';
    })
    this.formSignup.reset();
  }
  get firstName() {
    return this.formSignup.get('firstName');
  }
  get lastName() {
    return this.formSignup.get('lastName');
  }
  get userName() {
    return this.formSignup.get('userName');
  }
  get email() {
    return this.formSignup.get('email');
  }
  get password() {
    return this.formSignup.get('password');
  }
  get confirmPassword() {
    return this.formSignup.get('confirmPassword');
  }

  passMessage:string;
  checkIfPasswordsMatches() {
    if (this.formSignup.get('password').value != this.formSignup.get('confirmPassword').value) {
      this.passMessage = 'Passwords does not match';
      this.formSignup.setErrors({ 'valid': false });
    }
    else {
      this.passMessage = '';
    }
    if(!this.selecterPermission) {
      this.formSignup.setErrors({ 'valid': false });
    }
  }

  resetToast() {
    this.toastMsg = '';
  }

}
