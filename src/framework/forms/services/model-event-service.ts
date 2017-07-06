import {
  autoinject
} from "aurelia-framework";
import {
  CustomEvent
} from "../../base/export";
import {
  IModelLoadedEventArgs,
  IModelSavedEventArgs,
  IModelDeletedEventArgs
} from "../event-args/export";

@autoinject
export class ModelEventService {
  constructor(
    public onLoaded: CustomEvent<IModelLoadedEventArgs>,
    public onSaved: CustomEvent<IModelSavedEventArgs>,
    public onDeleted: CustomEvent<IModelDeletedEventArgs>
  ) {}
}