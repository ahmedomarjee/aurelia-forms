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
  EditPopups
} from "./edit-popups";
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
  DefaultCommandsService
} from "../services/default-commands-service";
import {
  CommandService
} from "../services/command-service";
import {
  FormEventService
} from "../services/form-event-service";
import {
  WidgetCreatorService
} from "../widget-services/widget-creator-service";
import {
  BindingService,
  CustomEvent,
  GlobalizationService,
  LocalizationService,
  ErrorService
} from "../../base/export";
import {
  RouterService,
  HistoryService
} from "../../stack-router/services/export";
import {
  IFormAttachedEventArgs,
  IFormReadyEventArgs,
  IFormReactivatedEventArgs,
  IFormValidatingEventArgs
} from "../event-args/export";

@transient()
export class FormBaseImport {
  constructor(
    public bindingEngine: BindingEngine,
    public taskQueue: TaskQueue,
    public widgetCreator: WidgetCreatorService,
    public command: CommandService,
    public toolbar: ToolbarService,
    public defaultCommands: DefaultCommandsService,
    public router: RouterService,
    public history: HistoryService,
    public error: ErrorService,
    public models: Models,
    public nestedForms: NestedForms,
    public variables: Variables,
    public functions: Functions,
    public commands: Commands,
    public editPopups: EditPopups,
    public binding: BindingService,
    public globalization: GlobalizationService,
    public localization: LocalizationService,
    public commandServerData: CommandServerData,
    public formEvent: FormEventService,
    public onAttached: CustomEvent<IFormAttachedEventArgs>,
    public onReady: CustomEvent<IFormAttachedEventArgs>,
    public onReactivated: CustomEvent<IFormReadyEventArgs>,
    public onValidating: CustomEvent<IFormValidatingEventArgs>
  ) { }
} 