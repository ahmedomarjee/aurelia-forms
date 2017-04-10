export interface IDataSourceCustomizationOptions {
  canLoad?: {(): boolean};
  getCustomWhere?: {(): any[]};
}