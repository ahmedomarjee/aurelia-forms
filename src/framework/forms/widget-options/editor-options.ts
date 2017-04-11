import {IBinding} from "../interfaces/binding";
import {IWidgetOptions} from "./widget-options";
import {IValidationRule} from "./validation-rule";
import {IDataSourceOptionFilter} from "../../base/interfaces/export";

export interface IEditorOptions extends IWidgetOptions {
    caption: string;

    isReadOnly?: boolean;
    isReadOnlyExpression?: string;

    placeholder?: string;

    binding?: IBinding;
    
    filter?: string;
    filters?: IDataSourceOptionFilter[];

    validationRules?: IValidationRule[];
}