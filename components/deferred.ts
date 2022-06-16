export class Deferred<T> {
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

/* eslint-disable-next-line no-redeclare */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (arg: T) => void;
  reject: (error: Error) => void;
}
