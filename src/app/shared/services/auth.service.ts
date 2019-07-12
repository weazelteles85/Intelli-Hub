import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of, throwError } from 'rxjs';
//import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FlUser } from '../../core/User.interface';
import * as firebase from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permission } from '../../core/Permission.interface';
import { DatabaseReference } from '@angular/fire/database/interfaces';
import { GoogleAuthService, GoogleApiModule, GoogleApiService } from 'ng-gapi';
import * as ClientOAuth2 from 'client-oauth2';
//import { adminSDK } from '../../../environments/environment';

@Injectable()
export class AuthService implements OnInit {
  isLoading = false;
  FlUser: Observable<FlUser>;
  localUser: FlUser;
  createUserURL: string = 'https://us-central1-flamelink-6f78e.cloudfunctions.net/createUser'
  createUserMsg: string = '';
  loginDisabledMsg: string = '';
  fireBaseAppVersion: Observable<number> = new Observable<number>();

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public router: Router,
    private http: HttpClient) {
    this.FlUser = afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<FlUser>(`fl_users/${user.uid}`).valueChanges();
      }
      else {
        console.log('user is Null')
        return of(null)
      }
    }));
    this.fireBaseAppVersion = <Observable<number>>this.afs.doc('fl_environments/appVersion').valueChanges();
  }

  ngOnInit() {
    this.FlUser.subscribe(user => this.localUser = user);
  }

  // Register New User
  registerNewUser(username: string, fName: string, lName: string, email: string, password: string,
    permission: Permission) {
    const permissionDocRef = this.getFirestoreRef('/fl_permissions/' + permission._fl_meta_.docId);
    this.isLoading = true;
    return this.FlUser.map((user) => {
      const newUser = {
        firstName: fName,
        lastName: lName,
        displayName: username,
        email: email,
        enabled: 'Yes',
        id: '',
        permissions: permissionDocRef.path,
        password: password,
        createdBy: user.id,
        client: user.client,
        locations: user.locations,
        permList: [`/fl_permissions/${permission._fl_meta_.docId}`]
      };
      console.log(newUser);
      return this.http.post(this.createUserURL, newUser, { responseType: 'text' }).subscribe(
        (res) => {
          this.isLoading = false;
          console.log(res);
          this.createUserMsg = res;
          setTimeout(() => this.resetMsg(), 4000)
        },
        (err) => {
          this.isLoading = false;
          console.error(err);
          this.createUserMsg = err.error;
          setTimeout(() => this.resetMsg(), 5000)
        }
      )
    }).toPromise();
  }

  // Register New User From Super Admin Account
  registerUserFromAdmin(username: string, fName: string, lName: string, email: string, password: string,
    client: string, locations: Array<string>, permissions: firebase.firestore.DocumentReference, permissionList: Array<string>) {
    this.isLoading = true;
    return this.FlUser.map((user) => {
      // console.log(user);
      const newUser = {
        firstName: fName,
        lastName: lName,
        displayName: username,
        email: email,
        enabled: 'Yes',
        id: '',
        permissions: permissions.path,
        password: password,
        createdBy: user.id,
        client: client,
        locations: locations,
        permList: permissionList
      };
      console.log(newUser);
      return this.http.post(this.createUserURL, newUser, { responseType: 'text' }).subscribe(
        (res) => {
          //this.addNewMemberToGoogleGroup();
          this.isLoading = false;
          console.error(res);
          this.createUserMsg = res;
          setTimeout(() => this.resetMsg(), 4000);
        },
        (err) => {
          this.isLoading = false;
          console.error(err);
          this.createUserMsg = err.error;
          setTimeout(() => this.resetMsg(), 5000);
        }
      )
    }).toPromise();
  }

  addNewMemberToGoogleGroup() {

    //CALL CLOUD FUNCTION METHOD
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
    const data = {
      // clientId: adminSDK.client_id,
      // clientSecret: adminSDK.private_key,
      // accessTokenUri: adminSDK.token_uri,
      // authorizationUri: adminSDK.auth_uri,
      // redirectUri: 'http://localhost:4200/users'
    };

    this.http.get('https://us-central1-flamelink-6f78e.cloudfunctions.net/addUserToGroup', {headers}).subscribe(
      (variable) => {
        console.log('Successfull Initial Response, Token Bellow');
        console.log(variable);
      },
      (err) => {
        console.log('Error');
        console.error(err.error);
      });


    //ORIGINAL LOCAL CALL METHOD
    const appAuth = new ClientOAuth2({
      clientId: '881003242822-87i2l47k8gr3hfvb33g8f6gh1d75boad.apps.googleusercontent.com',
      //clientSecret: 'jYor8ImCKcFIKNrNvl4nIrn8',
      //redirectUri: 'http://localhost:4200/users'
    });

    this.FlUser.subscribe((user) => {
      const member = {
        'delivery_settings': 'ALL_MAIL',
        'email': 'artisanfieldservices@gmail.com',
        'role': 'MEMBER',
        'status': 'ACTIVE'
      };

      const headers = new HttpHeaders().set('Authorization', 'Bearer ya29.GlwqB_fQ48hRU7VZg67Qgp1jTIkpvrvyvvJxndngS3_Qtcdl0U3sAivOuX-hsX0A9Ac7-j51Y4vpG_orah9eT-nAtqGyVko-ITSWefUFdkfBqsnGXIjN6yNIVgGrbw');
          this.http.post(
            'https://www.googleapis.com/admin/directory/v1/groups/testgroup@telesapps.com/members',
            member, { headers }).subscribe(
              (res) => {
                console.log(res);
                console.log('Holy Crap it finally worked... Maybe');
              },
              (err) => {
                console.log('NOPE, second one failed');
                console.error(err);
              }
            );


    });

  }

  resetMsg() {
    this.loginDisabledMsg = '';
    this.createUserMsg = '';
  }

  login(email: string, password: string): Promise<void> {
    return this.afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        // console.log('Nice, it worked!');
        this.loginDisabledMsg = '';

        localStorage.setItem('mdtoken', value.user.refreshToken);
        localStorage.setItem('uid', value.user.uid);
        localStorage.setItem('email', value.user.email);
        this.afs.doc(`fl_users/${value.user.uid}`).valueChanges().subscribe((user: FlUser) => {
          if (user.enabled === 'Yes') {
            this.router.navigate(['/']);
          } else {
            this.loginDisabledMsg = 'Error: This user profile has been disabled, please contact your Admin for access';
            this.logout();
          }
        });
        // this.router.navigate(['/']);
      })
      .catch(err => {
        return throwError('Error: ' + err.message).toPromise();
      });
  }

  getFirestoreRef(docRef: string) {
    // return firebase.database().ref().
    return this.afs.doc(docRef).ref;
  }

  testGetAuthInfo() {
    console.log('User Id is: ');
    console.log(firebase.auth().currentUser.uid);
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then((credential) => {
      if (credential.additionalUserInfo.isNewUser) {
        credential.user.delete();
        return throwError('Error: No users with the provided Gmail account was found').toPromise();
      } else {
        this.afs.doc(`fl_users/${credential.user.uid}`).valueChanges().subscribe((user: FlUser) => {
          if (user.enabled === 'Yes') {
            sessionStorage.setItem('token', credential.user.refreshToken);
            localStorage.setItem('mdtoken', credential.user.refreshToken);
            localStorage.setItem('uid', credential.user.uid);
            localStorage.setItem('email', credential.user.email);
            this.loginDisabledMsg = '';
            this.router.navigate(['/']);
            return null;
          } else {
            this.logout();
            this.loginDisabledMsg = 'Error: This user profile has been disabled, please contact your Admin for access';
            return throwError('Error: This User Profile has been disabled, please contact your Admin for access').toPromise();
          }
        });
      }
    });
  }

  updateSigninStatus() {

  }

  logout(): Promise<void> {
    return this.afAuth
      .auth
      .signOut().then(() => {
        localStorage.removeItem('mdtoken');
        localStorage.removeItem('uid');
        localStorage.removeItem('email');
      });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<string> {
    const currentUserEmail = this.afAuth.auth.currentUser.email;
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(currentUserEmail, currentPassword);
      if (user.user.isAnonymous)
        return 'invalid user';
    } catch (error) {
      return "The current password you entered is invalid!";
    }
    try {
      await this.afAuth.auth.currentUser.updatePassword(newPassword);
      return 'Password Changed!';
    } catch (error) {
      return error.message;
    }
  }

  public updateUserData(userData: FlUser) {
    // Sets user data to firestore
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`fl_users/${userData.id}`);
    console.log('updateUserDataCalled');
    console.log(userData)
    return userRef.set(userData, { merge: true });
  }


}
