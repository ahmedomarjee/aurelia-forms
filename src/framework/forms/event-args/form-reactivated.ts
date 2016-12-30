import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";

export interface IFormReactivatedEventArgs extends ICustomEventArgs {
  form: FormBase
}