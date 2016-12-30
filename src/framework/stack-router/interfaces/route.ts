export interface IRoute {
  route: string | string[];
  title: string;
  moduleId: string;
  navigation?: any;

  children?: IRoute[];

  canActivate?(): boolean;
}