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
  IFormReadyEventArgs
} from "../event-args/export";

@transient()
export class FormBaseImport {
  constructor(
    public bindingEngine: BindingEngine,
    public taskQueue: TaskQueue,
    public widgetCreator: WidgetCreatorService,
    public command: CommandService,
    public toolbar: ToolbarService,
    public models: Models,
    public nestedForms: NestedForms,
    public variables: Variables,
    public functions: Functions,
    public commands: Commands,
    public commandServerData: CommandServerData,
    public onFormAttached: CustomEvent<IFormAttachedEventArgs>,
    public onFormReady: CustomEvent<IFormAttachedEventArgs>,
  ) { }
} 