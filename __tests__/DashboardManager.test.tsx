import Home from '@app/page';
import widgetSyncService from '@components/widgets/widgetSyncService';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import firstDashboardJson from '@tests/__json__/dashboardManager/firstDashboard.json';
import secondDashboardJson from '@tests/__json__/dashboardManager/secondDashboard.json';
import thirdDashboardJson from '@tests/__json__/dashboardManager/thirdDashboard.json';
import dashboardToPullJson from '@tests/__json__/dashboardToPull.json';
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
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelectOnce('dashboards', {
      data: [{ raw_data: dashboardToPullJson }]
    });
    mockSupabaseSelectOnce('dashboards', {
      data: [
        { raw_data: firstDashboardJson },
        { raw_data: secondDashboardJson },
        { raw_data: thirdDashboardJson }
      ]
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
      expect(screen.getByText('Main Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Evening Dashboard')).toBeInTheDocument();
      expect(
        screen.getByText('Spiritual Warfare Dashboard')
      ).toBeInTheDocument();
    });
  });
});
