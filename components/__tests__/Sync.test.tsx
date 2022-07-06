import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import Home from '../../pages';
import appStateDefault from '../app/appStateDefault';
import { supabase } from '../supabaseClient';
import dashboardToPullJson from './__json__/dashboardToPull.json';
import widgetToPullJson from './__json__/widgetToPull.json';
import {
  mockSupabaseFrom,
  mockSupabaseSession,
  mockSupabaseUser,
  supabaseFromMocks
} from './__mocks__/supabaseMockUtils';

function assignIdToLocalApp() {
  const app =
    JSON.parse(localStorage.getItem('faith-dashboard-app') || 'null') ||
    appStateDefault;
  localStorage.setItem(
    'faith-dashboard-app',
    JSON.stringify({
      id: uuidv4(),
      ...app
    })
  );
}

describe('Sync functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should pull latest dashboard on page load (when signed in)', async () => {
    const userStub = mockSupabaseUser();
    const sessionStub = mockSupabaseSession();
    const supabaseDbStub = mockSupabaseFrom();
    supabaseFromMocks.dashboards.select.mockImplementation(() => {
      return {
        data: [{ raw_data: JSON.stringify(dashboardToPullJson) }]
      } as any;
    });
    supabaseFromMocks.widgets.select.mockImplementation(() => {
      return {
        data: [{ raw_data: JSON.stringify(widgetToPullJson) }]
      } as any;
    });
    assignIdToLocalApp();
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(supabase.from).toHaveBeenNthCalledWith(1, 'dashboards');
      expect(supabase.from).toHaveBeenNthCalledWith(2, 'widgets');
      expect(supabase.from).toHaveBeenNthCalledWith(3, 'dashboards');
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(2);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalledTimes(1);
    });
    supabaseFromMocks.dashboards.select.mockRestore();
    supabaseFromMocks.widgets.select.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should push local dashboard if nothing to pull', async () => {
    const userStub = mockSupabaseUser();
    const sessionStub = mockSupabaseSession();
    const supabaseDbStub = mockSupabaseFrom();
    supabaseFromMocks.dashboards.select.mockImplementation(() => {
      return { data: [] } as any;
    });
    supabaseFromMocks.widgets.select.mockImplementation(() => {
      return { data: [] } as any;
    });
    supabaseFromMocks.dashboards.upsert.mockImplementation(() => {
      return {
        user: supabase.auth.user(),
        session: supabase.auth.session(),
        error: null
      };
    });
    supabaseFromMocks.widgets.upsert.mockImplementation(() => {
      return {
        user: supabase.auth.user(),
        session: supabase.auth.session(),
        error: null
      };
    });
    assignIdToLocalApp();
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(supabase.from).toHaveBeenNthCalledWith(1, 'dashboards');
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalledTimes(0);
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(4);
    });
    supabaseFromMocks.dashboards.select.mockRestore();
    supabaseFromMocks.widgets.select.mockRestore();
    supabaseFromMocks.dashboards.upsert.mockRestore();
    supabaseFromMocks.widgets.upsert.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should not pull latest dashboard if not logged in', async () => {
    const userStub = mockSupabaseUser(null);
    const sessionStub = mockSupabaseSession(null);
    const supabaseDbStub = mockSupabaseFrom();
    supabaseFromMocks.dashboards.select.mockImplementation(() => {
      return { data: [] } as any;
    });
    supabaseFromMocks.widgets.select.mockImplementation(() => {
      return { data: [] } as any;
    });
    assignIdToLocalApp();
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Sign Up/In' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(supabase.from).not.toHaveBeenCalled();
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(0);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalledTimes(0);
    });
    supabaseFromMocks.dashboards.select.mockRestore();
    supabaseFromMocks.widgets.select.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });
});
