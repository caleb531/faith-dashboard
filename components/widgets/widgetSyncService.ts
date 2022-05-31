import { TinyEmitter } from 'tiny-emitter';
import { WidgetState } from './widget';

// The callback for a widget sync event
type WidgetSyncCallback = (state: WidgetState) => void;
// A global emitter object used for all widgets; the ID of each event listened
// for will be dynamic based on the widget ID (e.g.
// 'pull:4a168299-dd55-4dfb-8a2f-58327073d7d7')
const widgetSyncEmitter = new TinyEmitter();

// Broadcast to the widget with the given ID that it should push its state to
// the server
export function broadcastPush(widgetId: string) {
  widgetSyncEmitter.emit(`push:${widgetId}`);
}

// Broadcast the widget state from the server to the local component for that
// widget
export function broadcastPull(widgetId: string, widget: WidgetState) {
  widgetSyncEmitter.emit(`pull:${widgetId}`, widget);
}

// Listen for broadcasts that this particular widget should push its state to
// the server
export function onPush(widgetId: string, callback: WidgetSyncCallback) {
  return widgetSyncEmitter.on(`push:${widgetId}`, callback);
}

// Listen for broadcasts that this particular widget had its state recently
// pulled from the server
export function onPull(widgetId: string, callback: WidgetSyncCallback) {
  return widgetSyncEmitter.on(`pull:${widgetId}`, callback);
}

// Remove all listeners bound with onPull() for this widget
export function offPush(widgetId: string, callback?: WidgetSyncCallback) {
  return widgetSyncEmitter.off(`push:${widgetId}`, callback);
}

// Remove all listeners bound with onPull() for this widget
export function offPull(widgetId: string, callback?: WidgetSyncCallback) {
  return widgetSyncEmitter.off(`pull:${widgetId}`, callback);
}

export default {
  broadcastPush,
  broadcastPull,
  onPush,
  onPull,
  offPush,
  offPull
};
