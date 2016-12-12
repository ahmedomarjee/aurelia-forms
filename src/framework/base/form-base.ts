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
  CommandServerDataInstance
} from "./command-server-data-instance";

export class FormBase {
  readonly bindingEngine: BindingEngine;
  readonly model: ModelInstance;
  readonly function: FunctionInstance;
  readonly commandServerData: CommandServerDataInstance;
  protected readonly expression: Map<string, Expression>;

  constructor() {
    this.bindingEngine = Container.instance.get(BindingEngine);
    this.model = new ModelInstance();
    this.function = new FunctionInstance();
    this.commandServerData = new CommandServerDataInstance();
    this.expression = new Map();
  }

  protected addModel(model: Interfaces.IModel): void {
    this.model.info[model.id] = model;
  }
  protected addVariable(variable: Interfaces.IVariable): void {

  }
  protected addCommandServerData(id: string, commandServerData: Interfaces.ICommandData): void {
    this.commandServerData[id] = commandServerData;
  }
  protected addCommand(command: Interfaces.ICommand): void {

  }
  protected addFunction(id: string, functionInstance: any): void {
    this.function[id] = functionInstance;
  }
  protected addEditPopup(editPopup: Interfaces.IEditPopup): void {

  }
  protected addMapping(mapping: Interfaces.IMapping): void {

  }

  createObserver(expression: string, action: {(newValue?: any, oldValue?: any): void}): {(): void} {
    const observer = this.bindingEngine.expressionObserver({
      bindingContext: this,
      overrideContext: null 
    }, expression);

    return observer.subscribe(action).dispose;
  }
  evaluateExpression(expression: string): any {
    let parsed = this.expression.get(expression);

    if (!parsed) {
      parsed = this.bindingEngine.parseExpression(expression);
      this.expression.set(expression, parsed);
    }

    return parsed.evaluate({
      bindingContext: this,
      overrideContext: null  
    });
  }
  getFileDownloadUrl(key: string): string {
    return key;
  }
}
