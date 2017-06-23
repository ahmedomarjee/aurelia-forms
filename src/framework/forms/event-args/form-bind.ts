import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";

export interface IFormBindEventArgs extends ICustomEventArgs {
  form: FormBase
}