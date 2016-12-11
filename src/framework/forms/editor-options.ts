import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";

export interface IEditorOptions {
    id: string;
    options: IOptions;

    caption: string;
    isReadOnly?: boolean;

    binding?: IBinding;

    validationRules: IValidationRule[];
}