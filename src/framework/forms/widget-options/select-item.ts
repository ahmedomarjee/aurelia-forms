export interface ISelectItem {
    id?: string;
    elementName?: string;

    valueMember?: string;
    displayMember?: string;

    action?: string;
    columns?: string[];
    where?: any;
    expand?: any;
    orderBy?: any;

    items?: any[];

    itemTemplate?: string;
    fieldTemplate?: string;
    titleTemplate?: string;
}