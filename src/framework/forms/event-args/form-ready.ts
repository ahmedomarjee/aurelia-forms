import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";

export interface IFormReadyEventArgs extends ICustomEventArgs {
  form: FormBase
}