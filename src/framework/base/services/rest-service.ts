import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  HttpClient
} from "aurelia-fetch-client";
import {
  CustomEvent
} from "../classes/custom-event";
import {
  IUnauthorizatedEventArgs
} from "../event-args/export";
import * as Interfaces from "../interfaces/export";
import Config from "../../../config";

@autoinject
export class RestService {
  constructor(
    public onUnauthorizated: CustomEvent<IUnauthorizatedEventArgs>
  ) { }

  loadingCount = 0;
  getAuthHeader: { (): any };

  @computedFrom("loadingCount")
  get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  delete(options: Interfaces.IRestDeleteOptions): Promise<any> {
    if (!options.id) {
      throw new Error("Id is missing");
    }

    return this.execute("DELETE", `${options.url}/${options.id}`, this.createHeaders(), options.increaseLoadingCount);
  }
  get(options: Interfaces.IRestGetOptions): Promise<any> {
    return this.execute("GET", options.url, this.createHeaders(options), options.increaseLoadingCount);
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

    return this.execute("POST", options.url, this.createHeaders(options), options.increaseLoadingCount, body);
  }
  put(options: Interfaces.IRestPostOptions): Promise<any> {
    let body = null;
    if (options.data) {
      if (typeof options.data === "string") {
        body = options.data;
      } else {
        body = JSON.stringify(options.data);
      }
    }

    return this.execute("PUT", options.url, this.createHeaders(options), options.increaseLoadingCount, body);
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

  private createHeaders(options?: Interfaces.IRestGetOptions) {
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
  private execute(method: string, url: string, headers: any, changeLoadingCount: boolean, body?: any): Promise<any> {
    const client = new HttpClient();

    if (changeLoadingCount) {
      this.loadingCount++;
    }

    return new Promise<any>((success: any, error) => {
      client
        .fetch(url, {
          method: method,
          headers: headers,
          body: body
        })
        .then(r => {
          if (r.ok) {
            //TODO - Datums konvertieren
            return r.json();
          }
          if (r.status == 401) {
            this.onUnauthorizated.fire({
              url: url
            });
            return;
          }

          DevExpress.ui.notify(r.statusText, "error", 3000);
          error(r);
        })
        .then(r => success(r))
        .catch(r => {
          error(r);
        })
        .then(() => {
          if (changeLoadingCount) {
            this.loadingCount--;
          }
        });
    });
  }
}