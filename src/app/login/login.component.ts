import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { map, take, debounceTime } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    logInError = '';
    constructor(public authService: AuthService, public router: Router) { }
    url;
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
    });
    ngOnInit() { }

    async onLogin() {
        this.logInError = '';
        await this.authService.login(this.email.value, this.password.value).then((value) => {
            //this.router.navigate(['/']);
        }).catch((err) => {
            console.error(err);
            this.logInError = err;
        });
    }

    get email() {
        return this.form.get("email");
    }
    get password() {
        return this.form.get("password");
    }

    test() {
        //this.authService.testGetAuthInfo();
        console.log(this.logInError);
        //this.authService.logout();
    }

    async onLoginWithGoogle() {
        this.logInError = '';
        await this.authService.signInWithGoogle().then((result) => {
            console.log('User with Gmail account Found');
            //this.router.navigateByUrl('/');
        }).catch((err) => {
            console.error(err);
            this.logInError = err;
        });
    }
}

