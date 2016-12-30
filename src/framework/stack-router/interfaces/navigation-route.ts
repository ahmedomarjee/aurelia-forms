export interface INavigationRoute {
  title: string;
  route: string;
  navigation?: any;

  children: INavigationRoute[];
}