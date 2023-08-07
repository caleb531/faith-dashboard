import { WidgetHead } from './widgets/widget';

export function getAppStorageKey() {
  return 'faith-dashboard-app';
}

export function getWidgetStorageKey(widgetHead: WidgetHead) {
  return `faith-dashboard-widget-${widgetHead.type}:${widgetHead.id}`;
}
