import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";

export interface ISelectOptions extends IEditorOptions {
    filter?: string;
}