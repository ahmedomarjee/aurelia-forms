export interface INavigationRoute {
  caption: string;
  route: string;
  navigation?: any;

  children: INavigationRoute[];
}