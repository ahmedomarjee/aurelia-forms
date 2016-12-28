export interface IRoute {
  route: string | string[];
  title: string;
  icon?: string;
  moduleId: string;
  isNavigation?: boolean;

  children?: IRoute[];

  canActivate?(): boolean;
}