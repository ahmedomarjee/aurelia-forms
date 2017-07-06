import {
  ICommandExecuteOptions
} from "./command-execute-options";
import {
  ILocalizationItem
} from "../../base/export";

export interface ICommandData {
  id: string;
  icon?: string;
  title?: string | ILocalizationItem;
  tooltip?: string | ILocalizationItem;
  sort?: number;
  shortcut?: string;
  badgeText?: string | ILocalizationItem;
  location?: string;
  locateInMenu?: string;
  isEnabled?: boolean;
  isEnabledExpression?: string
  isVisible?: boolean;
  isVisibleExpression?: string;
  execute?: { (options?: ICommandExecuteOptions): void } | { (options?: ICommandExecuteOptions): Promise<any> };
}