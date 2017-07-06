import {IDataSourceOptionFilter} from "../../base/interfaces/data-source-option-filter";

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
    autoLoad?: boolean;

    allowNew?: string;
    allowSave?: string;
    allowDelete?: string;

    filters: IDataSourceOptionFilter[];
}