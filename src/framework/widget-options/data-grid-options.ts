import {IDataGridColumnOptions} from "./data-grid-column-options"
import {IListOptions} from "./list-options";

export interface IDataGridOptions extends IListOptions {
    columns?: IDataGridColumnOptions[]

    showFilterRow?: boolean;
    autoHeight?: boolean;
    
    rowScriptTemplateId?: string;
}