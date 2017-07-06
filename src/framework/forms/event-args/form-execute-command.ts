import {
  FormBase
} from "../classes/form-base";
import {
  ICustomEventArgs
} from "../../base/export";
import {
  ICommandData
} from "../interfaces/export";

export interface IFormExecuteCommandEventArgs extends ICustomEventArgs {
  form: FormBase,
  commands: ICommandData[];
  allowGlobalCommands: boolean;
}