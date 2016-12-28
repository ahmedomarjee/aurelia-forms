import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";

export interface IFormAttachedEventArgs extends ICustomEventArgs {
  form: FormBase
}