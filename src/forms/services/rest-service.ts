import Config from "../../config";
import * as Interfaces from "../interfaces";
import {
  HttpClient
} from "aurelia-fetch-client";

export class RestService {
  get(options: Interfaces.IRestGetOptions): Promise<any> {
    const client = new HttpClient();
    
    const headers: any = {};
    headers["X-TIP-API-KEY"] = "61da30dc-46cc-45e6-b9a6-c6cfa65d65af";
    
    if (options.getOptions) {
      headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
    }

    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";

    return new Promise<any>((success: any, error) => {
      client
        .fetch(this.getUrl(options.url), {
          headers
        })
        .then(r => {
          if (r.ok) {
            return r.json();
          }

          DevExpress.ui.notify(r.statusText, "error", 3000);
          error(r);
        })
        .then(r => success(r))
        .catch(r => {
          error(r);
        })
    });
  }
  post(options: Interfaces.IRestPostOptions): Promise<any> {
    const client = new HttpClient();
    
    const headers: any = {};
    headers["X-TIP-API-KEY"] = "61da30dc-46cc-45e6-b9a6-c6cfa65d65af";
    
    if (options.getOptions) {
      headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
    }

    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";

    let body = null;
    if (options.data) {
      if (typeof options.data === "string") {
        body = options.data;
      } else {
        body = JSON.stringify(options.data);
      }
    }

    return new Promise<any>((success: any, error) => {
      client
        .fetch(this.getUrl(options.url), {
          headers,
          method: "POST",
          body: body
        })
        .then(r => {
          if (r.ok) {
            return r.json();
          }

          DevExpress.ui.notify(r.statusText, "error", 3000);
          error(r);
        })
        .then(r => success(r))
        .catch(r => {
          error(r);
        })
    });
  }

  private getUrl(suffix: string): string {
    return `${Config.baseUrl}/${suffix}`;
  }
}