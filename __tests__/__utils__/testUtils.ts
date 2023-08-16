import { AppState } from '@components/app/app.types';
import appStateDefault from '@components/app/appStateDefault';
import {
  WidgetHead,
  WidgetState,
  WidgetTypeId
} from '@components/widgets/widget.types';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fromPairs } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

export function createWidget(props: object): WidgetHead {
  return {
    id: uuidv4(),
    ...(props as Omit<WidgetHead, 'id'>)
  };
}

export function getAppData(): AppState {
  return JSON.parse(localStorage.getItem('faith-dashboard-app') || '{}');
}

export function setAppData(app: object) {
  localStorage.setItem('faith-dashboard-app', JSON.stringify(app));
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

export function mockAlert(mockImpl: (message?: any) => void) {
  return jest.spyOn(window, 'alert').mockImplementation(mockImpl);
}
export function mockConfirm(mockImpl: (message?: string) => boolean) {
  return jest.spyOn(window, 'confirm').mockImplementation(mockImpl);
}

export async function removeWidget({
  type,
  index,
  confirmRemove
}: {
  type: WidgetTypeId;
  index: number;
  confirmRemove: boolean;
}) {
  const confirm = mockConfirm(() => confirmRemove);
  const widgetElem = screen.getAllByRole('article')[index];
  expect(widgetElem).toHaveProperty('dataset.widgetType', type);
  await userEvent.click(
    screen.getAllByRole('button', { name: 'Remove Widget' })[index]
  );
  expect(confirm).toHaveBeenCalled();
  confirm.mockReset();
  return widgetElem;
}

export async function populateFormFields(fields: object) {
  for (const [name, value] of Object.entries(fields)) {
    await userEvent.type(screen.getByLabelText(name), value);
  }
}

export function assignIdToLocalApp(appId: string) {
  const app =
    JSON.parse(localStorage.getItem('faith-dashboard-app') || 'null') ||
    appStateDefault;
  setAppData({ ...app, id: appId, shouldShowTutorial: false });
}

export function getCurrentAppId(): string | null | undefined {
  return JSON.parse(String(localStorage.getItem('faith-dashboard-app')))?.id;
}

export function convertFormDataToObject(formData: any) {
  if (formData instanceof FormData) {
    return fromPairs(Array.from(formData.entries()));
  } else {
    return {};
  }
}
