import { AppState } from '@components/app/app.types';
import colorThemeList from '@components/app/appColorThemeList';
import photoThemeList from '@components/app/appPhotoThemeList';
import { getDefaultAppState } from '@components/app/appUtils';
import { convertObjectToFormData } from '@components/authUtils.client';
import {
  WidgetHead,
  WidgetState,
  WidgetTypeId
} from '@components/widgets/widget.types';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextRequest } from '@tests/__mocks__/nextServer';
import { fromPairs } from 'lodash-es';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export interface JsonWidgetHead extends Omit<WidgetHead, 'type'> {
  type: string;
}

export interface JsonAppState extends Omit<AppState, 'widgets'> {
  widgets: JsonWidgetHead[];
}

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

const originalLocationObject = window.location;

export function mockLocationObject() {
  // @ts-ignore (see <https://stackoverflow.com/a/61649798/560642>)
  delete window.location;
  window.location = {
    ...originalLocationObject,
    reload: jest.fn(),
    assign: jest.fn()
  };
}

export function restoreLocationObject() {
  window.location = originalLocationObject;
}

export function mockAlertOnce(mockImpl: (message?: any) => void) {
  return jest.spyOn(window, 'alert').mockImplementationOnce(mockImpl);
}
export function mockConfirmOnce(mockImpl: (message?: string) => boolean) {
  return jest.spyOn(window, 'confirm').mockImplementationOnce(mockImpl);
}
export function mockPromptOnce(mockImpl: (message?: string) => string | null) {
  return jest.spyOn(window, 'prompt').mockImplementationOnce(mockImpl);
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
  const confirm = mockConfirmOnce(() => confirmRemove);
  const widgetElem = screen.getAllByRole('article')[index];
  expect(widgetElem).toHaveProperty('dataset.widgetType', type);
  await userEvent.click(
    screen.getAllByRole('button', { name: 'Remove Widget' })[index]
  );
  expect(confirm).toHaveBeenCalled();
  confirm.mockReset();
  return widgetElem;
}

export async function typeIntoFormFields(
  fields: object,
  { clearFieldsFirst = false }: { clearFieldsFirst: boolean } = {
    clearFieldsFirst: false
  }
) {
  for (const [name, value] of Object.entries(fields)) {
    const input: HTMLInputElement = screen.getByLabelText(name);
    if (clearFieldsFirst) {
      input.value = '';
    }
    await userEvent.type(input, value);
  }
}

export function assignIdToLocalApp(appId: string) {
  const app =
    JSON.parse(localStorage.getItem('faith-dashboard-app') || 'null') ||
    getDefaultAppState();
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

export async function callRouteHandler({
  handler,
  path,
  method = 'POST',
  fields = {}
}: {
  handler: (req: NextRequest) => Promise<NextResponse>;
  path: string;
  method?: 'GET' | 'POST' | 'get' | 'post';
  fields?: object;
}) {
  NextRequest._formData = convertObjectToFormData(fields);
  return handler(
    new NextRequest(`http://localhost:3000/${path.replace(/^\//, '')}`, {
      method: 'POST',
      body: NextRequest._formData
    })
  );
}

export function getThemeName(themeId: string) {
  return String(
    photoThemeList.find((theme) => theme.id === themeId)?.name ??
      colorThemeList.find((theme) => theme.id === themeId)?.name
  );
}
