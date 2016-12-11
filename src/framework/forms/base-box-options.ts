import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";

export interface IBaseBoxOptions {
    id: string;
    options: IOptions;

    caption: string;
    isReadOnly?: boolean;

    binding?: IBinding;

    validationRules: IValidationRule[];
}