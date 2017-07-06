import {
  IDataSourceLastLoadInfo
} from "./data-source-last-load-info";

export interface IViewScrollInfo {
  lastLoadInfo: IDataSourceLastLoadInfo;
  index: number;
  maxCount: number;
}