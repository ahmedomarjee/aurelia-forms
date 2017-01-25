import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";

export interface IFormValidatingEventArgs extends ICustomEventArgs {
  form: FormBase
}