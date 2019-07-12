import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

import {AngularFireModule} from 'angularfire2';
import { AuthService } from './shared/services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {AuthGuardService} from './shared/services/auth.guard.service';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material';
import {AngularFirestoreModule} from 'angularfire2/firestore'
import {FirebaseService} from './shared/services/firebase.service'
import { environment } from '../environments/environment';
import { DataManagementService } from './shared/services/data-management.service';
import { PermissionService } from './shared/services/permission.service';
import { StaticSchemaService } from './shared/services/static-schema.service';
import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG  } from 'ng-gapi';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

let gapiClientConfig: NgGapiClientConfig = {
    client_id: '645434776074-n3ishss7dmctgl54ls63pqvnvrildekj.apps.googleusercontent.com',
    discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
    scope: [
        'https://www.googleapis.com/auth/admin.directory.group.member',
        'https://www.googleapis.com/auth/admin.directory.group'
    ].join(' ')
};

@NgModule({
    imports: [
        GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: gapiClientConfig
        }),
        CommonModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NoopAnimationsModule,
        MatTooltipModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule
    ],
    declarations: [AppComponent],
    providers: [ DataManagementService, AuthGuard, AuthService, AuthGuardService, StaticSchemaService, 
        AngularFireAuth, AngularFireDatabase, PermissionService, FirebaseService],
    bootstrap: [AppComponent]
})
export class AppModule {}
