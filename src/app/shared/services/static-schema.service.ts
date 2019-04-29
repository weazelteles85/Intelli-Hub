import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Schema } from '../../core/Schema.interface';
import { merge } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable()
export class StaticSchemaService {

  staticSchemas: Array<Schema> = new Array<Schema>();


  constructor(private afs: AngularFirestore) {
    this.staticSchemas.push(this.getAddUserSchema());
    this.staticSchemas.push(this.getUsersSchema());
    // Simply Add more push statements for future static schemas

    // Loop through all static schemas
    for (let schema of this.staticSchemas) {
      //Check if Static Schema Already Exists in Cloud 
      this.afs.doc<Schema>(`fl_schemas/${schema._fl_meta_.docId}`).valueChanges().subscribe((cloudSchema) => {
        // Creates a new Schema if its not in cloud
        if (!cloudSchema) {
          console.log('Schema Not in Cloud, creating on now');
          // Move this function to a firebase Cloud Function to avoid future security issues
          const schemaRef: AngularFirestoreDocument<any> = this.afs.doc(`fl_schemas/${schema._fl_meta_.docId}`);
          schemaRef.set(schema, { merge: true });
          // Add the the Static Schema to the Permissions List in Super Admin
          const PermissionRef = this.afs.firestore.doc(`fl_permissions/1`)
          PermissionRef.set({
            content: {
              production: {
                [schema._fl_meta_.fl_id]: {
                  create: true,
                  delete: true,
                  update: true,
                  view: true
                }
              }
            }
          }, { merge: true });
        }
        else {
          //console.log('Schema Exists in Cloud')
        }
      });
    }

  }



  // ### ADD MORE STATIC SCHEMAS HERE AFTER CREATING THEM

  getAddUserSchema() {
    const AddUserSchema = {
      _fl_meta_: {
        createdBy: 'Intellihub App',
        createdDate: new Date(),
        docId: 'StaticSchema_AddUser',
        env: 'production',
        fl_id: 'createUser'
      },
      description: 'Static Schema(Do Not Edit/Change)',
      enabled: true,
      fields: [],
      group: 'Static Schema',
      icon: '',
      id: 'StaticSchema_AddUser',
      sortable: true,
      title: '(Static)create_User',
      type: 'static-schema',
    }
    return AddUserSchema;
  }

  getUsersSchema() {
    const UsersSchema = {
      _fl_meta_: {
        createdBy: 'Intellihub App',
        createdDate: new Date(),
        docId: 'StaticSchema_Users',
        env: 'production',
        fl_id: 'users'
      },
      description: 'Static Schema(Do Not Edit/Change)',
      enabled: true,
      fields: [],
      group: 'Static Schema',
      icon: '',
      id: 'StaticSchema_Users',
      sortable: true,
      title: '(Static)Users',
      type: 'static-schema',
    }
    return UsersSchema;
  }
}
