import { NavItem } from "./NavItem.interface";

export interface fl_Navigation {
    _fl_meta_: {
        createdBy: string,
        createdDate: string,
        docId: string,
        env: string,
        fl_id: string,
        lastModifiedBy: string,
        lastModifiedDate: string,
        locale: string,
    },
    id: string,
    items: Array<NavItem>,
    title: string
}