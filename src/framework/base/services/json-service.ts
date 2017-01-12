import {
  autoinject
} from "aurelia-framework";

@autoinject
export class JsonService {
  private regexDateISO = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;

  constructor() { }

  parse(json: string): any {
    if (!json) {
      return json;
    }

    if (!(typeof json === "string")) {
      json = JSON.stringify(json);
    }

    return JSON.parse(json, (key: string, value: string): any => {
      if (typeof value === "string" && value.indexOf("{") < 0) {
        var a: any = this.regexDateISO.exec(value);

        if (a) {
          return new Date(value);
        }

        return value;
      }
      return value;
    });
  }
  stringify(obj: any): string {
    return JSON.stringify(obj);
  }
}