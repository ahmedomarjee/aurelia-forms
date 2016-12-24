import Config from "../../config";
import {
  IRestLoadOptions
} from "../interfaces/rest-load-options";
import {
  HttpClient
} from "aurelia-fetch-client";

export class RestService {
  get(options: IRestLoadOptions): Promise<any> {
    const client = new HttpClient();
    
    const headers: any = {};
    headers["X-TIP-API-KEY"] = "61da30dc-46cc-45e6-b9a6-c6cfa65d65af";
    
    if (options.getOptions) {
      headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
    }

    return new Promise<any>((success: any, error) => {
      client
        .fetch(this.getUrl(options.url), {
          headers
        })
        .then(r => r.json())
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