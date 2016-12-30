export interface IRoute {
  title: string;
  route?: string | string[];
  moduleId?: string;
  navigation?: any;

  children?: IRoute[];

  canActivate?(): boolean;
}