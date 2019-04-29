import { Component, OnInit, Input, Output } from '@angular/core';
import { Schema } from '../../../../core/Schema.interface';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { Content } from '../../../../core/Content.interface';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { DataManagementService } from '../../../../shared/services/data-management.service';

@Component({
  selector: 'app-fl-form',
  templateUrl: './fl-form.component.html',
  styleUrls: ['./fl-form.component.scss']
})
export class FlFormComponent implements OnInit {

  @Input() schemaSelected: Schema;
  schemaForm: FormGroup;
  isFormVisible: boolean = false;

  constructor(private authService: AuthService, private dataManager: DataManagementService) { }

  ngOnInit() {
    this.schemaForm = new FormGroup({});
    for(let field of this.schemaSelected.fields) {
      this.schemaForm.addControl(field.key, new FormControl(field.defaultValue)) // Add validation here from field.constraints
    }
  }

  clearForm() {
    this.schemaForm.reset();
  }

  submitForm() {
    this.authService.FlUser.subscribe((user) => {
      const docRef = `${user.id.slice(0, 7)}${new Date().getTime()}`;
      const newContent = {
        _fl_meta_: {
          createdBy: user.id,
          createdDate: new Date(),
          docId: docRef,
          env: 'production',
          fl_id: docRef,
          locale: 'en-US',
          schema: this.schemaSelected.id,
          schemaRef: `/fl_schemas/${this.schemaSelected._fl_meta_.docId}`,
          schemaType: 'form'
        },
        clientEmail: [user.email],
        id: docRef,
      };
      for(let item of this.schemaSelected.fields) {
        if(this.schemaForm.get(item.key).value) {
          Object.defineProperty(newContent, item.key, {value : this.schemaForm.get(item.key).value, 
            writable : true, enumerable : true,configurable : true});
        }
      }
      //console.log(newContent);
      this.dataManager.saveNewContentToCloud(newContent);
      this.clearForm();
      this.isFormVisible = false;
    })
  }

  getColSize(gridColumns:Object) {
    return `col-lg-${gridColumns['lg']} col-md-${gridColumns['md']} col-sm-${gridColumns['sm']} col-${gridColumns['xs']}`;
  }

}
