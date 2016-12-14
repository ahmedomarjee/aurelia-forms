import {IBinding} from "../interfaces/binding";
import{IWidgetOptions} from "./widget-options";
import {IValidationRule} from "./validation-rule";

export interface IEditorOptions extends IWidgetOptions {
    caption: string;

    isReadOnly?: boolean;

    binding?: IBinding;
    validationRules?: IValidationRule[];
}