import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IBaseBoxOptions} from "./base-box-options";

export interface INumberBoxOptions extends IBaseBoxOptions {
    showSpinButtons?: boolean;
    showClearButton?: boolean;

    minValue?: number;
    maxValue?: number;
    step?: number;
}