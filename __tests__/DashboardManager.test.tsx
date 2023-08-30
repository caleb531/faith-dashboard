import Home from '@app/page';
import widgetSyncService from '@components/widgets/widgetSyncService';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import firstDashboardJson from '@tests/__json__/dashboardManager/firstDashboard.json';
import secondDashboardJson from '@tests/__json__/dashboardManager/secondDashboard.json';
import thirdDashboardJson from '@tests/__json__/dashboardManager/thirdDashboard.json';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  mockSupabaseDelete,
  mockSupabaseFrom,
  mockSupabaseSelect,
  mockSupabaseSelectOnce,
  mockSupabaseSession,
  mockSupabaseUpsert,
  mockSupabaseUser,
  supabaseFromMocks
} from '@tests/__utils__/supabaseMockUtils';
import {
  JsonAppState,
  getThemeName,
  mockConfirm,
  mockPrompt,
  setAppData
} from '@tests/__utils__/testUtils';
import userEventFakeTimers from './__utils__/userEventFakeTimers';

function mockDashboardsFetch(dashboards: JsonAppState[]) {
  mockSupabaseSelectOnce('dashboards', {
    data: dashboards.map((dashboard) => {
      return { raw_data: dashboard };
    })
  });
}

async function openDashboardManager({
  localDashboard,
  availableDashboards
}: {
  localDashboard: JsonAppState;
  availableDashboards: JsonAppState[];
}): Promise<void> {
  await mockSupabaseUser();
  await mockSupabaseSession();
  mockSupabaseFrom();
  mockSupabaseSelectOnce('dashboards', {
    data: [{ raw_data: localDashboard }]
  });
  mockSupabaseSelect('widgets', { data: [] });
  mockDashboardsFetch(availableDashboards);
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
  await userEventFakeTimers.click(
    screen.getByRole('button', { name: 'Your Account' })
  );
  await userEventFakeTimers.click(
    screen.getByRole('link', { name: 'My Dashboards' })
  );
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
    screen.getByText(getThemeName(localDashboard.theme))
  ).toBeInTheDocument();
  expect(screen.queryByText('Shore')).not.toBeInTheDocument();
}

async function switchToDashboard(dashboard: JsonAppState) {
  mockSupabaseSelectOnce('dashboards', {
    data: [{ raw_data: dashboard }]
  });
  await userEventFakeTimers.click(
    screen.getByLabelText(String(dashboard.name))
  );
  await waitFor(() => {
    expect(screen.getByText(getThemeName(dashboard.theme))).toBeInTheDocument();
  });
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
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
  });

  it('should switch to another dashboard', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    await switchToDashboard(thirdDashboardJson);
  });

  it('should successfully create new dashboard', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    const newDashboardName = 'Prayer Dashboard';
    mockPrompt(() => newDashboardName);
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: `Add Dashboard` })
    );
    await waitFor(() => {
      expect(screen.getByText('Shore')).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'My Dashboards' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Skip Tutorial' })
      ).not.toBeInTheDocument();
    });
  });

  it('should cancel prompt to create dashboard', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    mockPrompt(() => null);
    await userEventFakeTimers.click(
      screen.getByRole('button', {
        name: 'Add Dashboard'
      })
    );
    expect(
      screen.getByText(getThemeName(secondDashboardJson.theme))
    ).toBeInTheDocument();
  });

  it('should successfully edit dashboard name', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    const newDashboardName = 'Spiritual Warfare Dashboard';
    mockPrompt(() => newDashboardName);
    mockSupabaseUpsert('dashboards');
    await userEventFakeTimers.click(
      screen.getByRole('button', {
        name: `Edit Name for Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(newDashboardName)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
    });
  });

  it('should cancel prompt to edit dashboard name', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    mockPrompt(() => null);
    await userEventFakeTimers.click(
      screen.getByRole('button', {
        name: `Edit Name for Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(thirdDashboardJson.name)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(0);
    });
  });

  it('should successfully delete dashboard', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    mockSupabaseDelete('dashboards');
    mockDashboardsFetch(availableDashboards.slice(0, 2));
    mockConfirm(() => true);
    await userEventFakeTimers.click(
      screen.getByRole('button', {
        name: `Delete Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(
        screen.queryByText(thirdDashboardJson.name)
      ).not.toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.delete).toHaveBeenCalledTimes(1);
    });
  });

  it('should switch to another dashboard when active dashboard is deleted', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    const dashboardToDelete = secondDashboardJson;
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    mockSupabaseDelete('dashboards');
    mockDashboardsFetch(
      availableDashboards.filter((dashboard) => {
        return dashboard !== dashboardToDelete;
      })
    );
    mockConfirm(() => true);
    mockSupabaseSelectOnce('dashboards', {
      data: [{ raw_data: firstDashboardJson }]
    });
    await userEventFakeTimers.click(
      screen.getByRole('button', {
        name: `Delete Dashboard "${dashboardToDelete.name}"`
      })
    );
    await waitFor(() => {
      expect(
        screen.queryByText(dashboardToDelete.name)
      ).not.toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.delete).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText(getThemeName(firstDashboardJson.theme))
      ).toBeInTheDocument();
    });
  });

  it('should cancel confirmation to delete dashboard', async () => {
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    mockConfirm(() => false);
    await userEventFakeTimers.click(
      screen.getByRole('button', {
        name: `Delete Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(thirdDashboardJson.name)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.delete).toHaveBeenCalledTimes(0);
    });
  });
});
