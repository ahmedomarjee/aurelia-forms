import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";
import {
  IDataSourceOptionFilter
} from "../../base/interfaces/data-source-option-filter";

export interface ISelectOptions extends IEditorOptions {
    idSelect?: string;
    filter?: any;
    customs?: IDataSourceOptionFilter[];
    filters?: IDataSourceOptionFilter[];
}