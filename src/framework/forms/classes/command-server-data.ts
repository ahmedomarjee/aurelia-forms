import {
  autoinject,
  singleton
} from "aurelia-framework";

@autoinject
@singleton(true)
export class CommandServerData {
  constructor() {}

  add(id: string, data: any) {
    this[id] = data;
  }
}