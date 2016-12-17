export class CommandServerDataInstance {
  add(id: string, data: any) {
    this[id] = data;
  }
}