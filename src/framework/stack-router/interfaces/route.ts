export interface IRoute {
  caption: string;
  route?: string | string[];
  moduleId?: string;
  navigation?: any;

  children?: IRoute[];

  canActivate?(): boolean;
}