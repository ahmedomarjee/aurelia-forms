import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IWidgetOptions} from "./widget-options";

export interface IFileUploaderOptions extends IWidgetOptions {
    acceptType?: string;
}