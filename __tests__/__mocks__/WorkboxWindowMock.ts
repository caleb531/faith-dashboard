class WorkboxMock {
  _callbackMap: { [key: string]: (() => void)[] };
  static instances: WorkboxMock[];

  constructor() {
    console.log('init Workbox!!!');
    this._callbackMap = {};
    WorkboxMock.instances.push(this);
  }

  addEventListener(eventType: string, eventCallback: (event?: any) => void) {
    if (!this._callbackMap[eventType]) {
      this._callbackMap[eventType] = [];
    }
    this._callbackMap[eventType].push(eventCallback);
  }
  trigger(eventName: string) {
    if (this._callbackMap[eventName]) {
      this._callbackMap[eventName].forEach((callback) => {
        callback();
      });
    }
  }
  register() {
    this.trigger('waiting');
  }
}
WorkboxMock.instances = [];

export const Workbox = WorkboxMock;

export function messageSW(sw: object, data: { type: string }) {
  Workbox.instances.forEach((wb) => {
    setTimeout(() => {
      wb.trigger('controlling');
    }, 1000);
  });
}
