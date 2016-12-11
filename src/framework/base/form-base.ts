import * as Interfaces from "../interfaces";
import {
  BindingEngine,
  Expression
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
  model: ModelInstance;
  function: FunctionInstance;
  commandServerData: CommandServerDataInstance;
  expression: Map<string, Expression>;

  constructor(private bindingEngine: BindingEngine) {
    this.model = new ModelInstance();
    this.function = new FunctionInstance();
    this.commandServerData = new CommandServerDataInstance();
    this.expression = new Map();
  }

  addModel(model: Interfaces.IModel): void {
    this.model.info[model.id] = model;
  }
  addVariable(variable: Interfaces.IVariable): void {

  }
  addCommandServerData(id: string, commandServerData: Interfaces.ICommandData): void {
    this.commandServerData[id] = commandServerData;
  }
  addCommand(command: Interfaces.ICommand): void {

  }
  addFunction(id: string, functionInstance: any): void {
    this.function[id] = functionInstance;
  }
  addEditPopup(editPopup: Interfaces.IEditPopup): void {

  }
  addMapping(mapping: Interfaces.IMapping): void {

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
}
