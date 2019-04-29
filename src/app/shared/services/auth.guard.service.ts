import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';
import {AngularFireAuth} from 'angularfire2/auth';
//import swal from 'sweetalert2';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.afAuth.authState.map(auth => {
            if (isNullOrUndefined(auth)) {
                this.router.navigate(['/']);
                //swal('Oops!', 'Please Login First', 'error')

                return false;

            } else {
                return true;
            }
        });
    }
}
