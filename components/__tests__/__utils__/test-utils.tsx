import { v4 as uuidv4 } from 'uuid';
import { AppState } from '../../app/app.d';
import { WidgetHead, WidgetState, WidgetTypeId } from '../../widgets/widget.d';

export function createWidget(props: object): WidgetHead {
  return {
    id: uuidv4(),
    ...(props as Omit<WidgetHead, 'id'>)
  };
}

export function getAppData(): AppState {
  return JSON.parse(localStorage.getItem('faith-dashboard-app') || '{}');
}

export function getWidgetData(
  widgetType: WidgetTypeId,
  widgetId: string
): WidgetState {
  return JSON.parse(
    localStorage.getItem(`faith-dashboard-widget-${widgetType}:${widgetId}`) ||
      '{}'
  );
}
