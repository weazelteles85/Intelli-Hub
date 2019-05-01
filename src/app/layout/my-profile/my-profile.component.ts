import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { FlUser } from '../../core/User.interface';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  editUserForm: FormGroup;
  isReadOnly = true;
  isChangePassword = false;
  isLoading = false;
  passMessage = '';
  toastMsg = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
    this.authService.FlUser.subscribe((user) => {
      this.editUserForm.get('displayName').setValue(user.displayName);
      this.editUserForm.get('firstName').setValue(user.firstName);
      this.editUserForm.get('lastName').setValue(user.lastName);
      this.editUserForm.get('email').setValue(user.email);
    });
  }

  initForm() {
    this.editUserForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      currentPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      displayName: new FormControl('', Validators.required),
    });
  }

  onUpdateProfile() {
    this.authService.FlUser.subscribe((user) => {
      const editedUser: FlUser = user;
      editedUser.displayName = this.editUserForm.get('displayName').value;
      editedUser.firstName = this.editUserForm.get('firstName').value;
      editedUser.lastName = this.editUserForm.get('lastName').value;
      this.authService.updateUserData(editedUser);
    });
    this.isReadOnly = true;
  }

  onCancelEditForm() {
    this.isReadOnly = true;
    this.isChangePassword = false;
    this.editUserForm.markAsUntouched();
    this.editUserForm.get('currentPassword').reset();
    this.editUserForm.get('password').reset();
    this.editUserForm.get('confirmPassword').reset();
  }

  checkIfPasswordsMatches() {
    console.log('check called');
    if (this.editUserForm.get('password').value != this.editUserForm.get('confirmPassword').value) {
      this.passMessage = 'Passwords does not match';
      this.editUserForm.setErrors({ 'valid': false });
    } else this.passMessage = '';
    
    if(this.editUserForm.get('password').invalid) {
      this.passMessage = 'Please make sure password is at least 8 characters long';
    }
  }

  resetConfirmPassword() {
    this.editUserForm.get('confirmPassword').reset();
  }

  onChangePassword() {
    this.isLoading = true;
    this.authService.changePassword(this.editUserForm.get('currentPassword').value,
    this.editUserForm.get('confirmPassword').value).then(msg => {
      this.isLoading = false;
      this.onCancelEditForm();
      this.toastMsg = msg;
      setTimeout(() => this.resetToast(), 3000);
    });
  }

  resetToast() {
    this.toastMsg = '';
  }

}
