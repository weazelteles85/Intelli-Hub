import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule, FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    constructor(public authService: AuthService) {}

    formSignup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        userName: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', [
            Validators.required ])
    });
    ngOnInit() {
        //this.email.value = 'test';
    }
    
    signup() {
        // this.authService.registerNewUser(this.userName.value, this.firstName.value, this.lastName.value, this.email.value, 
        //     this.password.value) 
        
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
}

// export function matchOtherValidator(otherControlName: string): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: any } => {
//         const otherControl: AbstractControl = control.root.get(otherControlName);

//         if (otherControl) {
//             const subscription: Subscription = otherControl
//                 .valueChanges
//                 .subscribe(() => {
//                     control.updateValueAndValidity();
//                     subscription.unsubscribe();
//                 });
//         }

//         return (otherControl && control.value !== otherControl.value) ? {match: true} : null;
//     };
// }

