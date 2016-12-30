import * as Interfaces from "../interfaces/export";
import {
  BindingEngine,
  Expression,
  Container,
  TaskQueue
} from "aurelia-framework";
import {
  Models
} from "./models";
import {
  Functions
} from "./functions";
import {
  Commands
} from "./commands";
import {
  Variables
} from "./variables";
import {
  NestedForms
} from "./nested-forms";
import {
  CommandServerData
} from "./command-server-data";
import {
  ToolbarService
} from "../services/toolbar-service";
import {
  CommandService
} from "../services/command-service";
import {
  WidgetCreatorService
} from "../widget-services/widget-creator-service";
import {
  CustomEvent
} from "../../base/export";
import {
  IFormAttachedEventArgs,
  IFormReadyEventArgs,
  IFormReactivatedEventArgs
} from "../event-args/export";
import {
  FormBaseImport
} from "./form-base-import";
import {
  Expressions
} from "./expressions";

export class FormBase {
  constructor(
    private formBaseImport: FormBaseImport
  ) {
    this.widgetCreator = formBaseImport.widgetCreator;
    this.command = formBaseImport.command;
    this.toolbar = formBaseImport.toolbar;
    this.models = formBaseImport.models;
    this.variables = formBaseImport.variables;
    this.nestedForms = formBaseImport.nestedForms;
    this.functions = formBaseImport.functions;
    this.expressions = formBaseImport.expressions;
    this.commands = formBaseImport.commands;
    this.commandServerData = formBaseImport.commandServerData;
    this.onFormAttached = formBaseImport.onFormAttached;
    this.onFormReady = formBaseImport.onFormReady;
    this.onFormReactivated = formBaseImport.onFormReactivated;

    this.models.registerForm(this);
    this.variables.registerForm(this);
    this.functions.registerForm(this);
    this.commands.registerForm(this);
    this.expressions.registerForm(this);
  }

  toolbarOptions: DevExpress.ui.dxToolbarOptions;
  title: string;

  widgetCreator: WidgetCreatorService;
  command: CommandService;
  toolbar: ToolbarService;
  models: Models;
  variables: Variables;
  nestedForms: NestedForms;
  functions: Functions;
  commands: Commands;
  expressions: Expressions;
  commandServerData: CommandServerData;
  onFormAttached: CustomEvent<IFormAttachedEventArgs>;
  onFormReady: CustomEvent<IFormReadyEventArgs>;
  onFormReactivated: CustomEvent<IFormReadyEventArgs>;

  attached() {
    const promise = this.onFormAttached.fire({
      form: this
    });

    this.formBaseImport.taskQueue.queueTask(() => {
      this.onFormReady.fire({
        form: this,
      });
    });

    return promise;    
  }
  activate(routeInfo: any) {
    if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
      this.variables.data.$id = routeInfo.parameters.id;
    }
  }
  reactivate() {
    this.onFormReactivated.fire({
      form: this
    });
  }


  getFileDownloadUrl(key: string): string {
    return this.expressions.evaluateExpression(key);
  }
  getFormsInclOwn(): FormBase[] {
    return [this, ...this.nestedForms.getNestedForms()];
  }

  save(): Promise<any> {
    return this.models.save()
      .then(() => {
        DevExpress.ui.notify("Daten wurden erfolgreich gespeichert", "SUCCESS", 3000);
      })
      .catch(r => {
        this.formBaseImport.error.showAndLogError(r);
      });
  }
  delete(): Promise<any> {
    return this.models.save()
      .then(() => {
        this.formBaseImport.router.removeViewModel(this);
      })
      .catch(r => {
        this.formBaseImport.error.showAndLogError(r);
      });
  }

  protected addModel(model: Interfaces.IModel): void {
    this.models.addInfo(model);
  }
  protected addVariable(variable: Interfaces.IVariable): void {
    this.variables.addInfo(variable);
  }
  protected addCommandServerData(id: string, commandServerData: Interfaces.ICommandData): void {
    this.commandServerData.add(id, commandServerData);
  }
  protected addCommand(command: Interfaces.ICommand): void {
    this.commands.addInfo(command);
  }
  protected addFunction(id: string, functionInstance: any, namespace: string, customParameter?: any): void {
    this.functions.add(id, functionInstance, namespace, customParameter);
  }
  protected addNestedForm(id: string): void {
    this.nestedForms.addInfo(id);
  }
  protected addEditPopup(editPopup: Interfaces.IEditPopup): void {

  }
  protected addMapping(mapping: Interfaces.IMapping): void {

  }
  protected submitForm(commandExpression: string): void {
    const command: Interfaces.ICommandData = this.expressions.evaluateExpression(commandExpression);
    if (!command || !command.execute) {
      return;
    }

    this.command.execute(this.expressions, command);
  }
  protected onConstructionFinished(): void {
    this.toolbarOptions = this.toolbar.createToolbarOptions(this);
  }
}
