import '@testing-library/jest-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import appStateDefault from '../components/app/appStateDefault';
import { supabase } from '../components/supabaseClient';
import Home from '../pages';
import dashboardToPullJson from './__json__/dashboardToPull.json';
import widgetToPullJson from './__json__/widgetToPull.json';
import {
  mockSupabaseFrom,
  mockSupabaseSession,
  mockSupabaseUser,
  supabaseFromMocks
} from './__mocks__/supabaseMockUtils';
import { removeWidget, waitForWidget } from './__utils__/testUtils';

function assignIdToLocalApp(appId: string) {
  const app =
    JSON.parse(localStorage.getItem('faith-dashboard-app') || 'null') ||
    appStateDefault;
  localStorage.setItem(
    'faith-dashboard-app',
    JSON.stringify({ id: appId, ...app })
  );
}

// The default response of any Supabase call that writes to the database (i.e.
// upsert and delete)
const defaultWriteResponse = {
  user: supabase.auth.user(),
  session: supabase.auth.session(),
  error: null
};

type TableName = 'dashboards' | 'widgets';

function mockSelect(tableName: TableName, response: any) {
  supabaseFromMocks[tableName].select.mockImplementation(async () => {
    return response;
  });
  return supabaseFromMocks[tableName].select;
}

function mockUpsert(tableName: TableName) {
  supabaseFromMocks[tableName].upsert.mockImplementation(async () => {
    return defaultWriteResponse;
  });
  return supabaseFromMocks[tableName].upsert;
}

function mockDelete(tableName: TableName) {
  supabaseFromMocks[tableName].delete.mockImplementation(() => {
    return {
      match: jest.fn().mockImplementation(async () => {
        return defaultWriteResponse;
      })
    };
  });
  return supabaseFromMocks[tableName].delete;
}

describe('Sync functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should pull latest dashboard on page load (when signed in)', async () => {
    mockSupabaseUser();
    mockSupabaseSession();
    mockSupabaseFrom();
    mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify(dashboardToPullJson) }]
    });
    mockSelect('widgets', {
      data: [{ raw_data: JSON.stringify(widgetToPullJson) }]
    });
    assignIdToLocalApp(uuidv4());
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(2);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText('Evening')).toBeInTheDocument();
    expect(screen.queryByText('Shore')).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('textbox', { name: 'Note Text' })[0]
    ).toHaveProperty('value', 'God is always with you');
  });

  it('should push local dashboard if nothing to pull', async () => {
    mockSupabaseUser();
    mockSupabaseSession();
    mockSupabaseFrom();
    mockSelect('dashboards', {
      data: []
    });
    mockSelect('widgets', { data: [] });
    mockUpsert('dashboards');
    mockUpsert('widgets');
    assignIdToLocalApp(uuidv4());
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('dashboards');
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.select).not.toHaveBeenCalled();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(4);
    });
  });

  it('should push when widget changes', async () => {
    mockSupabaseUser();
    mockSupabaseSession();
    mockSupabaseFrom();
    const appId = uuidv4();
    mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify({ ...appStateDefault, id: appId }) }]
    });
    mockSelect('widgets', { data: [] });
    mockUpsert('dashboards');
    mockUpsert('widgets');
    assignIdToLocalApp(appId);
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    await waitForWidget({ type: 'Note', index: 1 });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    expect(textBox).toBeInTheDocument();
    await userEvent.type(textBox, 'God is good', {
      // Because we are using fake timers, we must advance the time mannally
      // via the optional advanceTimers() callback to userEvent methods
      advanceTimers: (delay) => {
        jest.advanceTimersByTime(delay);
      }
    });
    await waitFor(() => {
      expect(supabase.from).toHaveBeenNthCalledWith(1, 'widgets');
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(1);
    });
  });

  it('should delete widget from server when deleted locally', async () => {
    mockSupabaseUser();
    mockSupabaseSession();
    mockSupabaseFrom();
    const appId = uuidv4();
    mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify({ ...appStateDefault, id: appId }) }]
    });
    mockSelect('widgets', { data: [] });
    mockDelete('widgets');
    assignIdToLocalApp(appId);
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    jest.useRealTimers();
    await waitForWidget({ type: 'Note', index: 1 });
    const widgetElem = await removeWidget({
      type: 'Note',
      index: 1,
      confirmRemove: true
    });
    await waitForElementToBeRemoved(widgetElem);
    jest.useFakeTimers();
    await waitFor(() => {
      expect(supabase.from).toHaveBeenNthCalledWith(1, 'widgets');
      expect(supabaseFromMocks.widgets.delete).toHaveBeenCalled();
    });
  });

  it('should not push on widget change if not signed in', async () => {
    mockSupabaseUser(null);
    mockSupabaseSession(null);
    mockSupabaseFrom();
    const appId = uuidv4();
    mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify({ ...appStateDefault, id: appId }) }]
    });
    mockSelect('widgets', { data: [] });
    mockUpsert('dashboards');
    mockUpsert('widgets');
    assignIdToLocalApp(appId);
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Sign Up/In' })
    ).toBeInTheDocument();
    await waitForWidget({ type: 'Note', index: 1 });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    expect(textBox).toBeInTheDocument();
    await userEvent.type(textBox, 'God is good', {
      advanceTimers: (delay) => {
        jest.advanceTimersByTime(delay);
      }
    });
    await waitFor(() => {
      expect(supabase.from).not.toHaveBeenCalledWith('widgets');
      expect(supabaseFromMocks.widgets.upsert).not.toHaveBeenCalled();
    });
  });

  it('should not pull latest dashboard if not signed in', async () => {
    mockSupabaseUser(null);
    mockSupabaseSession(null);
    mockSupabaseFrom();
    mockSelect('dashboards', { data: [] });
    mockSelect('widgets', { data: [] });
    assignIdToLocalApp(uuidv4());
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Sign Up/In' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(supabase.from).not.toHaveBeenCalled();
      expect(supabaseFromMocks.dashboards.select).not.toHaveBeenCalled();
      expect(supabaseFromMocks.widgets.select).not.toHaveBeenCalled();
    });
  });
});