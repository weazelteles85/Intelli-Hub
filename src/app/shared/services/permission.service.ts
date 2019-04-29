import { Injectable, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, ReplaySubject } from 'rxjs';
import { Permission } from '../../core/Permission.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { FlUser } from '../../core/User.interface';

@Injectable()
export class PermissionService {

  localSchemasPermited: Object;
  //UsersSubj: ReplaySubject<Array<any>> = new ReplaySubject<Array<FlUser>>(1);
  PermissionSubj: ReplaySubject<Permission> = new ReplaySubject<Permission>(1);
  localPermission: Permission;
  localPermissionListRef: Array<string> = [];
  localPermissionList: Array<Permission> = [];

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.authService.FlUser.subscribe((user) => {
      this.localPermissionListRef = user.permissionsList;
      this.PermissionSubj.subscribe((permission) => {
        this.localPermission = permission;
        this.localSchemasPermited = permission.content['production'];
      })
      if (user) {
        const permRef = user.permissions
        this.afs.doc<Permission>(permRef).valueChanges().subscribe((permission) => {
          this.PermissionSubj.next(permission)
        })
      }
    });
    this.afs.collection('fl_permissions').valueChanges().subscribe((permCollection:any) => {
      this.authService.FlUser.subscribe(user => this.updateLocalPermissionList(user));
      let permList:Array<string> = new Array<string>();
      for (let index = 0; index < permCollection.length; index++) {
        if(permCollection[index].id == 1) {
          permList.push(`/fl_permissions/${permCollection[index].id}`)
        } else {
          permList.push(`/fl_permissions/${permCollection[index]._fl_meta_.docId}`);
        }
      }
      this.updateSuperAdminPermissionList(permList);
    })
  }

  updateLocalPermissionList(user) {
    this.localPermissionList = [];
      for (let index = 0; index < user.permissionsList.length; index++) {
        this.getPermissionBasedOnRef(user.permissionsList[index]).subscribe((permission: Permission) => {
          this.localPermissionList.push(permission);
        })
      }
  }

  updateSuperAdminPermissionList(permList: Array<string>) {
    this.authService.FlUser.subscribe((user) => {
      if (user.permissions.path == 'fl_permissions/1') {
        const cloudList:string = JSON.stringify(permList);
        const userList:string = JSON.stringify(user.permissionsList);
        if (cloudList != userList) {
          const editedUser = user;
          editedUser.permissionsList = permList;
          console.log('update User Perm List Called')
          console.log(permList);
          this.authService.updateUserData(editedUser);
        }
      }
    })
  }

  getUsersBasedOnClient(clientReq: string) {
    return this.PermissionSubj.pipe().map((permission) => {
      if (permission.name === 'Super Admin') {
        //Get All Users in DataBase
        console.log('get all Users');
        return this.afs.collection('fl_users').valueChanges();
      } else {
        //Get Users based on Client
        return this.afs.collection('fl_users', ref => {
          return ref.where('client', '==', clientReq);
        }).valueChanges();
      }
    });
  }

  getPermissionBasedOnUser(user: FlUser) {
    return this.afs.doc(user.permissions).valueChanges();
  }

  getAllPermissionsAvailable() {
    return this.afs.collection('fl_permissions').valueChanges();
  }

  getPermissionBasedOnRef(ref:string) {
    return this.afs.doc(ref).valueChanges();
  }

  getPermissionRefFromName(name: string) {
    if(name == 'Super Admin') {
      return `/fl_permissions/${this.localPermissionList.find(perm => perm.name == name).id}`;
    } else return `/fl_permissions/${this.localPermissionList.find(perm => perm.name == name)._fl_meta_.docId}`;
  }


}
