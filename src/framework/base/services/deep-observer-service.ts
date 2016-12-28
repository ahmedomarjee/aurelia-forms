import {
  autoinject,
  BindingEngine,
  PropertyObserver,
  CollectionObserver,
  Disposable
} from "aurelia-framework";

@autoinject
export class DeepObserverService {
  constructor(private bindingEngine: BindingEngine) {
  }

  observe(target: any, callback: {(): void}): {(): void} {
    const subscription = new Subscription();

    this.__observe(subscription, target, callback);

    return () => {
      subscription.dispose();
    }
  }

  private __observe(subscription: Subscription, target: any, callback: {(): void}): void {
    if (target == null) {
      return;
    } else if (target instanceof Date) {
      return;
    } else if (Array.isArray(target)) {
      this.__observeArray(subscription, target, callback);
    } else if (typeof target === "object") {
      this.__observeObject(subscription, target, callback);
    }
  }
  private __observeArray(subscription: Subscription, target: any, callback: {(): void}): void {
    const newSubscription = subscription.createChildSubscription(target);

    const observer = this.bindingEngine.collectionObserver(
      target
    ).subscribe((e) => {
      for (const change of e) {
        if (change.addedCount > 0) {
          for (let i = change.index; i < change.addedCount; i++) {
            this.__observe(newSubscription, target[i], callback);
          }
        }
        if (change.removed.length > 0) {
          for (const item of change.removed) {
            newSubscription.remove(item);
          }
        }
      }

      callback();
    });

    for (const item of target) {
      this.__observe(newSubscription, item, callback);
    }
  }
  private __observeObject(subscription: Subscription, target: any, callback: {(): void}): void {
    const newSubscription = subscription.createChildSubscription(target);

    for (const property in target) {
      if (target.hasOwnProperty(property)) {
        const observer = this.bindingEngine.propertyObserver(
          target,
          property
        ).subscribe((newValue, oldValue) => {
          newSubscription.remove(oldValue);
          this.__observe(newSubscription, newValue, callback);

          callback();
        });

        newSubscription.addObserver(observer);

        this.__observe(newSubscription, target[property], callback);
      }
    }
  }
}

class Subscription {
  constructor() {
  }

  observers: Disposable[] = [];
  children = new Map();

  createChildSubscription(child: any) {
    const newSubscription = new Subscription();
    this.children.set(child, newSubscription);

    return newSubscription;
  }
  addObserver(observer: Disposable) {
    this.observers.push(observer);
  }
  remove(child: any) {
    const subscription = this.children.get(child);

    if (!subscription) {
      return;
    }

    subscription.dispose();
    this.children.delete(child);
  }
  dispose() {
    this.observers.forEach(item => {
      item.dispose();
    });
    this.children.forEach(item => {
      item.dispose();
    })

    this.observers = [];
  }
}
