import {IScope} from "./scope";

export interface IExpressionProvider {
  createObserver(expression: string, action: {(newValue?: any, oldValue?: any): void}, scope?: IScope): {(): void};
  evaluateExpression(expression: string, scope?: IScope): any;
}