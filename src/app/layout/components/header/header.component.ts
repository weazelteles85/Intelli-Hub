import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/services/auth.service';
import { debug } from 'util';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    userName : string;
    appVersion: number = 0.9;
    versionMsg:string = '';
    constructor(private translate: TranslateService, public router: Router, private authSerive : AuthService) {

        this.userName = localStorage.getItem('email');
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.authSerive.fireBaseAppVersion.subscribe((versionObj:any) => {
            console.log(versionObj);
            if(versionObj.version != this.appVersion) {
                this.versionMsg = ` A newer version available (${versionObj.version}) 
                Try refreshing your browser or clearing your cookies to view it`
            }
        })
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

    async onLoggedout() {
        await this.authSerive.logout();
        this.router.navigate(["/login"]);
        window.location.reload();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

}
