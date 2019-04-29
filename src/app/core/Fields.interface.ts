

export interface Field {
    constraints: Array<any>,
    defaultValue: string,
    description: string,
    fieldSeparator?: string,
    displayFormat?: string,
    gridColumns: Array<number>,
    hidden: boolean,
    id: number,
    key: string,
    multiple?:boolean,
    relation?: string,
    relationalFieldsToShow?: Array<any>,
    show: boolean,
    title: string,
    type: string
}