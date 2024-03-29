import Home from '@app/page';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import dashboardToExport from '@tests/__json__/dashboardToExport.json';
import exportedDashboard from '@tests/__json__/exportedDashboard.json';
import FileReaderMock from '@tests/__mocks__/FileReaderMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  mockSupabaseFrom,
  mockSupabaseSelect,
  mockSupabaseSession,
  mockSupabaseUpsert,
  mockSupabaseUser,
  supabaseFromMocks
} from '@tests/__utils__/supabaseMockUtils';
import {
  assignIdToLocalApp,
  getAppData,
  mockAlertOnce,
  mockConfirmOnce,
  setAppData
} from '@tests/__utils__/testUtils';
import { omit } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import userEventFakeTimers from './__utils__/userEventFakeTimers';

describe('Import/Export functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it('should import dashboard', async () => {
    mockConfirmOnce(() => true);
    assignIdToLocalApp(uuidv4());
    const originalApp = getAppData();
    await renderServerComponent(<Home />);
    expect(screen.getByText('Shore')).toBeInTheDocument();
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Tools' })
    );
    const fileContents = JSON.stringify(exportedDashboard);
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'exportedDashboard.json')] }
      });
    });
    expect(screen.getByText('Evening')).toBeInTheDocument();
    // App IDs should not match
    const newApp = getAppData();
    expect(newApp.id).not.toEqual(originalApp.id);
    // Widgets IDs should also not match
    const originalWidgetIds = new Set(
      originalApp.widgets.map((widget) => widget.id)
    );
    newApp.widgets.forEach((newWidget) => {
      expect(originalWidgetIds.has(newWidget.id)).toBeFalsy();
    });
    expect(originalApp.widgets).toHaveLength(4);
  });

  it('should display confirmation and push dashboard/widgets if user is signed in', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', { data: [] });
    mockSupabaseUpsert('dashboards');
    mockSupabaseUpsert('widgets');
    mockConfirmOnce(() => true);
    await renderServerComponent(<Home />);
    expect(screen.getByText('Shore')).toBeInTheDocument();
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Your Account' })
    );
    const fileContents = JSON.stringify(exportedDashboard);
    FileReaderMock._fileData = fileContents;
    supabaseFromMocks.dashboards.upsert.mockClear();
    supabaseFromMocks.widgets.upsert.mockClear();
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'exportedDashboard.json')] }
      });
    });
    expect(screen.getByText('Evening')).toBeInTheDocument();
    await waitFor(() => {
      expect(supabaseFromMocks.dashboards.upsert).toHaveBeenCalledTimes(1);
      expect(supabaseFromMocks.widgets.upsert).toHaveBeenCalledTimes(1);
    });
  });

  it('should not import dashboard is user denied confirmation', async () => {
    mockSupabaseFrom();
    mockSupabaseSelect('dashboards', { data: [] });
    mockConfirmOnce(() => false);
    await renderServerComponent(<Home />);
    expect(screen.getByText('Shore')).toBeInTheDocument();
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Tools' })
    );
    const fileContents = JSON.stringify(exportedDashboard);
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'exportedDashboard.json')] }
      });
    });
    expect(screen.getByText('Shore')).toBeInTheDocument();
  });

  it('should not import dashboard from empty JSON file', async () => {
    let errorMessage;
    await renderServerComponent(<Home />);
    expect(screen.getByText('Shore')).toBeInTheDocument();
    mockAlertOnce((message) => {
      errorMessage = message;
    });
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Tools' })
    );
    const fileContents = '';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'blankFile.json')] }
      });
    });
    expect(screen.getByText('Shore')).toBeInTheDocument();
    expect(errorMessage).toEqual(
      'Dashboard file is not in the correct format. Please try another file.'
    );
  });

  it('should not import dashboard from malformed JSON file', async () => {
    let errorMessage;
    await renderServerComponent(<Home />);
    expect(screen.getByText('Shore')).toBeInTheDocument();
    mockAlertOnce((message) => {
      errorMessage = message;
    });
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Tools' })
    );
    const fileContents = 'not_valid_json';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'blankFile.json')] }
      });
    });
    expect(screen.getByText('Shore')).toBeInTheDocument();
    expect(errorMessage).toEqual('Unexpected token o in JSON at position 1');
  });

  it('should not trigger import if files are missing', async () => {
    await renderServerComponent(<Home />);
    expect(screen.getByText('Shore')).toBeInTheDocument();
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Tools' })
    );
    const fileContents = '';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [] }
      });
    });
    expect(screen.getByText('Shore')).toBeInTheDocument();
  });

  it('should export dashboard', async () => {
    let exportedBlob: Blob | undefined;
    setAppData(dashboardToExport);
    await renderServerComponent(<Home />);
    await userEventFakeTimers.click(
      screen.getByRole('button', { name: 'Tools' })
    );
    jest.spyOn(URL, 'createObjectURL').mockImplementation((blob: Blob) => {
      exportedBlob = blob;
      // Doesn't matter what this value is
      return '';
    });
    await userEventFakeTimers.click(
      screen.getByRole('link', { name: 'Export Dashboard' })
    );
    const blobText = (await exportedBlob?.text()) ?? null;
    expect(JSON.parse(String(blobText))).toEqual({
      ...omit(dashboardToExport, ['id']),
      widgets: dashboardToExport.widgets.map((widget) => {
        return omit(
          {
            ...widget
          },
          ['id']
        );
      })
    });
  });
});
