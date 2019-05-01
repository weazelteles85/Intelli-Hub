import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { Schema } from '../../../../core/Schema.interface';
import { Field } from '../../../../core/Fields.interface';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { Subject } from 'rxjs';
import { Content } from '../../../../core/Content.interface';
import { AuthService } from '../../../../shared/services/auth.service';
import { FlUser } from '../../../../core/User.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { PermissionService } from '../../../../shared/services/permission.service';

@Component({
  selector: 'app-fl-collection',
  templateUrl: './fl-collection.component.html',
  styleUrls: ['./fl-collection.component.scss']
})
export class FlCollectionComponent implements OnInit {

  @Input() schemaSelected: Schema;
  currentContent: Object;
  multipleContents: Array<Object> = new Array<Object>();
  isLoading = true;

  // PermissionServices is only iported for getting content by Location
  constructor(private dataManager: DataManagementService, private authService: AuthService, private sanitizer: DomSanitizer,
    private permissions: PermissionService) { }

  ngOnInit() { // THE COMMENTED OUT CODE IS GETTING THE CONTENT BY TAG USING THE CLIENTNAME, COMMENT OUT THE FOLLOWING LINE OF CODE TO RETURN TO THIS
    //this.authService.FlUser.subscribe((user) => this.dataManager.getContentByTag(user.client, this.schemaSelected._fl_meta_.fl_id)
    this.authService.FlUser.subscribe((user) => this.dataManager.getContentByTag(this.permissions.localPermission.name, this.schemaSelected._fl_meta_.fl_id)
    .subscribe((contents) => {
      if (contents.length == 1) { // <-- *** CONTENT QUERY RETURNED ONE RESULT ***
        console.log('1 content found inside Collections Schema Tree');
        this.isLoading = false;
        this.currentContent = contents[0];
        console.log(contents[0]);
      }
      if (contents.length > 1) { // <-- *** CONTENT QUERY RETURNED MULTIPLE RSULTS ***
        console.log('multiple content was found');
        this.isLoading = false;
        this.multipleContents = contents;
        //console.log(contents);
      }
      if (contents.length == 0) { // <-- *** CONTENT QUERY RETURNED EMPTY ***
        //console.log(contents);
        this.isLoading = false;
        console.error('No Content Found');
      }
    }));
    
  }

  getContentFromKey(key: string) {
    if(this.currentContent) {
      return this.currentContent[key];
    }
  }

  getHtmlCodeFromKey(key: string) {
    if(this.currentContent) {
      return this.sanitizer.bypassSecurityTrustHtml(this.currentContent[key])
    }
  }

  getContentFromIndex(content: Object, index: number) {
    const key = Object.keys(content)[index];
    return content[key];
  }

  getObjectKeys(content: Object) {
    return Object.keys(content);
  }

  findProperContentKey(content: Object) {
    let key:string;
    if (key = Object.keys(content).find(keyString => keyString.includes('Name'))) {
      return key;
    }
    if(key = Object.keys(content).find(keyString => keyString.includes('name'))) { 
      return key;
    }
    if (key = Object.keys(content).find(keyString => keyString.includes('User'))) {
      return key;
    }
    if(key = Object.keys(content).find(keyString => keyString.includes('user'))) { 
      return key;
    }
    if (key = Object.keys(content).find(keyString => keyString.includes('Title'))) {
      return key;
    }
    if(key = Object.keys(content).find(keyString => keyString.includes('title'))) { 
      return key;
    }
    if(key = Object.keys(content).find(keyString => keyString.includes('Email'))) { 
      return key;
    }
    if(key = Object.keys(content).find(keyString => keyString.includes('email'))) { 
      return key;
    }
  }

  setContent(index:number) {
    this.currentContent = this.multipleContents[index];
  }

  getColSize(gridColumns:Object) {
    return `col-lg-${gridColumns['lg']} col-md-${gridColumns['md']} col-sm-${gridColumns['sm']} col-${gridColumns['xs']}`;
  }

  // Add this Funciton to a seperate Service that will handle the Text (Classes) on flameLink Description
  showFieldName(schemaField: Schema) {
    return schemaField.description.search('showFN') != -1
  }

}
