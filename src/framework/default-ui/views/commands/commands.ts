import {
  autoinject,
  OverrideContext,
  TaskQueue
} from "aurelia-framework";
import {
  SimpleWidgetCreatorService
} from "../../../forms/widget-services/simple-widget-creator-service";
import {
  CommandService,
  FormEventService
} from "../../../forms/services/export";
import {
  ScopeContainer,
  LocalizationService
} from "../../../base/export";
import {
  ICommandData,
  FormBase,
  GlobalCommandService,
  IQueryGlobalCommandEventArgs
} from "../../../forms/export";
import {
  INavigationRoute,
  HistoryService,
  RouterService
} from "../../../stack-router/export";

@autoinject
export class Commands {
  private _currentCommands: ICommandData[];
  private _navigationCommands: ICommandData[];
  private _currentForm: FormBase;

  constructor(
    private simpleWidgetCreator: SimpleWidgetCreatorService,
    private formEvent: FormEventService,
    private localization: LocalizationService,
    private command: CommandService,
    private taskQueue: TaskQueue,
    private globalCommand: GlobalCommandService,
    private router: RouterService,
    private history: HistoryService
  ) {
    this.formEvent.onExecuteCommand.register(r => {
      this._currentForm = r.form;
      this.openCommands(r.commands, r.allowGlobalCommands);

      return Promise.resolve();
    });
  }

  scopeContainer: ScopeContainer;

  commandPopup: any;
  commandPopupOptions: DevExpress.ui.dxPopupOptions = {
    width: "400px",
    height: "150px",
    onHidden: (e) => {
      this._currentCommands = null;
      this._currentForm = null;
    },
    onShown: (e) => {
      this.commandSelectBox.instance.option("value", null);
      this.commandSelectBox.instance.focus();
    }
  };
  commandSelectBox: any;
  commandSelectBoxOptions: DevExpress.ui.dxSelectBoxOptions = {
    valueExpr: "id",
    displayExpr: "name",
    searchEnabled: true,
    searchTimeout: 50,
    onKeyPress: (e) => {
      if (e.jQueryEvent.keyCode !== 13) {
        return;
      }

      this.executeCurrentCommand();
    }
  }

  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.scopeContainer = new ScopeContainer({
      bindingContext: this,
      overrideContext: null
    });

    this.simpleWidgetCreator.updatePopupOptions({
      caption: "default_ui.execute_command",
      options: this.commandPopupOptions,
      scopeContainer: this.scopeContainer,
      commands: [{
        id: "$executeCommand",
        icon: "check",
        location: "after",
        execute: () => {
          this.taskQueue.queueTask(() => {
            this.executeCurrentCommand();
          });
        }
      }]
    });
  }
  unbind() {
    this.scopeContainer.disposeAll();
  }

  private openCommands(commands: ICommandData[], allowGlobalCommands: boolean) {
    this._currentCommands = [...commands];

    let promise: Promise<any>;

    if (allowGlobalCommands) {
      this.addNavigationRoutes();

      const globalCommandArgs: IQueryGlobalCommandEventArgs = {
        commands: []
      };

      promise = this.globalCommand
        .onQueryGlobalCommand.fire(globalCommandArgs)
        .then(() => {
          this._currentCommands.push(...globalCommandArgs.commands)
        });
    } else {
      promise = Promise.resolve();
    }

    promise.then(() => {
      const dataSource = this._currentCommands
        .map(c => {
          return {
            id: c.id,
            name: this.localization.translate(null, c.title) || this.localization.translate(null, c.tooltip)
          }
        });

      if (this.commandSelectBox && this.commandSelectBox.instance) {
        this.commandSelectBox.instance.option("dataSource", dataSource);
      } else {
        this.commandSelectBoxOptions.dataSource = dataSource;
      }
      
      this.commandPopup.instance.show();
    });
  }
  private executeCurrentCommand() {
    const currCommand = this.commandSelectBox.instance.option("value");
    if (!currCommand) {
      DevExpress.ui.notify(
        this.localization.translate(null, "default_ui.choose_command"),
        "error",
        3000
      );
      return;
    }

    const command = this._currentCommands.find(c => c.id === currCommand);
    if (!command) {
      return;
    }

    this.command.execute(this._currentForm.scope, command, {
      event: null
    });

    this.commandPopup.instance.hide();
  }
  private addNavigationRoutes() {
    if (!this._navigationCommands) {
      this._navigationCommands = [];

      for (let nav1 of this.router.navigationRoutes) {
        if (nav1.route) {
          this.pushRoute(nav1);
        }

        if (nav1.children) {
          for (let nav2 of nav1.children) {
            if (nav2.route) {
              this.pushRoute(nav2);
            }
          }
        }
      }
    }

    this._currentCommands.push(...this._navigationCommands);
  }
  private pushRoute(route: INavigationRoute) {
    this._navigationCommands.push({
      id: `$navigation_${route.route}`,
      title: route.caption,
      isEnabled: true,
      isVisible: true,
      execute: (e) => {
        this.history.navigateByCode(
          route.route,
          true);
      }
    })
  }
}