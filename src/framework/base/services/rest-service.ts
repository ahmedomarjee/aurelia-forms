import {
  HttpClient
} from "aurelia-fetch-client";
import * as Interfaces from "../interfaces/export";
import Config from "../../../config";

export class RestService {
  getAuthHeader: {(): any};

  get(options: Interfaces.IRestGetOptions): Promise<any> {
    return this.execute("GET", options);
  }
  post(options: Interfaces.IRestPostOptions): Promise<any> {
    let body = null;
    if (options.data) {
      if (typeof options.data === "string") {
        body = options.data;
      } else {
        body = JSON.stringify(options.data);
      }
    }

    return this.execute("POST", options, body);
  }  

  getUrl(suffix: string): string {
    return `${Config.baseUrl}/${suffix}`;
  }
  getApiUrl(suffix: string): string {
    return `${Config.apiUrl}/${suffix}`;
  }
  getWebApiUrl(suffix: string): string {
    return `${Config.webApiUrl}/${suffix}`;
  }

  private createHeader(options: Interfaces.IRestGetOptions) {
    const headers: any = {};
    
    if (options.getOptions) {
      headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
    }

    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";

    if (this.getAuthHeader) {
      Object.assign(headers, this.getAuthHeader());
    }

    return headers;
  }
  private execute(method: string, options: Interfaces.IRestGetOptions, body?: any): Promise<any> {
    const client = new HttpClient();

    const headers = this.createHeader(options);
    
    return new Promise<any>((success: any, error) => {
      client
        .fetch(options.url, {
          method: method,
          headers: headers,
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
}