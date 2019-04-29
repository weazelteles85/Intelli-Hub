import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataManagementService } from '../../../shared/services/data-management.service';
import { Observable } from 'rxjs';
import { fl_Navigation } from '../../../core/Navigation.interface';
import { NavItem } from '../../../core/NavItem.interface';
import { PermissionService } from '../../../shared/services/permission.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    mainAppNavId: string = "mainAppNavigation"; //<--- The main navigation must have this under their id
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    localMainAppNavigation: Array<NavItem>;
    activeChildren: Array<NavItem> = new Array<NavItem>();
    activeLink: boolean;

    constructor(
        private translate: TranslateService,
        public router: Router,
        private dataManager: DataManagementService,
        private permissionManager: PermissionService) {
    }

    ngOnInit() {
        this.dataManager.fl_Navigation.subscribe((navigation) => {

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
        this.translate.use(language);
    }
    onLoggedout() {
        localStorage.removeItem('mdtoken');
        localStorage.removeItem('uid');
        localStorage.removeItem('email');
    }

}
