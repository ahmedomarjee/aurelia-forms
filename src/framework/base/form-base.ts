import * as Interfaces from "../interfaces";
import {
  BindingEngine,
  Expression
} from "aurelia-framework";
import {
  Model
} from "./model";
import {
  Function
} from "./function";
import {
  CommandServerData
} from "./command-server-data";

export class FormBase {
  model: Model;
  function: Function;
  commandServerData: CommandServerData;
  expression: Map<string, Expression>;

  constructor(private bindingEngine: BindingEngine) {
    this.model = new Model();
    this.function = new Function();
    this.commandServerData = new CommandServerData();
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
