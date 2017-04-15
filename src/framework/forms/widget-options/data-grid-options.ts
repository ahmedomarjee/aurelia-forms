import {IDataGridColumnOptions} from "./data-grid-column-options"
import {IListOptionsBase} from "./list-options-base";

export interface IDataGridOptions extends IListOptionsBase {
    columns?: IDataGridColumnOptions[]

    showFilterRow?: boolean;
    
    rowScriptTemplateId?: string;
}