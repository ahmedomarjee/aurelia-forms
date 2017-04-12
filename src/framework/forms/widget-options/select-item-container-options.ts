import {
  ISelectItem
} from "./select-item";
import {
  IDataSourceOptionFilter
} from "../../base/interfaces/data-source-option-filter";

export interface ISelectItemContainerOptions {
  selectItem: ISelectItem;
  filter?: any;
  customs?: IDataSourceOptionFilter[];
}