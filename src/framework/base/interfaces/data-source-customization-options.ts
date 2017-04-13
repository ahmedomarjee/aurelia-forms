export interface IDataSourceCustomizationOptions {
  canLoad?: {(): boolean};
  getCustomWhere?: {(): any[]};
  getSearchText?: {(): string};

  resultInterceptor?: {(data: any): any};
}