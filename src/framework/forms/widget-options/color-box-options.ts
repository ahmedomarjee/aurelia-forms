import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";

export interface IColorBoxOptions extends IEditorOptions {
  editAlphaChannel?: boolean;
}