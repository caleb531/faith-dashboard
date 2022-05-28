import { TypedEmitter } from 'tiny-typed-emitter';
import { WidgetState } from './widget';

// The callback for a widget sync event
type WidgetSyncCallback = (state: WidgetState) => void;

interface WidgetSyncEvents {
  // The key names map to dynamic event names based on the widget ID (e.g.
  // 'pull:4a168299-dd55-4dfb-8a2f-58327073d7d7')
  [key: string]: WidgetSyncCallback
}

const widgetSyncEmitter = new TypedEmitter<WidgetSyncEvents>();

// Broadcast the widget state from the server to the local component for that
// widget
export function broadcastToWidget(widgetId: string, widget: WidgetState) {
  widgetSyncEmitter.emit(widgetId, widget);
}

// Listen for broadcasts that this particular widget had its state recently
// pulled from the server
export function onPull(widgetId: string, callback: WidgetSyncCallback) {
  return widgetSyncEmitter.addListener(`pull:${widgetId}`, callback);
}

// Remove all listeners bound with onPull() for this widget
export function offPull(widgetId: string, callback?: WidgetSyncCallback) {
  if (callback) {
    return widgetSyncEmitter.removeListener(`pull:${widgetId}`, callback);
  } else {
    return widgetSyncEmitter.removeAllListeners(`pull:${widgetId}`);
  }
}

export default { onPull, offPull };
