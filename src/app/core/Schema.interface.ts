import { Field } from "./Fields.interface";


export interface Schema {
    _fl_meta_: { 
        createdBy: string,
        createdDate: Date,
        docId: string,
        env: string,
        fl_id: string
     },
    description: string,
    enabled: boolean,
    fields: Array<Field>, 
    group: string,
    icon: string,
    id: string,
    sortable: boolean,
    title: string,
    type: string
}