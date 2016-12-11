import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {ITextBoxOptions} from "./text-box-options";

export interface ITextAreaOptions extends ITextBoxOptions {
    height?: string;
}