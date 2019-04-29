import { Component, OnInit } from '@angular/core';
import { StaticSchemaService } from './shared/services/static-schema.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    // CALLS STATIC-SCHEMA SERVICE SO THAT IF SCHEMAS DO NOT EXIST IN DATABASE THEY WILL BE CREATED
    constructor(private staticSchema: StaticSchemaService) {
    }

    ngOnInit() {
    }
}
