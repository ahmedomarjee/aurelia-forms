import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IWidgetOptions} from "./widget-options";

export interface IIncludeOptions extends IWidgetOptions {
    idTemplate?: string;
    dataProperty?: string;
}