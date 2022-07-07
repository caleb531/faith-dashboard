import '@testing-library/jest-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    jest.useRealTimers();
  });

  it('should pull latest dashboard on page load (when signed in)', async () => {
    const userStub = mockSupabaseUser();
    const sessionStub = mockSupabaseSession();
    const supabaseDbStub = mockSupabaseFrom();
    const dashboardSelectMock = mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify(dashboardToPullJson) }]
    });
    const widgetSelectMock = mockSelect('widgets', {
      data: [{ raw_data: JSON.stringify(widgetToPullJson) }]
    });
    assignIdToLocalApp(uuidv4());
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
    expect(
      screen.getAllByRole('textbox', { name: 'Note Text' })[0]
    ).toHaveProperty('value', 'God is always with you');
    dashboardSelectMock.mockRestore();
    widgetSelectMock.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should push local dashboard if nothing to pull', async () => {
    const userStub = mockSupabaseUser();
    const sessionStub = mockSupabaseSession();
    const supabaseDbStub = mockSupabaseFrom();
    const dashboardSelectMock = mockSelect('dashboards', {
      data: []
    });
    const widgetSelectMock = mockSelect('widgets', { data: [] });
    const dashboardUpsertMock = mockUpsert('dashboards');
    const widgetUpsertMock = mockUpsert('widgets');
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
    dashboardSelectMock.mockRestore();
    widgetSelectMock.mockRestore();
    dashboardUpsertMock.mockRestore();
    widgetUpsertMock.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should push when widget changes', async () => {
    const userStub = mockSupabaseUser();
    const sessionStub = mockSupabaseSession();
    const supabaseDbStub = mockSupabaseFrom();
    const appId = uuidv4();
    const dashboardSelectMock = mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify({ ...appStateDefault, id: appId }) }]
    });
    const widgetSelectMock = mockSelect('widgets', { data: [] });
    const dashboardUpsertMock = mockUpsert('dashboards');
    const widgetUpsertMock = mockUpsert('widgets');
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
    dashboardSelectMock.mockRestore();
    widgetSelectMock.mockRestore();
    dashboardUpsertMock.mockRestore();
    widgetUpsertMock.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should delete widget from server when deleted locally', async () => {
    const userStub = mockSupabaseUser();
    const sessionStub = mockSupabaseSession();
    const supabaseDbStub = mockSupabaseFrom();
    const appId = uuidv4();
    const dashboardSelectMock = mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify({ ...appStateDefault, id: appId }) }]
    });
    const widgetSelectMock = mockSelect('widgets', { data: [] });
    const widgetDeleteMock = mockDelete('widgets');
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
    dashboardSelectMock.mockRestore();
    widgetSelectMock.mockRestore();
    widgetDeleteMock.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should not push on widget change if not signed in', async () => {
    const userStub = mockSupabaseUser(null);
    const sessionStub = mockSupabaseSession(null);
    const supabaseDbStub = mockSupabaseFrom();
    const appId = uuidv4();
    const dashboardSelectMock = mockSelect('dashboards', {
      data: [{ raw_data: JSON.stringify({ ...appStateDefault, id: appId }) }]
    });
    const widgetSelectMock = mockSelect('widgets', { data: [] });
    const dashboardUpsertMock = mockUpsert('dashboards');
    const widgetUpsertMock = mockUpsert('widgets');
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
    dashboardSelectMock.mockRestore();
    widgetSelectMock.mockRestore();
    dashboardUpsertMock.mockRestore();
    widgetUpsertMock.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });

  it('should not pull latest dashboard if not signed in', async () => {
    const userStub = mockSupabaseUser(null);
    const sessionStub = mockSupabaseSession(null);
    const supabaseDbStub = mockSupabaseFrom();
    const dashboardSelectMock = mockSelect('dashboards', { data: [] });
    const widgetSelectMock = mockSelect('widgets', { data: [] });
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
    dashboardSelectMock.mockRestore();
    widgetSelectMock.mockRestore();
    supabaseDbStub.mockRestore();
    sessionStub.mockRestore();
    userStub.mockRestore();
  });
});
