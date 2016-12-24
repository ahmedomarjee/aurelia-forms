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

    hasItemTemplate?: boolean;
    hasTitleTemplate?: boolean;
    hasFieldTemplate?: boolean;
}