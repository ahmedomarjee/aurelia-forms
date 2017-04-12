import {
  Scope
} from "aurelia-framework";

export interface IExpressionProvider {
  createObserver(expression: string, action: {(newValue?: any, oldValue?: any): void}, scope?: Scope): {(): void};
  evaluateExpression(expression: string, scope?: Scope): any;
}