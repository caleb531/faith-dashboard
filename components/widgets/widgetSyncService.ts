import { Deferred } from '../deferred';
import { WidgetState } from './widget.d';

// The callback for a widget sync event
type WidgetPushQueue = { [key: string]: Deferred<void> };
type WidgetPullQueue = { [key: string]: Deferred<WidgetState> };
// Use a hashmap as a sort of queue structure to achieve constant time lookups
// and to ensure that if a push/pull broadcast happens (from useAppSync())
// before the widgets are mounted (i.e. before useWidgetSync() has even run),
// then the appropriate callbacks will still run as soon as they are ready
const widgetPushQueue: WidgetPushQueue = {};
const widgetPullQueue: WidgetPullQueue = {};

// Broadcast to the widget with the given ID that it should push its state to
// the server
export function broadcastPush(widgetId: string): void {
  if (!widgetPushQueue[widgetId]) {
    widgetPushQueue[widgetId] = new Deferred();
  }
  widgetPushQueue[widgetId].resolve();
}

// Broadcast the widget state from the server to the local component for that
// widget
export function broadcastPull(widgetId: string, widget: WidgetState): void {
  if (widgetPullQueue[widgetId]) {
    widgetPullQueue[widgetId].resolve(widget);
  } else {
    widgetPullQueue[widgetId] = new Deferred();
  }
}

// Listen for broadcasts that this particular widget should push its state to
// the server
export function onPush(widgetId: string): Promise<void> {
  if (!widgetPushQueue[widgetId]) {
    widgetPushQueue[widgetId] = new Deferred();
  }
  return widgetPushQueue[widgetId].promise;
}

// Listen for broadcasts that this particular widget had its state recently
// pulled from the server
export function onPull(widgetId: string): Promise<WidgetState> {
  if (!widgetPullQueue[widgetId]) {
    widgetPullQueue[widgetId] = new Deferred();
  }
  return widgetPullQueue[widgetId].promise;
}

// Remove all listeners bound with onPull() for this widget
export function offPush(widgetId: string): void {
  delete widgetPushQueue[widgetId];
}

// Remove all listeners bound with onPull() for this widget
export function offPull(widgetId: string): void {
  delete widgetPullQueue[widgetId];
}

export default {
  broadcastPush,
  broadcastPull,
  onPush,
  onPull,
  offPush,
  offPull
};
