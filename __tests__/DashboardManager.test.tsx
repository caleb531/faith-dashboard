import Home from '@app/page';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firstDashboardJson from '@tests/__json__/dashboardManager/firstDashboard.json';
import secondDashboardJson from '@tests/__json__/dashboardManager/secondDashboard.json';
import thirdDashboardJson from '@tests/__json__/dashboardManager/thirdDashboard.json';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  ErrorConfig,
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
  getAppData,
  getThemeName,
  mockConfirmOnce,
  mockPromptOnce,
  setAppData
} from '@tests/__utils__/testUtils';

function mockDashboardsFetch(
  dashboards: JsonAppState[],
  { error = null }: ErrorConfig = { error: null }
) {
  mockSupabaseSelectOnce('dashboards', {
    data: dashboards.map((dashboard) => {
      return { raw_data: dashboard };
    }),
    error
  });
}

async function openDashboardManager({
  localDashboard,
  availableDashboards,
  error = null
}: {
  localDashboard: JsonAppState;
  availableDashboards: JsonAppState[];
  error?: ErrorConfig['error'];
}): Promise<void> {
  await mockSupabaseUser();
  await mockSupabaseSession();
  mockSupabaseFrom();
  mockSupabaseSelectOnce('dashboards', {
    data: [{ raw_data: localDashboard }]
  });
  mockSupabaseSelect('widgets', { data: [] });
  mockDashboardsFetch(availableDashboards, { error });
  setAppData(localDashboard);
  await renderServerComponent(<Home />);
  await waitFor(() => {
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
  });
  if (availableDashboards?.length > 0) {
    await waitFor(() => {
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalled();
    });
  }
  // Reset the calls and call counts on the supabase mocks
  supabaseFromMocks.dashboards.select.mockClear();
  await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
  await userEvent.click(screen.getByRole('link', { name: 'My Dashboards' }));
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

async function switchToDashboard(
  dashboard: JsonAppState,
  { error = null }: ErrorConfig = { error: null }
) {
  mockSupabaseSelectOnce('dashboards', {
    data: [{ raw_data: dashboard }],
    error
  });
  await userEvent.click(screen.getByLabelText(String(dashboard.name)));
  if (!error) {
    await waitFor(() => {
      expect(
        screen.getByText(getThemeName(dashboard.theme))
      ).toBeInTheDocument();
    });
  }
}

describe('Dashboard Manager', () => {
  afterEach(() => {
    jest.resetAllMocks();
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

  it('should handle errors when fetching dashboards', async () => {
    const error = new Error('Server error fetching dashboards');
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards: [],
      error
    });
    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });

  it('should indicate when user has no dashboards', async () => {
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards: []
    });
    await waitFor(() => {
      expect(
        screen.getByText('You have no dashboards. Create one!')
      ).toBeInTheDocument();
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

  it('should handle errors when switching dashboards', async () => {
    const error = new Error('There was a problem switching to this dashboard.');
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    await switchToDashboard(thirdDashboardJson, { error });
    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });

  it('should successfully create new dashboard', async () => {
    const localDashboard = secondDashboardJson;
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard,
      availableDashboards
    });
    const newDashboardName = 'Prayer Dashboard';
    mockPromptOnce(() => newDashboardName);
    await userEvent.click(
      screen.getByRole('button', { name: 'Add New Dashboard' })
    );
    await waitFor(() => {
      expect(screen.getByText('Shore')).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'My Dashboards' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Skip Tutorial' })
      ).not.toBeInTheDocument();
      expect(getAppData().id).not.toEqual(localDashboard.id);
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
    mockPromptOnce(() => null);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Add New Dashboard'
      })
    );
    expect(
      screen.getByText(getThemeName(secondDashboardJson.theme))
    ).toBeInTheDocument();
  });

  it('should use different UUIDs for all newly-created dashboards', async () => {
    const localDashboard = secondDashboardJson;
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard,
      availableDashboards
    });
    const newDashboardName1 = 'Prayer Dashboard';
    mockPromptOnce(() => newDashboardName1);
    await userEvent.click(
      screen.getByRole('button', { name: `Add New Dashboard` })
    );
    await waitFor(() => {
      expect(screen.getByText('Shore')).toBeInTheDocument();
    });
    const newDashboard1 = getAppData();
    mockDashboardsFetch([newDashboard1, ...availableDashboards]);
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    await userEvent.click(screen.getByRole('link', { name: 'My Dashboards' }));
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    const newDashboardName2 = 'Worship Dashboard';
    mockPromptOnce(() => newDashboardName2);
    await userEvent.click(
      screen.getByRole('button', { name: 'Add New Dashboard' })
    );
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'My Dashboards' })
      ).not.toBeInTheDocument();
      const newDashboard2 = getAppData();
      expect(newDashboard2.name).toEqual(newDashboardName2);
      expect(newDashboard2.id).not.toEqual(newDashboard1.id);
      newDashboard2.widgets.forEach((widget, w) => {
        expect(widget.id).not.toEqual(newDashboard1.widgets[w].id);
      });
    });
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
    mockPromptOnce(() => newDashboardName);
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    await userEvent.click(
      screen.getByRole('button', {
        name: `Edit Name for Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(newDashboardName)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(0);
    });
  });

  it('should update state of current dashboard if its own name is edited', async () => {
    const localDashboard = secondDashboardJson;
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard,
      availableDashboards
    });
    const newDashboardName = 'Spiritual Warfare Dashboard';
    mockPromptOnce(() => newDashboardName);
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    await userEvent.click(
      screen.getByRole('button', {
        name: `Edit Name for Dashboard "${localDashboard.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(newDashboardName)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(0);
      expect(getAppData().name).toEqual(newDashboardName);
    });
  });

  it('should handle errors while editing dashboard name', async () => {
    const error = new Error('Could not edit dashboard name');
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
    mockPromptOnce(() => newDashboardName);
    mockSupabaseUpsert('dashboards', { error });
    mockSupabaseUpsert('widgets');
    await userEvent.click(
      screen.getByRole('button', {
        name: `Edit Name for Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(thirdDashboardJson.name)).toBeInTheDocument();
      expect(screen.getByText(error.message)).toBeInTheDocument();
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
    mockPromptOnce(() => null);
    await userEvent.click(
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
    mockConfirmOnce(() => true);
    await userEvent.click(
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

  it('should handle errors when deleting dashboard', async () => {
    const error = new Error('Could not delete dashboard. Sorry!');
    const availableDashboards = [
      firstDashboardJson,
      secondDashboardJson,
      thirdDashboardJson
    ];
    await openDashboardManager({
      localDashboard: secondDashboardJson,
      availableDashboards
    });
    mockSupabaseDelete('dashboards', { error });
    mockDashboardsFetch(availableDashboards.slice(0, 2));
    mockConfirmOnce(() => true);
    await userEvent.click(
      screen.getByRole('button', {
        name: `Delete Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.queryByText(thirdDashboardJson.name)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.delete).toHaveBeenCalledTimes(1);
      expect(screen.getByText(error.message)).toBeInTheDocument();
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
    mockConfirmOnce(() => true);
    mockSupabaseSelectOnce('dashboards', {
      data: [{ raw_data: firstDashboardJson }]
    });
    await userEvent.click(
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
    mockConfirmOnce(() => false);
    await userEvent.click(
      screen.getByRole('button', {
        name: `Delete Dashboard "${thirdDashboardJson.name}"`
      })
    );
    await waitFor(() => {
      expect(screen.getByText(thirdDashboardJson.name)).toBeInTheDocument();
      expect(supabaseFromMocks.dashboards.delete).toHaveBeenCalledTimes(0);
    });
  });

  it('should prevent deletion of only dashboard', async () => {
    const localDashboard = firstDashboardJson;
    const availableDashboards = [localDashboard];
    await openDashboardManager({
      localDashboard,
      availableDashboards
    });
    mockSupabaseDelete('dashboards');
    mockDashboardsFetch(availableDashboards.slice(0, 2));
    expect(
      screen.queryByRole('button', {
        name: `Delete Dashboard "${firstDashboardJson.name}"`
      })
    ).not.toBeInTheDocument();
  });
});
