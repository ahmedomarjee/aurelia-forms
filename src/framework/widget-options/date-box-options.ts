import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";

export interface IDateBoxOptions extends IEditorOptions {
    min?: Date;
    max?: Date;
    format?: string;
}