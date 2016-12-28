import {
  autoinject,
  transient,
  TaskQueue
} from "aurelia-framework";
import {
  ICustomEventArgs
} from "../event-args/custom-event-args";
import {
  ObjectInfoService
} from "../services/object-info-service";

@autoinject
@transient()
export class CustomEvent<T extends ICustomEventArgs> {
  private delegates: { (args: T): Promise<any> }[] = [];
  private argsQueue = [];
  private timeoutCancel: any;

  constructor(
    private objectInfo: ObjectInfoService,
    private taskQueue: TaskQueue) {}

  waitTimeout = 0;

  register(action: { (args: T): Promise<any> }): { (): void } {
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
    if (this.waitTimeout === 0) {
      return Promise.all(this.delegates.map(item => item(args)));
    } else {
      if (this.timeoutCancel) {
        clearTimeout(this.timeoutCancel);
        this.timeoutCancel = null;
      }

      for (let item of this.argsQueue) {
        if (this.objectInfo.equal(item, args)) {
          return;
        }
      }

      this.argsQueue.push(args);
      this.timeoutCancel = setTimeout(this.fireQueue.bind(this), this.waitTimeout);
    }
  }

  private async fireQueue() {
    const argsQueue = this.argsQueue.slice(0);
    this.argsQueue.splice(0, this.argsQueue.length);

    argsQueue.forEach(args => {
      this.taskQueue.queueTask(() => {
        return Promise.all(this.delegates.map(item => item(args)));
      });
    });
  }
}