import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('mdtoken')) {
            return true;
        }
        console.log('routerGuard called');
        this.router.navigate(['/login']);
        return false;
    }
}
