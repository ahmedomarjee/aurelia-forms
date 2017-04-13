import {
  ICustomEventArgs
} from "../../base/export";

export interface ISearchEventArgs extends ICustomEventArgs {
  text: string;
}