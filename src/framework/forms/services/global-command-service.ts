import {
  autoinject
} from "aurelia-framework";
import {
  CustomEvent
} from "../../base/export";
import {
  IQueryGlobalCommandEventArgs
} from "../event-args/export";

@autoinject
export class GlobalCommandService {
  constructor(
    public onQueryGlobalCommand: CustomEvent<IQueryGlobalCommandEventArgs>
  ) {}
}