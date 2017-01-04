import {
  ICustomEventArgs
} from "./custom-event-args";

export interface IUnauthorizatedEventArgs extends ICustomEventArgs {
  url: string;
}