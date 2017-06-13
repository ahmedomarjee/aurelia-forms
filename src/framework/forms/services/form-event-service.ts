import {
  autoinject
} from "aurelia-framework";
import {
  CustomEvent
} from "../../base/export";
import {
  IFormAttachedEventArgs,
  IFormCreatedEventArgs,
  IFormReadyEventArgs,
  IFormReactivatedEventArgs,
  IFormValidatingEventArgs
} from "../event-args/export";

@autoinject
export class FormEventService {
  constructor(
    public onCreated: CustomEvent<IFormCreatedEventArgs>,
    public onAttached: CustomEvent<IFormAttachedEventArgs>,
    public onReady: CustomEvent<IFormReadyEventArgs>,
    public onReactivating: CustomEvent<IFormReactivatedEventArgs>,
    public onValidating: CustomEvent<IFormValidatingEventArgs>
  ) {}
}