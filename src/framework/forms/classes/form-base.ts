import * as Interfaces from "../interfaces/export";
import {
  bindable,
  createOverrideContext,
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
  BindingService,
  CustomEvent,
  ErrorService,
  GlobalizationService,
  LocalizationService,
  ScopeContainer
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
  ICommandExecuteOptions,
  IPopupInfo,
  IValidationResult
} from "../interfaces/export";
import {
  IViewScrollInfo
} from "../../base/interfaces/export";
import {
  IViewItemModel
} from "../../stack-router/interfaces/export";

export class FormBase {
  private _callOnBind: { (): void }[];

  constructor(
    private element: Element,
    private formBaseImport: FormBaseImport
  ) {
    this._callOnBind = [];

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
    this.commands = formBaseImport.commands;
    this.binding = formBaseImport.binding;
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
    this.nestedForms.registerForm(this);
    this.editPopups.registerForm(this);
  }

  toolbarOptions: DevExpress.ui.dxToolbarOptions;
  id: string;
  title: string;
  viewScrollInfo: IViewScrollInfo;

  isEditForm: boolean;
  isNestedForm: boolean;

  popupStack: IPopupInfo[];

  widgetCreator: WidgetCreatorService;
  command: CommandService;
  toolbar: ToolbarService;
  binding: BindingService;
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
  scopeContainer: ScopeContainer;

  owningView: any;
  parent: FormBase;

  callOnBind(callback: { (): void }) {
    this._callOnBind.push(callback);
  }

  activate(viewItemInfo: IViewItemModel) {
    this.viewScrollInfo = viewItemInfo && viewItemInfo.viewScrollInfo
      ? viewItemInfo.viewScrollInfo
      : null;

    if (viewItemInfo && viewItemInfo.routeInfo && viewItemInfo.routeInfo.parameters && viewItemInfo.routeInfo.parameters.id) {
      this.variables.data.$id = viewItemInfo.routeInfo.parameters.id;
    }
  }
  created(owningView: any, myView: any) {
    this.owningView = owningView;
  }
  attached() {
    const args = {
      form: this
    };
    const promise = this.onAttached
      .fire(args)
      .then(() => this.formBaseImport.formEvent.onAttached.fire(args));

    this.formBaseImport.taskQueue.queueTask(() => {
      this.onReady
        .fire(args)
        .then(() => this.formBaseImport.formEvent.onReady.fire(args));
    });

    return promise;
  }
  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.parent = this.owningView.bindingContext;

    this.scope = {
      bindingContext: this,
      overrideContext: createOverrideContext(this)
    };
    this.scopeContainer = new ScopeContainer(this.scope);

    this._callOnBind.forEach(c => {
      c();
    })

    this._callOnBind = null;
    this.formBaseImport.formEvent.onBind.fire({
      form: this
    });

