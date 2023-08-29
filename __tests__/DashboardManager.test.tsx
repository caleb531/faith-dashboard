import Home from '@app/page';
import { AppState } from '@components/app/app.types';
import photoThemeList from '@components/app/appPhotoThemeList';
import widgetSyncService from '@components/widgets/widgetSyncService';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import firstDashboardJson from '@tests/__json__/dashboardManager/firstDashboard.json';
import secondDashboardJson from '@tests/__json__/dashboardManager/secondDashboard.json';
import thirdDashboardJson from '@tests/__json__/dashboardManager/thirdDashboard.json';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  mockSupabaseFrom,
  mockSupabaseSelect,
  mockSupabaseSelectOnce,
  mockSupabaseSession,
  mockSupabaseUser,
  supabaseFromMocks
} from '@tests/__utils__/supabaseMockUtils';
import { setAppData } from '@tests/__utils__/testUtils';
import { capitalize } from 'lodash-es';

async function openDashboardManager({
  localDashboard,
  availableDashboards
}: {
  localDashboard: AppState;
  availableDashboards: AppState[];
}): Promise<void> {
  await mockSupabaseUser();
  await mockSupabaseSession();
  mockSupabaseFrom();
  mockSupabaseSelectOnce('dashboards', {
    data: [{ raw_data: secondDashboardJson }]
  });
  mockSupabaseSelectOnce('dashboards', {
    data: availableDashboards.map((dashboard) => {
      return { raw_data: dashboard };
    })
  });
  mockSupabaseSelect('widgets', { data: [] });
  setAppData(firstDashboardJson);
  await renderServerComponent(<Home />);
  await waitFor(() => {
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(1);
    expect(supabaseFromMocks.widgets.select).toHaveBeenCalled();
  });
  // Reset the calls and call counts on the supabase mocks
  supabaseFromMocks.dashboards.select.mockClear();
  // For some reason, using userEvent.click() for the below causes Jest to
  // timeout; so we are using fireEvent instead
  fireEvent.click(screen.getByRole('button', { name: 'Your Account' }));
  fireEvent.click(screen.getByRole('link', { name: 'My Dashboards' }));
  expect(
    screen.getByRole('heading', { name: 'My Dashboards' })
  ).toBeInTheDocument();
  await waitFor(() => {
    availableDashboards.forEach((dashboard) => {
      expect(screen.getByText(String(dashboard.name))).toBeInTheDocument();
    });
  });
  // Ensure that current dashboard hasn't changed (mostly as a sanity check)
  expect(
    screen.getByText(
      String(
        photoThemeList.find((theme) => {
          return theme.id === localDashboard.theme;
        })?.name || capitalize(localDashboard.theme)
      )
    )
  ).toBeInTheDocument();
  expect(screen.queryByText('Shore')).not.toBeInTheDocument();
}

const originalOnPush = widgetSyncService.onPush;
const originalBroadcastPush = widgetSyncService.broadcastPush;

describe('Dashboard Manager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
    widgetSyncService.onPush = originalOnPush;
    widgetSyncService.broadcastPush = originalBroadcastPush;
    jest.useRealTimers();
  });

  it('should open and fetch all user dashboards', async () => {
    await openDashboardManager({
      localDashboard: secondDashboardJson as AppState,
      availableDashboards: [
        firstDashboardJson as AppState,
        secondDashboardJson as AppState,
        thirdDashboardJson as AppState
      ]
    });
  });

  it('should switch to another dashboard', async () => {
    await openDashboardManager({
      localDashboard: secondDashboardJson as AppState,
      availableDashboards: [
        firstDashboardJson as AppState,
        secondDashboardJson as AppState,
        thirdDashboardJson as AppState
      ]
    });
    mockSupabaseSelectOnce('dashboards', {
      data: [{ raw_data: thirdDashboardJson }]
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Stars Dashboard'));
    });
    expect(screen.getByText('Stars')).toBeInTheDocument();
  });
});
