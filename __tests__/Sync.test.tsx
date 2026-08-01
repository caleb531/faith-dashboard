import Home from '@app/page';
import { getDefaultAppState } from '@components/app/appUtils';
import widgetSyncService from '@components/widgets/widgetSyncService';
import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
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
  mockConfirmOnce,
  waitForWidget
} from '@tests/__utils__/testUtils';
import { v4 as uuidv4 } from 'uuid';

describe('Sync functionality', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.useFakeTimers();
    user = userEvent.setup({
      advanceTimers: (delay) => jest.advanceTimersByTime(delay)
    });
  });

  afterEach(() => {
    jest.useRealTimers();
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
    await user.type(textBox, 'God is good');
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
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
    await waitForWidget({ type: 'Note', index: 1 });
    const widgetElem = screen.getAllByRole('article')[1];
    const confirm = mockConfirmOnce(() => true);
    await user.click(
      screen.getAllByRole('button', { name: 'Remove Widget' })[1]
    );
    expect(confirm).toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(250);
    });
    expect(widgetElem).not.toBeInTheDocument();
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
    await user.type(textBox, 'God is good');
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(supabaseFromMocks.widgets.upsert).not.toHaveBeenCalled();
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
    expect(supabase.from).not.toHaveBeenCalled();
    expect(supabaseFromMocks.dashboards.select).not.toHaveBeenCalled();
    expect(supabaseFromMocks.widgets.select).not.toHaveBeenCalled();
  });
});
