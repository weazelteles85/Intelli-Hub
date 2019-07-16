import { Component, OnInit, AfterContentInit, ViewChild, Input, ElementRef } from '@angular/core';
import { PermissionService } from '../../shared/services/permission.service';
import { AuthService } from '../../shared/services/auth.service';
import { FlUser } from '../../core/User.interface';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Permission } from '../../core/Permission.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  permissionClass = 'permissionSelector text-center col';
  selectedUserPermissionList: Array<string> = new Array<string>();
  permNames: Array<string> = new Array<string>();
  localSelectedUserPermission: Permission;
  storedPermission: Permission; // <-- This exists so that if User cancels the Edit after changing permission it will revert back to this
  isSelectPermission = false;
  isSelectUserPermission = false;
  isEditMode = false;
  isCreateUserMode = false;
  editUserForm: FormGroup;
  userObservable: Observable<FlUser> = new Observable<FlUser>();
  usersList: Array<FlUser> = new Array<FlUser>();
  localLocationsList: Array<string> = [];
  selectedUser: FlUser;
  emailFilter = '';
  clientFilter = '';
  toastMsg = '';

  @ViewChild('idInput') idInput: ElementRef;

  constructor(public authService: AuthService, public Permission: PermissionService) {

  }

  ngOnInit() {
    this.getAllUsers();
    this.editUserForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      displayName: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required),
    });
    this.editUserForm.disable();
    this.selectedUser = this.authService.localUser;
    this.authService.FlUser.subscribe((user) => {
      this.Permission.getPermissionBasedOnUser(user).subscribe((permission: Permission) => {
        //this.localSelectedUserPermission = permission;
        this.storedPermission = permission;
        // if (this.isSuperAdmin(this.Permission.localPermission)) {
        //   //this.Permission.getAllPermissionsAvailable().subscribe(permissions => this.localPermissionsList = <Array<Permission>>permissions)
        // }
      });
    })
  }

  test() {
    console.log(this.Permission.localPermission.content.production['createUser']['update']);
  }
  getAllUsers() {
    this.authService.FlUser.subscribe((user) => {
      this.Permission.getUsersBasedOnClient(user.client).subscribe((usersObs: Observable<any>) => {
        this.userObservable = usersObs;
        usersObs.subscribe((users) => {
          this.usersList = users;
        })
      });
    });
  }

  onFilterEmailChange(filterValue: string) {
    this.emailFilter = filterValue;
  }

  onFilterClientChange(filterValue: string) {
    this.clientFilter = filterValue;
  }

  isNotFiltered(user: FlUser) {
    if (this.emailFilter != '' || this.clientFilter != '') {
      if (user.email.match(this.emailFilter) && user.client.match(this.clientFilter)) {
        return true
      } else return false
    } else return true;
  }

  setSelectedUser(user: FlUser) {
    this.closeEdit();
    this.selectedUser = user;
    this.localLocationsList = [];
    if (user.locations == undefined) {
      user.locations = [];
    }
    for (let location of user.locations) {
      this.localLocationsList.push(location);
    }
    if (this.idInput) {
      this.idInput.nativeElement.value = user.id;
    }
    if (user.permissionsList == undefined) {
      user.permissionsList = [];
    }
    this.selectedUserPermissionList = user.permissionsList;
    this.setPermissionNames();
    this.Permission.getPermissionBasedOnUser(user).subscribe((permission: Permission) => {
      this.localSelectedUserPermission = permission;
      this.storedPermission = permission;
      // if (this.isSuperAdmin(this.Permission.localPermission)) {
      //   //this.Permission.getAllPermissionsAvailable().subscribe(permissions => this.localPermissionsList = <Array<Permission>>permissions)
      // }
    });
    this.editUserForm.get('displayName').setValue(user.displayName);
    this.editUserForm.get('firstName').setValue(user.firstName);
    this.editUserForm.get('lastName').setValue(user.lastName);
    this.editUserForm.get('email').setValue(user.email);
    this.editUserForm.get('client').setValue(user.client);
  }

  setPermissionNames() {
    this.permNames = [];
    for (let permRef of this.selectedUserPermissionList) {
      this.Permission.getPermissionBasedOnRef(permRef).subscribe((permission: Permission) => {
        this.permNames.push(permission.name)
      })
    }
  }

  addToUserPermissionList(perm: Permission) {
    if (this.selectedUserPermissionList.find(item => item.includes(perm.id))) {
      console.log('Item already in list');
    } else if(perm.id == '1') this.selectedUserPermissionList.push(`/fl_permissions/${perm.id}`);
    if (perm.id != '1') {
      if (this.selectedUserPermissionList.find(item => item.includes(perm._fl_meta_.docId))) {
        console.log('Item already in list');
      } else this.selectedUserPermissionList.push(`/fl_permissions/${perm._fl_meta_.docId}`);
    }
    this.isSelectUserPermission = false;
    this.setPermissionNames();
  }

  deletePermission(permName: string) {
    console.log('delete permission called');
    const index = this.selectedUserPermissionList.findIndex(item => item.includes(this.Permission.getPermissionRefFromName(permName)))
    this.selectedUserPermissionList.splice(index, 1);
    this.setPermissionNames();
  }

  openPermissionGroup() {
    if (this.isEditMode || this.isCreateUserMode) {
      if(this.isSelectPermission) {
        this.isSelectPermission = false;
      } else {
        this.isSelectPermission = true;
      }
    }
  }

  setPermission(perm: Permission) {
    this.editUserForm.get('confirmPassword').setValue('');
    if (this.selectedUserPermissionList.find(item => item.includes(perm.id))) {
      console.log('Item already in list');
    } else if(perm.id == '1') this.selectedUserPermissionList.push(`/fl_permissions/${perm.id}`);

    if (this.selectedUserPermissionList.find(item => item.includes(perm._fl_meta_.docId))) {
      console.log('Item already in list');
    } else this.selectedUserPermissionList.push(`/fl_permissions/${perm._fl_meta_.docId}`);

    this.localSelectedUserPermission = perm;
    this.isSelectPermission = false;
    this.setPermissionNames();
    this.invalidateFormIfPermissionNotSelected();
  }

  invalidateFormIfPermissionNotSelected() {
    if(this.localSelectedUserPermission.id == 'null') {
      this.editUserForm.setErrors({ 'valid': false });
    }
  }

  isSuperAdmin(permission: Permission) {
    return permission.name == 'Super Admin';
  }
  hasCreatePermission(permission: Permission) {
    if(permission.name == 'Super Admin') {
      return true;
    } else if (permission.content.production['users']['create'] == true) {
      return true;
    } else {
      return false;
    }
  }
  hasEditPermission(permission: Permission) {
    try {
      return permission.content.production['users']['update'];
    } catch (error) {
      console.error(error);
    }
  }

  openEdit() {
    //if (this.isSuperAdmin(this.Permission.localPermission)) {
    this.permissionClass = 'permissionSelectorEditMode text-center col'
    //}
    this.isEditMode = true;
    this.editUserForm.enable();
    this.editUserForm.get('email').disable();
    if (!this.isSuperAdmin(this.Permission.localPermission)) {
      this.editUserForm.get('client').disable();
    }
    this.editUserForm.asyncValidator;
  }

  closeEdit() {
    this.permissionClass = 'permissionSelector text-center col';
    this.isCreateUserMode = false;
    this.isEditMode = false;
    this.isSelectPermission = false;
    this.isSelectUserPermission = false;
    this.editUserForm.disable();
    this.localSelectedUserPermission = this.storedPermission;
  }

  deleteLocation(location: string) {
    console.log('delete called');
    const index = this.localLocationsList.indexOf(location);
    this.localLocationsList.splice(index, 1);
  }

  addLocation(element, location: string) {
    console.log('add called');
    this.localLocationsList.push(location);
    element.value = '';
  }

  onNewUserBtnClick() {
    this.localSelectedUserPermission = {
      _fl_meta_:{},
      id: 'null',
      name: 'Pick a Location'
    }
    this.selectedUser = null;
    this.permNames = [];
    this.selectedUserPermissionList = [];
    this.isCreateUserMode = true;
    this.editUserForm.reset();
    this.editUserForm.enable();
    if (this.Permission.localPermission.name !== 'Super Admin') {
      this.authService.FlUser.subscribe(user => this.editUserForm.get('client').setValue(user.client));
    }
    this.permissionClass = 'permissionSelectorEditMode text-center col';
    if (this.idInput) {
      this.idInput.nativeElement.value = 'A New ID will automatically be generated when the user is created';
    }
    this.localLocationsList.splice(0, this.localLocationsList.length);
  }

  onUpdateUser() {
    let permissionDocRef;
    if (this.localSelectedUserPermission.name == 'Super Admin') {
      permissionDocRef = this.authService.getFirestoreRef('/fl_permissions/' + this.localSelectedUserPermission.id);
    } else {
      permissionDocRef = this.authService.getFirestoreRef('/fl_permissions/' + this.localSelectedUserPermission._fl_meta_.docId);
    }
    const editedUser: FlUser = this.selectedUser;
    editedUser.displayName = this.editUserForm.get('displayName').value;
    editedUser.firstName = this.editUserForm.get('firstName').value;
    editedUser.lastName = this.editUserForm.get('lastName').value;
    editedUser.email = this.editUserForm.get('email').value;
    editedUser.client = this.editUserForm.get('client').value;
    editedUser.locations = this.localLocationsList;
    editedUser.permissions = permissionDocRef;
    editedUser.permissionsList = this.selectedUserPermissionList;

    this.authService.updateUserData(editedUser).then((value) => {
      this.toastMsg = 'User Has Been Updated';
      setTimeout(() => this.resetToast(), 2000);
    });
    this.storedPermission = this.localSelectedUserPermission;
    this.closeEdit();
  }

  onCreateNewUser() {
    let permissionDocRef;
    if (this.localSelectedUserPermission.name == 'Super Admin') {
      permissionDocRef = this.authService.getFirestoreRef('/fl_permissions/' + this.localSelectedUserPermission.id);
    } else {
      permissionDocRef = this.authService.getFirestoreRef('/fl_permissions/' + this.localSelectedUserPermission._fl_meta_.docId);
    }
    console.log(permissionDocRef);
    this.authService.registerUserFromAdmin(
      this.editUserForm.get('displayName').value,
      this.editUserForm.get('firstName').value,
      this.editUserForm.get('lastName').value,
      this.editUserForm.get('email').value,
      this.editUserForm.get('confirmPassword').value,
      this.editUserForm.get('client').value,
      this.localLocationsList,
      permissionDocRef,
      this.selectedUserPermissionList
    );
    this.editUserForm.reset();
    this.localLocationsList = [];
    this.selectedUserPermissionList = [];
  }

  passMessage: string;
  checkIfPasswordsMatches() {
    console.log('check called');
    if (this.editUserForm.get('password').value != this.editUserForm.get('confirmPassword').value) {
      this.passMessage = 'Passwords does not match';
      this.editUserForm.setErrors({ 'valid': false });
    }
    else {
      this.passMessage = '';
    }
  }

  resetToast() {
    this.toastMsg = '';
  }

  enableUser() {
    this.selectedUser.enabled = 'Yes';
    this.onUpdateUser()
  }

  disableUser() {
    this.selectedUser.enabled = 'No';
    this.onUpdateUser()
  }

  setClassIfDisabled(user: FlUser) {
    if(user.enabled == 'No') {
      return 'list-group-item disabled'
    } else return 'list-group-item'
  }

  testAddmemberToGroup() {
    //this.authService.addNewMemberToGoogleGroup();
  }

}
