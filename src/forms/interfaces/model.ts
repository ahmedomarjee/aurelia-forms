import {IFilter} from "./filter";

export interface IModel {
    id: string;

    webApiAction?: string;
    webApiColumns?: any;
    webApiExpand?: any;
    webApiWhere?: any;
    webApiOrderBy?: any;
    webApiMaxRecords?: number;
    webApiSearchtextEnabled?: boolean;

    key?: string;
    keyProperty?: string;
    postOnSave?: boolean;
    isMain?: boolean;
    autoLoad?: boolean;

    allowNew?: string;
    allowDelete?: string;

    filters: IFilter[];
}