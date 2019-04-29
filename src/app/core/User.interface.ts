import * as firebase from 'firebase/app';

export interface FlUser {
    _fl_meta_?: {
        createdBy?: string,
        createdDate?: Date,
        docId?: string,
    };
    client?: string;
    displayName: string;
    email: string;
    enabled: string;
    firstName?: string;
    id: string;
    lastName?: string;
    locations?: Array<string>;
    permissions: firebase.firestore.DocumentReference;
    permissionsList?: Array<string>;
}
