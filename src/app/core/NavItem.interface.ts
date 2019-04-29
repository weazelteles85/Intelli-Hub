export interface NavItem {
    attachment: number,
    isActive?: Boolean,
    childIndex?: Array<NavItem>,
    component: string,
    cssClass: string,
    id: number,
    newWindow: boolean,
    order: number,
    parentIndex: number,
    title: string,
    url: string,
    uuid: number
}