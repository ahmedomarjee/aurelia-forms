import {
  Disposable,
  Scope
} from "aurelia-framework";

export class ScopeContainer {
  private _disposables: Disposable[];

  constructor(
    public scope: Scope,
    private parentScopeContainer?: ScopeContainer
  ) {
    if (parentScopeContainer) {
      this._disposables = parentScopeContainer._disposables;
    } else {
      this._disposables = [];
    }
  }

  addDisposable(disposable: Disposable) {
    this._disposables.push(disposable);
  }
  disposeAll() {
    if (this.parentScopeContainer) {
      this._disposables = [];
    } else {
      this._disposables.forEach(c => {
        c.dispose();
      })
      this._disposables.length = 0;
    }
  }
}