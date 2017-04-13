import * as Interfaces from "../interfaces/export";
import {
  bindable,
  BindingEngine,
  Expression,
  Container,
  OverrideContext,
  Scope,
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
  ErrorService,
  GlobalizationService,
  LocalizationService
} from "../../base/export";
import {
  IFormAttachedEventArgs,
  IFormReadyEventArgs,
  IFormReactivatedEventArgs,
  IFormValidatingEventArgs
} from "../event-args/export";
import {
  FormBaseImport
} from "./form-base-import";
import {
  IPopupInfo
} from "../interfaces/export";
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
    this.error = formBaseImport.error;

    this.onAttached = formBaseImport.onAttached;
    this.onReady = formBaseImport.onReady;
    this.onReactivated = formBaseImport.onReactivated;
    this.onValidating = formBaseImport.onValidating;

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

  popupStack: IPopupInfo[];

  widgetCreator: WidgetCreatorService;
  command: CommandService;
  toolbar: ToolbarService;
  expressions: Expressions;
  globalization: GlobalizationService;
  localization: LocalizationService;
  error: ErrorService;

  models: Models;
  variables: Variables;
  nestedForms: NestedForms;
  editPopups: EditPopups;
  functions: Functions;
  commands: Commands;
  commandServerData: CommandServerData;

  onAttached: CustomEvent<IFormAttachedEventArgs>;
  onReady: CustomEvent<IFormReadyEventArgs>;
  onReactivated: CustomEvent<IFormReadyEventArgs>;
  onValidating: CustomEvent<IFormValidatingEventArgs>;

  scope: Scope;

  owningView: any;
  parent: FormBase;

  created(owningView: any, myView: any) {
    this.owningView = owningView;
    this.toolbarOptions = this.toolbar.createFormToolbarOptions(this);
  }
  attached() {
    const promise = this.onAttached.fire({
      form: this
    });

    this.formBaseImport.taskQueue.queueTask(() => {
      this.onReady.fire({
        form: this,
      });
    });

    return promise;
  }
  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.parent = this.owningView.bindingContext;

    this.scope = {
      bindingContext: bindingContext,
      overrideContext: overrideContext
    };
  }
  activate(routeInfo: any) {
    if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
      this.variables.data.$id = routeInfo.parameters.id;
    }
  }
  reactivate() {
    this.onReactivated.fire({
      form: this
    });
  }

  getFileDownloadUrl(key: string): string {
    return this.expressions.evaluateExpression(key);
  }
  getFormsInclOwn(): FormBase[] {
    return [this, ...this.nestedForms.getNestedForms()];
  }

  closeCurrentPopup() {
    if (this.popupStack.length > 0) {
      const index = this.popupStack.length - 1;
      const current = this.popupStack[index];
      current.popup.hide();
    } else {
      if (this.parent && this.parent.closeCurrentPopup) {
        this.parent.closeCurrentPopup();
      }
    }
  }

  executeCommand(id: string) {
    const context = this.getCurrentForm();

    if (context === this) {
      const command = this.commands
        .getCommands()
        .find(i => i.id == id);

      if (!command) {
        return;
      }

      this.command.execute(this.expressions, command);
    } else {
      context.executeCommand(id);
    }
  }

  validate(): Promise<any> {
    return this.onValidating.fire({
      form: this
    });
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

    return this.validate()
     .then(c => this.models.save());
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

    return this.models.delete();
  }

  translate(key: string): string {
    return this.localization.translate(this.scope, key);
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
  protected addNestedForm(id: string, mappings: Interfaces.IMapping[]): void {
    this.nestedForms.addInfo(id, mappings);
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

      if (this.isEditForm) {
        this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupSaveCommand(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupDeleteCommand(this));
      } else {
        this.commands.addCommand(this.formBaseImport.defaultCommands.getFormSaveCommand(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getFormDeleteCommand(this));
      }
    }

    if (this.isEditForm) {
      this.commands.addCommand(this.formBaseImport.defaultCommands.getClosePopupCommand(this));
    }
  }

  private getCurrentForm(): FormBase {
    if (this.popupStack.length === 0) {
      return this;
    }

    const index = this.popupStack.length - 1;
    const current = this.popupStack[index];

    const editPopup = this.editPopups.getInfo(current.id);
    if (!editPopup) {
      return this;
    }

    return this[editPopup.idContent];
  }
}
