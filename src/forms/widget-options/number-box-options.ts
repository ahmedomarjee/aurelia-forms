import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";

export interface INumberBoxOptions extends IEditorOptions {
    showSpinButtons?: boolean;
    showClearButton?: boolean;

    min?: number;
    max?: number;
    step?: number;

    format?: string;
}