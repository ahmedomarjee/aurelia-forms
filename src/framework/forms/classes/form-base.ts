import * as Interfaces from "../interfaces/export";
import {
  bindable,
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
  EditPopups
} from "./edit-popups";
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
  CustomEvent,
  GlobalizationService,
  LocalizationService
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
    private element: Element,
    private formBaseImport: FormBaseImport
  ) {
    this.isEditForm = element.getAttribute("is-edit-form") === "true";
    this.isNestedForm = element.getAttribute("is-nested-form") === "true";
    
    this.popupStack = [];

    this.widgetCreator = formBaseImport.widgetCreator;
    this.command = formBaseImport.command;
    this.toolbar = formBaseImport.toolbar;
    this.models = formBaseImport.models;
    this.variables = formBaseImport.variables;
    this.nestedForms = formBaseImport.nestedForms;
    this.editPopups = formBaseImport.editPopups;
    this.functions = formBaseImport.functions;
    this.expressions = formBaseImport.expressions;
    this.commands = formBaseImport.commands;
    this.globalization = formBaseImport.globalization;
    this.localization = formBaseImport.localization;
    this.commandServerData = formBaseImport.commandServerData;
    this.onFormAttached = formBaseImport.onFormAttached;
    this.onFormReady = formBaseImport.onFormReady;
    this.onFormReactivated = formBaseImport.onFormReactivated;

    this.models.registerForm(this);
    this.variables.registerForm(this);
    this.functions.registerForm(this);
    this.commands.registerForm(this);
    this.expressions.registerForm(this);
    this.nestedForms.registerForm(this);
    this.editPopups.registerForm(this);
  }

  toolbarOptions: DevExpress.ui.dxToolbarOptions;
  id: string;
  title: string;

  isEditForm: boolean;
  isNestedForm: boolean;

  popupStack: DevExpress.ui.dxPopup[];

  widgetCreator: WidgetCreatorService;
  command: CommandService;
  toolbar: ToolbarService;
  models: Models;
  variables: Variables;
  nestedForms: NestedForms;
  editPopups: EditPopups;
  functions: Functions;
  commands: Commands;
  expressions: Expressions;
  globalization: GlobalizationService;
  localization: LocalizationService;
  commandServerData: CommandServerData;
  onFormAttached: CustomEvent<IFormAttachedEventArgs>;
  onFormReady: CustomEvent<IFormReadyEventArgs>;
  onFormReactivated: CustomEvent<IFormReadyEventArgs>;

  owningView: any;

  created(owningView: any, myView: any) {
    this.owningView = owningView;
    this.toolbarOptions = this.toolbar.createFormToolbarOptions(this);
  }
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

  showPopup(id: string) {
    if (!this[id]) {
      throw new Error(`No popup with id ${id} found`);
    }

    const popup: DevExpress.ui.dxPopup = this[id].instance;
    popup.show();
  }

  executeCommand(id: string) {
    const command = this.commands
      .getCommands()
      .find(i => i.id == id);

    if (!command) {
      return;
    }

    this.command.execute(this.expressions, command);
  }
  canSave(): boolean {
    return this
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => {
        if (!m.postOnSave) {
          return false;
        }

        return true;
      }));
  }
  canSaveNow(): boolean {
    return this
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => {
        if (!m.postOnSave) {
          return false;
        }
        if (!this.models.data[m.id] || this.models.data[m.id][m.keyProperty] === undefined) {
          return false;
        }

        return true;
      }));
  }  
  save(): Promise<any> {
    if (!this.canSave() || !this.canSaveNow()) {
      return Promise.resolve();
    }

    return this.models.save()
      .then(() => {
        DevExpress.ui.notify("Daten wurden erfolgreich gespeichert", "SUCCESS", 3000);
      })
      .catch(r => {
        this.formBaseImport.error.showAndLogError(r);
      });
  }

  canDeleteNow(): boolean {
    return this
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => {
        if (!m.postOnSave) {
          return false;
        }
        if (!this.models.data[m.id] || !this.models.data[m.id][m.keyProperty]) {
          return false;
        }

        return true;
      }));
  }
  delete(): Promise<any> {
    if (!this.canSave() || !this.canDeleteNow()) {
      return Promise.resolve();
    }

    return this.models.delete()
      .then(() => {
        history.back();
      })
      .catch(r => {
        this.formBaseImport.error.showAndLogError(r);
      });
  }

  translate(key: string): string {
    return this.localization.translate(this.expressions, key);
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
    this.editPopups.addInfo(editPopup);
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
    if (!this.isNestedForm) {
      this.commands.addCommand(this.formBaseImport.defaultCommands.getFormGoBackCommand(this));
      this.commands.addCommand(this.formBaseImport.defaultCommands.getFormSaveCommand(this));
      this.commands.addCommand(this.formBaseImport.defaultCommands.getFormDeleteCommand(this));
    }

    if (this.isEditForm) {
      this.commands.addCommand(this.formBaseImport.defaultCommands.getCloseCommand(() => {
        const index = this.owningView.bindingContext.popupStack.length - 1;
        const current: DevExpress.ui.dxPopup = this.owningView.bindingContext.popupStack[index];
        current.hide();
      }));
    }
  }
}
