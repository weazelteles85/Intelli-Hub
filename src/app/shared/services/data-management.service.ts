import { Injectable, AfterContentInit, OnInit } from '@angular/core';
import { Schema } from '../../core/Schema.interface';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Content } from '../../core/Content.interface';
import { fl_Navigation } from '../../core/Navigation.interface';
import *  as firebase from 'firebase';
import { environment } from '../../../environments/environment'

@Injectable()
export class DataManagementService {

  storageBucketURL: string = 'https://firebasestorage.googleapis.com/v0/b/' + environment.firebaseConfig.storageBucket;
  selectedSchemaDisplaying: ReplaySubject<Schema> = new ReplaySubject<Schema>(1);
  currentContent: Subject<Object> = new Subject<Content>();
  fl_Schemas: Observable<Array<Array<Schema>>>;
  local_fl_schemas: Array<Array<Schema>>;
  fl_Navigation: Observable<Array<Array<fl_Navigation>>>;

  constructor(private afs: AngularFirestore) {
    this.fl_Schemas = this.afs.collection<Array<Schema>>('fl_schemas').valueChanges();
    this.fl_Navigation = this.afs.collection<Array<fl_Navigation>>('fl_navigation').valueChanges()
    this.fl_Schemas.subscribe((schemas) => {
      this.local_fl_schemas = schemas;
    });
  }

  public setSelectedSchema(schemaId: string) {
    let notFound = true;
    for (let index = 0; index < this.local_fl_schemas.length; index++) {
      const element: Schema = <Schema><any>this.local_fl_schemas[index];
      if (element.id == schemaId) {
        //console.log('inside Schema Id Found');
        this.selectedSchemaDisplaying.next(element);
        console.log('schema found');
        notFound = false
        return element;
      }
    }
    if (notFound) console.error(`no Schema with ID:${schemaId} was found`);
  }

  setContentBySchemaOnly(schema: string) {
    console.log(schema);
    this.afs.collection('fl_content', ref => {
      return ref.where('_fl_meta_.schema', '==', schema);
    }).valueChanges().subscribe((content) => this.currentContent.next(content[0]));

  }

  getContentByCreator(createdBy: string, schema: string) {
    return this.afs.collection('fl_content', ref => {
      return ref.where('_fl_meta_.createdBy', '==', createdBy).where('_fl_meta_.schema', '==', schema);
    }).valueChanges();
  }

  getContentByTag(tagClient: string, schema: string) {
    return this.afs.collection('fl_content', ref => {
      return ref.where('clientName', 'array-contains', tagClient).where('_fl_meta_.schema', '==', schema);
    }).valueChanges();
  }

  getImageURL(file: string) {
    const middleDefaultSize: string = '/o/flamelink%2Fmedia%2F';
    const endOfURLRef: string = '?alt=media';
    //console.log(this.storageBucketURL + middleDefaultSize + file + endOfURLRef);
    return this.storageBucketURL + middleDefaultSize + file + endOfURLRef;
  }

  saveNewContentToCloud(contentObj) {
    //Have this function happen via a Cloud Function
    const schemaRef: AngularFirestoreDocument<any> = this.afs.doc(`fl_content/${contentObj._fl_meta_.docId}`);
    schemaRef.set(contentObj, { merge: true });
  }


}
