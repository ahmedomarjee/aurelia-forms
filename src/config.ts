import {
  PLATFORM
} from "aurelia-framework";

export default {
  baseUrl: "http://10.20.50.53/TIP.ERP",
  apiUrl: "http://10.20.50.53/TIP.ERP/api",
  webApiUrl: "http://10.20.50.53/TIP.ERP/api/data",
  appUrl: "http://localhost:9000",

  loginApp: PLATFORM.moduleName("framework/login/login"),
  mainApp: PLATFORM.moduleName("app")
}