import { createSignalObject, creator } from './helper';

export const creatorUser = creator(async () => {
  let ins = new (await import('./user')).User();
  await ins.init();
  return ins;
});

export class User {
  id = createSignalObject<string>(undefined as any);

  constructor() {}

  async init() {
    this.loadId();
  }

  loadId() {
    let id = localStorage.getItem('id');

    // if (!id) {
    //   id = Math.random().toString(36);
    //   id += Math.random().toString(36);
    //   id += Math.random().toString(36);
    // }

    if (id) {
      this.setId(id);
    }
  }

  setId(id: string) {
    localStorage.setItem('id', id);
    this.id.set(id);
  }
}
