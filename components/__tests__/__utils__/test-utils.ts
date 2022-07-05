import { screen, waitFor } from '@testing-library/react';
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

export function waitForWidget({
  type,
  index
}: {
  type: WidgetTypeId;
  index: number;
}): Promise<void> {
  return waitFor(() => {
    expect(screen.getAllByRole('article')[index]).toHaveProperty(
      'dataset.widgetType',
      type
    );
  });
}

export function getWidgetData({
  type,
  index
}: {
  type: WidgetTypeId;
  index: number;
}): WidgetState {
  const widgetId = screen.getAllByRole('article')[index].dataset
    .widgetId as string;
  const widgetData = JSON.parse(
    localStorage.getItem(`faith-dashboard-widget-${type}:${widgetId}`) || 'null'
  );
  if (!widgetData) {
    throw new Error(`No widget found at index ${index} of type ${type}`);
  }
  return widgetData;
}

export async function populateFormFields(fields: object) {
  for (const [name, value] of Object.entries(fields)) {
    await userEvent.type(screen.getByLabelText(name), value);
  }
}
