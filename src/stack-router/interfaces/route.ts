export interface IRoute {
  route: string | string[];
  title: string;
  viewModel: string;
  isNavigation?: boolean;
}