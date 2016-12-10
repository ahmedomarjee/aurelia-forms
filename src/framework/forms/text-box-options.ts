import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";

export interface ITextBoxOptions {
    id: string;
    options: IOptions;

    caption: string;
    isReadOnly?: boolean;
    maxLength?: number;

    binding?: IBinding;

    validationRules: IValidationRule[];
}