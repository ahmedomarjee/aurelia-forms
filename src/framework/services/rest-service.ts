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

    return new Promise<any>((success: any, error) => {
      client
        .fetch(this.getUrl(options.url))
        .then(r => r.json())
        .catch(r => {
          error(r);
        })
    });
  }

  private getUrl(suffix: string): string {
    return `${Config.baseUrl}/${suffix}`;
  }
}