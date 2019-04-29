import { Component, OnInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { DataManagementService } from '../../../shared/services/data-management.service';
import { Schema } from '../../../core/Schema.interface';
import { Field } from '../../../core/Fields.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit, AfterContentInit {

  localSchemaDisplaying: Schema;
  navigationTitle: string;
  bodyHTML: string;

  
  @ViewChild("dynamic", { read: ElementRef }) dynamic: ElementRef;

  constructor(
    public dataManager: DataManagementService, private activeRoute: ActivatedRoute) {
      console.log('constructor');
      this.dataManager.selectedSchemaDisplaying.subscribe((schema) => {
        this.localSchemaDisplaying = schema;
      });
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      this.navigationTitle = params.page;
    });
      }

  ngAfterContentInit() {
    
  }





}
