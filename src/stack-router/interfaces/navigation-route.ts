export interface INavigationRoute {
  title: string;
  route: string;

  children: INavigationRoute[];
}