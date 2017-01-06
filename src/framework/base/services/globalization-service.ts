import * as moment from "moment";
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class GlobalizationService {
  private groupRegex = /\B(?=(\d{3})+(?!\d))/g;
  private escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
  private current: IGlobalizationProvider = new GermanGlobalizationProvider();
  private formatters = {};
  private parsers = {};

  constructor() { }

  setProvider(provider: IGlobalizationProvider) {
    this.current = provider;
    this.formatters = {};
    this.parsers = {};
  }

  format(value: any, format: string) {
    return this.getFormatter(format)(value);
  }
  getFormatter(format: string) {
    let formatter = this.formatters[format];

    if (formatter == void (0)) {
      formatter = (value: any) => {
        if (value == void (0)) {
          return null;
        }

        if (format.length === 1) {
          return moment(value).locale(this.current.culture).format(format, );
        } else {
          const count = parseInt(format.substr(1));
          const formatClass = format.substr(0, 1);

          if (formatClass === "p") {
            value = value * 100;
          }

          let a = value % 1;
          let b = value - a;
          a = Math.round(a * Math.pow(10, count));

          if (a === 1) {
            b += 1;
            a = 0;
          }

          switch (formatClass) {
            case "n": {
              return `${this.addGroupSeparator(b)}${this.addDecimalSeparator(a, count)}`;
            }
            case "f": {
              return `${b}${this.addDecimalSeparator(a, count)}`;
            }
            case "p": {
              return `${this.addGroupSeparator(b)}${this.addDecimalSeparator(a, count)} %`;
            }
            default: {
              throw new Error(`Not implemented format ${format}`);
            }
          }
        }
      };

      this.formatters[format] = formatter;
    }

    return formatter;
  }
  getParser(format: string) {
    let parser = this.parsers[format];

    if (parser == void (0)) {
      parser = (value: string) => {
        if (value == void (0)) {
          return null;
        }

        if (format.length === 1) {
          return moment(value, format, this.current.culture);
        } else {
          const groupFinder = this.current.groupSeparator.replace(this.escapeRegex, "\\$&");
          value = value
            .replace(new RegExp(groupFinder, "g"), "")
            .replace(new RegExp("%", "g"), "")
            .replace(new RegExp(" ", "g"), "");

          const indexOf = value.indexOf(this.current.commaSeparator);

          let b = value;
          let a = "";
          if (indexOf >= 0) {
            b = value.substr(0, indexOf);
            a = value.substr(indexOf + 1);
          }

          const count = parseInt(format.substr(1));
          const formatClass = format.substr(0, 1);

          switch (formatClass) {
            case "f":
            case "n": {
              return parseInt(b) + this.makeComma(a);
            }
            case "p": {
              return (parseInt(b) + this.makeComma(a)) / 100;
            }
            default: {
              throw new Error(`Not implemented format ${format}`);
            }
          }
        }
      };

      this.parsers[format] = parser;
    }

    return parser;
  }
  getFormatterParser(format: string): any {
    return {
      formatter: this.getFormatter(format),
      parser: this.getParser(format)
    };
  }

  private addGroupSeparator(value: any) {
    return value.toString().replace(this.groupRegex, this.current.groupSeparator);
  }
  private addDecimalSeparator(value: any, count: number) {
    let r = "";

    if (count > 0) {
      r += this.current.commaSeparator;
      let c = value.toString();

      while (c.length < count) {
        c += "0";
      }
      r += c;
    }

    return r;
  }
  private makeComma(value: string) {
    return parseInt(value) / Math.pow(10, value.length);
  }
}

export interface IGlobalizationProvider {
  culture: string;

  d: string;
  D: string;
  f: string;
  F: string;
  g: string;
  G: string;
  t: string;
  T: string;

  commaSeparator: string;
  groupSeparator: string
}
export class GermanGlobalizationProvider implements IGlobalizationProvider {
  culture = "de";

  d = "DD.MM.YYYY";
  D = "dddd, DD. MMM YYYY";
  f = "dddd, DD. MMM YYYY, HH:mm";
  F = "dddd, DD. MMM yyyy, HH:mm:ss";
  g = "DD.MM.YYYY HH:mm";
  G = "DD.MM.YYYY HH:mm:ss";
  t = "HH:mm";
  T = "HH:mm:ss"

  commaSeparator = ",";
  groupSeparator = " ";
}