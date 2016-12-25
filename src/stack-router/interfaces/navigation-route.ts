export interface INavigationRoute {
  title: string;
  icon?: string;
  route: string;

  children: INavigationRoute[];
}