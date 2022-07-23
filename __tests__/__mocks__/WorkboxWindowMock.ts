class WorkboxMock {
  _callbackMap: { [key: string]: ((...args: any[]) => void)[] };
  static instances: WorkboxMock[];

  constructor() {
    this._callbackMap = {};
    WorkboxMock.instances.push(this);
  }

  addEventListener(eventType: string, eventCallback: (...args: any[]) => void) {
    if (!this._callbackMap[eventType]) {
      this._callbackMap[eventType] = [];
    }
    this._callbackMap[eventType].push(eventCallback);
  }
  trigger(eventName: string, ...args: any[]) {
    if (this._callbackMap[eventName]) {
      this._callbackMap[eventName].forEach((callback) => {
        setTimeout(() => {
          callback(...args);
        });
      });
    }
  }
  register() {
    this.trigger('waiting', {
      wasWaitingBeforeRegister: false
    });
  }
}
WorkboxMock.instances = [];

export const Workbox = WorkboxMock;

export function messageSW(sw: object, data: { type: string }) {
  Workbox.instances.forEach((wb) => {
    // setTimeout(() => {
    //   wb.trigger('controlling');
    // });
  });
}
