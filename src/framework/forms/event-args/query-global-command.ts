import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";
import {
  ICommandData
} from "../interfaces/export";

export interface IQueryGlobalCommandEventArgs extends ICustomEventArgs {
  commands: ICommandData[];
}