import {IBinding} from "../interfaces/binding";
import {IWidgetOptions} from "./widget-options";
import {IValidationRule} from "./validation-rule";

export interface IEditorOptions extends IWidgetOptions {
    caption: string;

    isReadOnly?: boolean;
    isReadOnlyExpression?: string;

    binding?: IBinding;
    validationRules?: IValidationRule[];
}