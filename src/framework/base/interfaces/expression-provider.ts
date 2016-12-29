export interface IExpressionProvider {
  createObserver(expression: string, action: {(newValue?: any, oldValue?: any): void}, bindingContext?: any): {(): void};
  evaluateExpression(expression: string, overrideContext?: any): any;
}