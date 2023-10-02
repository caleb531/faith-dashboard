import Home from '@app/page';
import { getDefaultAppState } from '@components/app/appUtils';
import { Deferred } from '@components/deferred';
import widgetSyncService from '@components/widgets/widgetSyncService';
import '@testing-library/jest-dom';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dashboardToPullJson from '@tests/__json__/dashboardToPull.json';
import widgetToPullJson from '@tests/__json__/widgetToPull.json';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
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
  assignIdToLocalApp,
  removeWidget,
  waitForWidget
} from '@tests/__utils__/testUtils';
import { v4 as uuidv4 } from 'uuid';

const originalOnPush = widgetSyncService.onPush;
const originalBroadcastPush = widgetSyncService.broadcastPush;

describe('Sync functionality', () => {
  afterEach(() => {
    vi.resetAllMocks();
    widgetSyncService.onPush = originalOnPush;
    widgetSyncService.broadcastPush = originalBroadcastPush;
  });

  it('should pull latest dashboard on page load (when signed in)', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', {
      data: [{ raw_data: dashboardToPullJson }]
    });
    mockSupabaseSelect('widgets', {
      data: [{ raw_data: widgetToPullJson }]
    });
    assignIdToLocalApp(uuidv4());
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
    expect(screen.getByText('Evening')).toBeInTheDocument();
    expect(screen.queryByText('Shore')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getAllByRole('textbox', { name: 'Note Text' })[0]
      ).toHaveProperty('value', 'God is always with you');
    });
  });

  it('should push local dashboard if nothing to pull', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', {
      data: []
    });
    mockSupabaseSelect('widgets', { data: [] });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    assignIdToLocalApp(uuidv4());
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('dashboards');
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(2);
      expect(supabaseFromMocks.widgets.select).not.toHaveBeenCalled();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(4);
    });
  });

  it('should pull remote dashboard matching local dashboard ID', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', {
      data: [{ raw_data: dashboardToPullJson }]
    });
    mockSupabaseSelect('widgets', {
      data: [{ raw_data: widgetToPullJson }]
    });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    assignIdToLocalApp(uuidv4());
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('dashboards');
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalled();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(0);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(0);
    });
    expect(screen.getByText('Evening')).toBeInTheDocument();
    expect(screen.queryByText('Shore')).not.toBeInTheDocument();
  });

  it('should pull most recent dashboard for user if the local dashboard was not found on server', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelectOnce('dashboards', {
      data: []
    });
    mockSupabaseSelectOnce('dashboards', {
      data: [{ raw_data: dashboardToPullJson }]
    });
    mockSupabaseSelectOnce('widgets', {
      data: [{ raw_data: widgetToPullJson }]
    });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    assignIdToLocalApp(uuidv4());
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('dashboards');
      expect(supabaseFromMocks.dashboards.select).toHaveBeenCalledTimes(2);
      expect(supabaseFromMocks.widgets.select).toHaveBeenCalled();
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(0);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(0);
    });
    expect(screen.getByText('Evening')).toBeInTheDocument();
    expect(screen.queryByText('Shore')).not.toBeInTheDocument();
  });

  it('should run push listeners even if event was broadcast before listeners were bound', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', {
      data: []
    });
    mockSupabaseSelect('widgets', { data: [] });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    // Force the widgetSyncService.onPush listener to be bound
    // *after* the push event has already been broadcast, as this is the
    // scenario we are testing for; that is, we want to ensure the widgets are
    // still pushed even if the push event listeners are bound too late
    const promiseCache: Record<string, Deferred<void>> = {};
    widgetSyncService.onPush = (widgetId) => {
      if (!promiseCache[widgetId]) {
        promiseCache[widgetId] = new Deferred();
      }
      return promiseCache[widgetId].promise.then(() => {
        return originalOnPush(widgetId);
      });
    };
    widgetSyncService.broadcastPush = (widgetId) => {
      originalBroadcastPush(widgetId);
      promiseCache[widgetId]?.resolve();
    };
    assignIdToLocalApp(uuidv4());
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('dashboards');
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(4);
    });
  });

  it('should push when widget changes', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    const appId = uuidv4();
    mockSupabaseSelect('dashboards', {
      data: [{ raw_data: { ...getDefaultAppState(), id: appId } }]
    });
    mockSupabaseSelect('widgets', { data: [] });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    assignIdToLocalApp(appId);
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await waitForWidget({ type: 'Note', index: 1 });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    expect(textBox).toBeInTheDocument();
    await userEvent.type(textBox, 'God is good');
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('widgets');
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(1);
    });
  });

  it('should delete widget from server when deleted locally', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    const appId = uuidv4();
    mockSupabaseSelect('dashboards', {
      data: [{ raw_data: { ...getDefaultAppState(), id: appId } }]
    });
    mockSupabaseSelect('widgets', { data: [] });
    mockSupabaseDelete('widgets');
    assignIdToLocalApp(appId);
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    vi.useRealTimers();
    await waitForWidget({ type: 'Note', index: 1 });
    const widgetElem = await removeWidget({
      type: 'Note',
      index: 1,
      confirmRemove: true
    });
    await waitForElementToBeRemoved(widgetElem);
    await waitFor(() => {
      expect(supabaseFromMocks.widgets.delete).toHaveBeenCalled();
    });
  });

  it('should not push on widget change if not signed in', async () => {
    await mockSupabaseUser(null);
    await mockSupabaseSession(null);
    mockSupabaseFrom();
    const appId = uuidv4();
    mockSupabaseSelect('dashboards', {
      data: [{ raw_data: { ...getDefaultAppState(), id: appId } }]
    });
    mockSupabaseSelect('widgets', { data: [] });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    assignIdToLocalApp(appId);
    await renderServerComponent(<Home />);
    expect(
      screen.getByRole('button', { name: 'Sign Up/In' })
    ).toBeInTheDocument();
    await waitForWidget({ type: 'Note', index: 1 });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    expect(textBox).toBeInTheDocument();
    await userEvent.type(textBox, 'God is good');
    await waitFor(() => {
      expect(supabaseFromMocks.widgets.upsert).not.toHaveBeenCalled();
    });
  });

  it('should not pull latest dashboard if not signed in', async () => {
    await mockSupabaseUser(null);
    await mockSupabaseSession(null);
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', { data: [] });
    mockSupabaseSelect('widgets', { data: [] });
    assignIdToLocalApp(uuidv4());
    await renderServerComponent(<Home />);
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
