import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase'


@Injectable()

export class FirebaseService {


    constructor(
        private db: AngularFirestore,
        private firebaseAuth: AngularFireAuth,
    ) { 

    }


    async getNextSequenceNumber(id: string) : Promise<number> {
        var sequenceCollection = this.db.collection<any>('/sequences');
        var doc = await sequenceCollection.doc(this.firebaseAuth.auth.currentUser.uid).ref.get();
        var data = doc.data();
        if(data == null) data = {};
        if(data[id] == null || data[id] == NaN) data[id] = 1;
        else data[id] += 1;
        await sequenceCollection.doc(this.firebaseAuth.auth.currentUser.uid).set(data);
        return data[id];
    } 

    async getNextSystemSequenceNumber(id: string) : Promise<number> {
        var sequenceCollection = this.db.collection<any>('/sequences');
        var doc = await sequenceCollection.doc("system").ref.get();
        var data = doc.data();
        if(data == null) data = {};
        if(data[id] == null || data[id] == NaN) data[id] = 1;
        else data[id] += 1;
        await sequenceCollection.doc("system").set(data);
        return data[id];
    }

    getNewTimeStamp() {
        return firebase.firestore.Timestamp.fromDate(new Date());
    }

}
