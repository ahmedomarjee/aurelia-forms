import {
  IRestGetOptions
} from "./rest-get-options";

export interface IRestPostOptions extends IRestGetOptions {
  data: any;
  increaseLoadingCount?: boolean;
}