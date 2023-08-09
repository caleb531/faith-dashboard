import { WidgetHead } from './widgets/widget';

export function getSelectedAppIdStorageKey() {
  return 'faith-dashboard-selected-appid';
}
export function getAppStorageKey() {
  return 'faith-dashboard-app';
}

export function getWidgetStorageKey(widgetHead: WidgetHead) {
  return `faith-dashboard-widget-${widgetHead.type}:${widgetHead.id}`;
}

export function getClientIdStorageKey() {
  return 'faith-dashboard-clientid';
}
