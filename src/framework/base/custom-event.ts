import {
  ICustomEventArgs
} from "../event-args/custom-event-args";

export class CustomEvent<T extends ICustomEventArgs> {
  private delegates: {(args: T): Promise<any>}[] = [];

  constructor() {
  }

  register(action: {(args: T): Promise<any>}): {(): void} {
    this.delegates.push(action);

    return () => {
      const indexOf = this.delegates.indexOf(action);
      if (indexOf < 0) {
        return;
      }

      this.delegates.splice(indexOf, 1);
    }
  }
  fire(args: T): Promise<any> {
    return Promise.all(this.delegates.map(item => item(args)));
  }
}