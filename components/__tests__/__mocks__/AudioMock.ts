// In order to prevent a NotImplemented error from jsdom, we cannot extend from
// `Audio`
class AudioMock {
  currentTime: number;
  duration: number;
  paused: boolean;
  callbackMap: { [key: string]: (() => void)[] };

  constructor() {
    this.currentTime = 0;
    this.duration = 60;
    this.paused = true;
    this.callbackMap = {};
  }

  play() {
    this.paused = false;
    this.trigger('play');
  }

  pause() {
    this.trigger('pause');
    this.paused = true;
  }

  trigger(eventName: string) {
    if (this.callbackMap[eventName]) {
      this.callbackMap[eventName].forEach((callback) => {
        callback();
      });
    }
  }

  addEventListener(eventType: string, eventCallback: (event?: any) => void) {
    if (eventType === 'loadeddata' || eventType === 'loadedmetadata') {
      eventCallback();
    } else {
      if (!this.callbackMap[eventType]) {
        this.callbackMap[eventType] = [];
      }
      this.callbackMap[eventType].push(eventCallback);
    }
  }

  removeEventListener(eventName: string) {
    if (this.callbackMap[eventName]) {
      this.callbackMap[eventName].length = 0;
    }
  }
}

export default AudioMock;
