export interface Permission {
    _fl_meta_?: {
        createdBy?: string,
        createdDate?: Date,
        docId?: string,
        lastModifiedBy?: string,
        lastModifiedDate?: Date,
    };
    content?: {
        production?: Object;
    };
    environments?: Object;
    id: string;
    media?: Object;
    name: string;
    navigation?: Object;
    permissions?: Object;
    schemas?: Object;
    settings?: Object;
    users?: Object;
}
