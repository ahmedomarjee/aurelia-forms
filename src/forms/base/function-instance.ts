
export class FunctionInstance {
  add(id: string, functionInstance: any) {
    this[id] = functionInstance;
  }
}