
export interface Content {
    _fl_meta_: {
        createdBy: string,
        createdDate: Date,
        docId: string,
        env: string,
        fl_id: string,
        locale: string,
        schema: string,
        schemaRef: firebase.firestore.DocumentReference,
        schemaType: string
    }
    clientEmail?: Array<string>,
    id: string
}