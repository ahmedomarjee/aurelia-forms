import {
  BindingEngine,
  Expression,
  Container,
  TaskQueue,
  transient
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
  Expressions
} from "./expressions";
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
  CustomEvent,
  GlobalizationService,
  LocalizationService,
  ErrorService
} from "../../base/export";
import {
  RouterService
} from "../../stack-router/services/router-service";
import {
  IFormAttachedEventArgs,
  IFormReadyEventArgs,
  IFormReactivatedEventArgs
} from "../event-args/export";

@transient()
export class FormBaseImport {
  constructor(
    public bindingEngine: BindingEngine,
    public taskQueue: TaskQueue,
    public widgetCreator: WidgetCreatorService,
    public command: CommandService,
    public toolbar: ToolbarService,
    public router: RouterService,
    public error: ErrorService,
    public models: Models,
    public nestedForms: NestedForms,
    public variables: Variables,
    public functions: Functions,
    public commands: Commands,
    public expressions: Expressions,
    public globalization: GlobalizationService,
    public localization: LocalizationService,
    public commandServerData: CommandServerData,
    public onFormAttached: CustomEvent<IFormAttachedEventArgs>,
    public onFormReady: CustomEvent<IFormAttachedEventArgs>,
    public onFormReactivated: CustomEvent<IFormReadyEventArgs>
  ) { }
} 