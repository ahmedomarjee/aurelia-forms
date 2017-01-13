import {
  autoinject
} from "aurelia-framework";

@autoinject
export class PermissionService {
  canWebApiNew(webApiAction: string): boolean {
    return true;
  }
  canWebApiModify(webApiAction: string): boolean {
    return true;
  }
  canWebApiDelete(webApiAction: string): boolean {
    return true;
  }
}