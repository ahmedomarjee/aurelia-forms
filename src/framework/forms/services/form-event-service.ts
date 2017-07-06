import {
  autoinject
} from "aurelia-framework";
import {
  CustomEvent
} from "../../base/export";
import {
  IFormAttachedEventArgs,
  IFormCreatedEventArgs,
  IFormBindEventArgs,
  IFormReadyEventArgs,
  IFormReactivatedEventArgs,
  IFormValidatingEventArgs,
  IFormExecuteCommandEventArgs
} from "../event-args/export";

@autoinject
export class FormEventService {
  constructor(
    public onCreated: CustomEvent<IFormCreatedEventArgs>,
    public onBind: CustomEvent<IFormBindEventArgs>,
    public onAttached: CustomEvent<IFormAttachedEventArgs>,
    public onReady: CustomEvent<IFormReadyEventArgs>,
    public onReactivating: CustomEvent<IFormReactivatedEventArgs>,
    public onValidating: CustomEvent<IFormValidatingEventArgs>,
    public onExecuteCommand: CustomEvent<IFormExecuteCommandEventArgs>
  ) {}
}