import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";
import {
  IDataSourceOptionCustom,
  IDataSourceOptionFilter
} from "../../base/interfaces/export";

export interface ISelectOptions extends IEditorOptions {
    idSelect?: string;
    filter?: any;
    customs?: IDataSourceOptionCustom[];
    filters?: IDataSourceOptionFilter[];
}