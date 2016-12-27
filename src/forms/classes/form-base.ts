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
  CommandInstance
} from "./command-instance";
import {
  VariableInstance
} from "./variable-instance";
import {
  CommandServerDataInstance
} from "./command-server-data-instance";
import {
  ToolbarService
} from "../services/toolbar-service";

export class FormBase {
  constructor() {
    this.bindingEngine = Container.instance.get(BindingEngine);
    this.toolbar = Container.instance.get(ToolbarService);
    this.model = new ModelInstance(this);
    this.variable = new VariableInstance();
    this.function = new FunctionInstance();
    this.command = new CommandInstance(this);
    this.commandServerData = new CommandServerDataInstance();
    this.expression = new Map();

    this.toolbarOptions = this.toolbar.createToolbarOptions(this);
  }

  toolbarOptions: DevExpress.ui.dxToolbarOptions;
  title: string;

  readonly bindingEngine: BindingEngine;
  readonly toolbar: ToolbarService;
  readonly model: ModelInstance;
  readonly variable: VariableInstance;
  readonly function: FunctionInstance;
  readonly command: CommandInstance;
  readonly commandServerData: CommandServerDataInstance;
  protected readonly expression: Map<string, Expression>;

  activate(routeInfo: any) {
    if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
      this.variable.data.$id = routeInfo.parameters.id;
    }
  }

  createObserver(expression: string, action: {(newValue?: any, oldValue?: any): void}, bindingContext?: any): {(): void} {
    return this
      .bindingEngine
      .expressionObserver(bindingContext || this, expression)
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
    return this.evaluateExpression(key);
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
    this.command.addInfo(command);
  }
  protected addFunction(id: string, functionInstance: any): void {
    this.function.add(id, functionInstance);
  }
  protected addEditPopup(editPopup: Interfaces.IEditPopup): void {

  }
  protected addMapping(mapping: Interfaces.IMapping): void {

  }
}
