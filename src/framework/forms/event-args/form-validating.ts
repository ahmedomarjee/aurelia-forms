import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";
import {
  IValidationResult
} from "../interfaces/export"

export interface IFormValidatingEventArgs extends ICustomEventArgs {
  form: FormBase;
  validationResult: IValidationResult;
}