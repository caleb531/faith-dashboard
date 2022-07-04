import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

export function getWidgetData({
  widgetTypeId,
  widgetIndex
}: {
  widgetTypeId: WidgetTypeId;
  widgetIndex: number;
}): WidgetState {
  const widgetId = screen.getAllByRole('article')[widgetIndex].dataset
    .widgetId as string;
  return JSON.parse(
    localStorage.getItem(
      `faith-dashboard-widget-${widgetTypeId}:${widgetId}`
    ) || '{}'
  );
}

export async function populateFormFields(fields: object) {
  for (const [name, value] of Object.entries(fields)) {
    await userEvent.type(screen.getByLabelText(name), value);
  }
}
