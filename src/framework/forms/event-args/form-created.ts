import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";

export interface IFormCreatedEventArgs extends ICustomEventArgs {
  form: FormBase
}