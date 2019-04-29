import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Schema } from '../../../../core/Schema.interface';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { Content } from '../../../../core/Content.interface';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-fl-single',
  templateUrl: './fl-single.component.html',
  styleUrls: ['./fl-single.component.scss']
})
export class FlSingleComponent implements OnInit {

  @Input() schemaSelected: Schema;
  currentContent: Object;

  constructor(private dataManager: DataManagementService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.dataManager.currentContent.subscribe(content => this.currentContent = content);
    //this.currentContentSubj.subscribe((contentObj) => this.currentContent = contentObj);
    this.dataManager.setContentBySchemaOnly(this.schemaSelected._fl_meta_.fl_id);
      
  }

  getContentFromKey(key: string) {
    //console.log(this.currentContent[key]);
    if (this.currentContent) {
      return this.currentContent[key];
    }
  }

  getHtmlCodeFromKey(key: string) {
    if(this.currentContent) {
      return this.sanitizer.bypassSecurityTrustHtml(this.currentContent[key])
    }
  }

  getMediaFromKey(key:string) {
    if (this.currentContent) {
      const url = this.dataManager.getImageURL('IdsDPeiFstLcYOr122Ox_LogoBlackLong.png');
      return url;
    }
  }

  getColSize(gridColumns:Object) {
    return `col-lg-${gridColumns['lg']} col-md-${gridColumns['md']} col-sm-${gridColumns['sm']} col-${gridColumns['xs']}`;
  }

  // Add this Funciton to a seperate Service that will handle the Text (Classes) on flameLink Description
  showFieldName(schemaField: Schema) {
    return schemaField.description.search('showFN') != -1
  }

}
