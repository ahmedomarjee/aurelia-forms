import * as Interfaces from "../interfaces";
import {
  BindingEngine,
  Expression,
  Container
} from "aurelia-framework";
import {
  ModelInstance
} from "./model-instance";
import {
  FunctionInstance
} from "./function-instance";
import {
  VariableInstance
} from "./variable-instance";
import {
  CommandServerDataInstance
} from "./command-server-data-instance";

export class FormBase {
  readonly bindingEngine: BindingEngine;
  readonly model: ModelInstance;
  readonly variable: VariableInstance;
  readonly function: FunctionInstance;
  readonly commandServerData: CommandServerDataInstance;
  protected readonly expression: Map<string, Expression>;

  constructor() {
    this.bindingEngine = Container.instance.get(BindingEngine);
    this.model = new ModelInstance(this);
    this.variable = new VariableInstance();
    this.function = new FunctionInstance();
    this.commandServerData = new CommandServerDataInstance();
    this.expression = new Map();
  }

  protected addModel(model: Interfaces.IModel): void {
    this.model.addInfo(model);
  }
  protected addVariable(variable: Interfaces.IVariable): void {
    this.variable.addInfo(variable);
  }
  protected addCommandServerData(id: string, commandServerData: Interfaces.ICommandData): void {
    this.commandServerData.add(id, commandServerData);
  }
  protected addCommand(command: Interfaces.ICommand): void {

  }
  protected addFunction(id: string, functionInstance: any): void {
    this.function.add(id, functionInstance);
  }
  protected addEditPopup(editPopup: Interfaces.IEditPopup): void {

  }
  protected addMapping(mapping: Interfaces.IMapping): void {

  }

  createObserver(expression: string, action: {(newValue?: any, oldValue?: any): void}): {(): void} {
    return this
      .bindingEngine
      .expressionObserver(this, expression)
      .subscribe(action)
      .dispose;
  }
  evaluateExpression(expression: string, overrideContext?: any): any {
    let parsed = this.expression.get(expression);

    if (!parsed) {
      parsed = this.bindingEngine.parseExpression(expression);
      this.expression.set(expression, parsed);
    }

    return parsed.evaluate({
      bindingContext: this,
      overrideContext: overrideContext  
    });
  }
  getFileDownloadUrl(key: string): string {
    return key;
  }
}