    this.loadCommands();
    this.toolbarOptions = this.toolbar.createFormToolbarOptions(this);
    this.models.loadModelsWithKey();
  }
  unbind() {
    this.scopeContainer.disposeAll();
  }
  reactivate() {
    const args = {
      form: this
    };

    this.onReactivated
      .fire(args)
      .then(() => this.formBaseImport.formEvent.onReactivating.fire(args));
  }

  getFileDownloadUrl(key: string): string {
    return this.binding.evaluate(this.scope, key);
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

  executeCommand(id: string, options?: ICommandExecuteOptions) {
    const context = this.getCurrentForm();

    if (context == null) {
      return;
    } else if (context === this) {
      if (id === "$command") {
        if (this.formBaseImport.globalPopup.isIndependentPopupOpen()) {
          return;
        }

        const commands = this.commands
          .getCommands()
          .filter(c => 
            this.formBaseImport.command.isVisibleAndEnabled(this.scope, c));

        this.formBaseImport.formEvent.onExecuteCommand.fire({
          form: this,
          commands: commands,
          allowGlobalCommands: !this.isEditForm
        });
      } else {
        const command = this.commands
          .getCommands()
          .find(i => i.id == id);

        if (!command) {
          return;
        }

        this.command.execute(this.scope, command, options);
      }
    } else {
      context.executeCommand(id);
    }
  }

  validate(validationResult: IValidationResult): Promise<any> {
    const args: IFormValidatingEventArgs = {
      form: this,
      validationResult: validationResult
    }

    return this.onValidating.fire(args)
      .then(() => this.formBaseImport.formEvent.onValidating.fire(args))
      .then(() => {
        const forms = this.nestedForms.getNestedForms();

        let promise = Promise.resolve();
        for (let form of forms) {
          promise = form.validate(validationResult);
        }

        return promise;
      });
  }

  canAdd(): boolean {
    const mainModel = this.models.getModelWithKeyId();
    if (!mainModel) {
      return false;
    }

    if (!this.formBaseImport.permission.canWebApiNew(mainModel.webApiAction)) {
      return false;
    }

    if (!this.models.allowNew(this.scopeContainer, mainModel)) {
      return false;
    }

    return true;
  }
  add(): Promise<any> {
    if (!this.canAdd()) {
      return Promise.resolve();
    }

    return this.loadById("0");
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
        if (!this.models.allowSave(this.scopeContainer, m)) {
          return false;
        }

        return true;
      }));
  }
  save(): Promise<IValidationResult> {
    const validationResult: IValidationResult = {
      isValid: true,
      messages: []
    };

    if (!this.canSave() || !this.canSaveNow()) {
      validationResult.isValid = false;
      return Promise.resolve(validationResult);
    }

    return this.validate(validationResult)
      .then(() => {
        if (validationResult.isValid) {
          return this.models
            .save()
            .then(() => {
              DevExpress.ui.notify(
                this.translate("base.save_success"),
                "SUCCESS",
                3000);

              this.setCurrentUrl();

              return Promise.resolve(validationResult);
            });
        } else {
          DevExpress.ui.notify(
            validationResult.messages.length > 0
              ? validationResult.messages[0]
              : this.translate("base.validation_error"),
            "ERROR",
            3000);

          return Promise.resolve(validationResult);
        }
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
        if (!this.models.allowDelete(this.scopeContainer, m)) {
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
    return this.localization.translate(this.scopeContainer, key);
  }

  loadById(id: string): Promise<any> {
    this.setCurrentUrl(id);

    this.variables.data.$id = id;
    return this.models.loadModelsWithKey();
  }

  protected addModel(model: Interfaces.IModel): void {
    this.callOnBind(() => {
      this.models.addInfo(model);
    });
  }
  protected addVariable(variable: Interfaces.IVariable): void {
    this.callOnBind(() => {
      this.variables.addInfo(variable);
    });
  }
  protected addCommandServerData(id: string, commandServerData: Interfaces.ICommandData): void {
    this.callOnBind(() => {
      this.commandServerData.add(id, commandServerData);
    });
  }
  protected addCommand(command: Interfaces.ICommand): void {
    this.callOnBind(() => {
      this.commands.addInfo(command);
    });
  }
  protected addFunction(id: string, functionInstance: any, namespace: string, customParameter?: any): void {
    this.callOnBind(() => {
      this.functions.add(id, functionInstance, namespace, customParameter);
    });
  }
  protected addNestedForm(id: string, mappings: Interfaces.IMapping[]): void {
    this.callOnBind(() => {
      this.nestedForms.addInfo(id, mappings);
    });
  }
  protected addEditPopup(editPopup: Interfaces.IEditPopup): void {
    this.callOnBind(() => {
      this.editPopups.addInfo(editPopup);
    });
  }
  protected addMapping(mapping: Interfaces.IMapping): void {
  }
  protected submitForm(commandExpression: string, options?: ICommandExecuteOptions): void {
    const command: Interfaces.ICommandData = this.binding.evaluate(this.scope, commandExpression);
    if (!command || !command.execute) {
      return;
    }

    this.command.execute(this.scope, command, options);
  }
  protected onConstructionFinished(): void {
    this.formBaseImport.formEvent.onCreated.fire({
      form: this
    });
  }

  private loadCommands() {
    if (!this.isNestedForm) {
      this.commands.addCommand(this.formBaseImport.defaultCommands.getFormGoBackCommand(this));

      if (this.isEditForm) {
        this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupSaveCommand(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupSaveAndAddCommand(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupDeleteCommand(this));

        this.commands.addCommand(this.formBaseImport.defaultCommands.getScrollDown(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getScrollUp(this));
      } else {
        this.commands.addCommand(this.formBaseImport.defaultCommands.getFormAddCommand(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getFormSaveCommand(this));
        this.commands.addCommand(this.formBaseImport.defaultCommands.getFormDeleteCommand(this));

        if (this.viewScrollInfo) {
          this.commands.addCommand(this.formBaseImport.defaultCommands.getScrollDown(this));
          this.commands.addCommand(this.formBaseImport.defaultCommands.getScrollUp(this));
        }
      }
    }

    if (this.isEditForm) {
      this.commands.addCommand(this.formBaseImport.defaultCommands.getClosePopupCommand(this));
    }
  }
  private getCurrentForm(): FormBase {
    if (this.formBaseImport.globalPopup.isIndependentPopupOpen()) {
      return null;
    }

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
  private setCurrentUrl(id: string = null): void {
    if (this.isEditForm || this.isNestedForm) {
      return;
    }

    if (id == void (0)) {
      const mainModel = this.models.getModelWithKeyId();
      if (!mainModel) {
        return;
      }

      const data = this.models.data[mainModel.id];
      if (!data) {
        return;
      }

      const key = data[mainModel.keyProperty];
      if (key == void (0)) {
        return;
      }

      id = key;
    }

    const currentUrl = this.formBaseImport.history.getUrl();
    const currentRoute = this.formBaseImport.router.getRoute(currentUrl);

    if (!currentRoute) {
      return;
    }

    const newUrl = this.formBaseImport.router.constructUrl(currentRoute.route, {
      id: id
    });

    this.formBaseImport.history.setUrlWithoutNavigation(newUrl, true);
  }
}
