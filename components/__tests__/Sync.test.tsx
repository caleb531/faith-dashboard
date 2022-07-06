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
  it('should pull latest dashboard on page load (when signed in)', async () => {
    jest.useFakeTimers();
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
    jest.useRealTimers();
  });
});
