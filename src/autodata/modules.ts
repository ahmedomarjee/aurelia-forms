import {PLATFORM} from "aurelia-framework";
export class ModuleLoader {
constructor() {
PLATFORM.moduleName("../framework/login/views/login/login-form");
PLATFORM.moduleName("../framework/security/views/authgroup/authgroup-edit-form");
PLATFORM.moduleName("../framework/security/views/authgroup/authgroup-list-form");
}
}
