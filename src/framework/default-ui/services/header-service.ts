import {
  autoinject
} from "aurelia-framework";
import {
  CustomEvent
} from "../../base/export";
import {
  ISearchEventArgs
} from "../event-args/export"

@autoinject
export class HeaderService {
  constructor(
    public onSearch: CustomEvent<ISearchEventArgs>
  ) {}

  logoUrl: string;
  text: string;
}