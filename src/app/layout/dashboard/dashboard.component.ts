import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NavItem } from '../../core/NavItem.interface';
import { Router } from '@angular/router';
import { DataManagementService } from '../../shared/services/data-management.service';
import { PermissionService } from '../../shared/services/permission.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    mainAppNavId: string = "mainAppNavigation"; //<--- The main navigation must have this under their id
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    localMainAppNavigation: Array<NavItem>;
    activeChildren: Array<NavItem> = new Array<NavItem>();
    activeLink: boolean;

    dayTimeRef: string = '';
    constructor(public router: Router,
        private dataManager: DataManagementService,
        private permissionManager: PermissionService,
        public authService: AuthService) {
            
        }

    ngOnInit() {
        if(new Date().getHours() < 4) {
            this.dayTimeRef = 'night'
        } else if(new Date().getHours() < 12) {
            this.dayTimeRef = 'morning'
        } else if (new Date().getHours() < 16) {
            this.dayTimeRef = 'afternoon'
        } else {
            this.dayTimeRef = 'evening'
        }
        console.log(new Date().getHours())
        this.dataManager.fl_Navigation.subscribe((navigation) => {
            console.log('inside subscribe');
            for (let index = 0; index < navigation.length; index++) { // <-- This loop finds and assigns AppMainNavigation
                const mainNav: any = navigation[index];
                if (mainNav.id == this.mainAppNavId) {
                    this.localMainAppNavigation = mainNav.items;
                }
            }
            this.setSubCategories();
        });
    }

    isSchemaPermited(componentID: string) {
        if (this.permissionManager.localSchemasPermited) {
            //console.log(this.permissionManager.localSchemasPermited);
            if (this.permissionManager.localSchemasPermited[componentID]) {
                if (this.permissionManager.localSchemasPermited[componentID]['view']) {
                    return true;
                } else {
                    return false
                }

            }
        }
    }

    setSubCategories() {
        this.localMainAppNavigation.forEach(navItem => {
            if (navItem.parentIndex != 0) {
                const parent: NavItem = this.localMainAppNavigation.find((parent) => parent.id == navItem.parentIndex);
                if (parent) {
                    if (!parent.childIndex) {
                        parent.childIndex = new Array<NavItem>();
                    }
                    parent.childIndex.push(navItem);
                }
            }
        });

    }

    async navToDynamic(navItem: NavItem) {
        this.activeLink = true;
        const schema = this.dataManager.setSelectedSchema(navItem.component);
        if (schema) {
            this.dataManager.setContentBySchemaOnly(schema.id);
        }

        //console.log(navItem);
        //this.dataManager.setContentBySchemaOnly()
        //this.router.navigate(['/dynamic'], { queryParams: { page: navItem.title } }); // <-- not needed since nav handled by html
    }

    showHideSubmenu(navItem: NavItem) {
        navItem.isActive = !navItem.isActive;
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        //this.translate.use(language);
    }
    onLoggedout() {
        localStorage.removeItem('mdtoken');
        localStorage.removeItem('uid');
        localStorage.removeItem('email');
    }

}
