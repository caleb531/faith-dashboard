import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { omit } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import Home from '../pages';
import dashboardToExport from './__json__/dashboardToExport.json';
import exportedDashboard from './__json__/exportedDashboard.json';
import FileReaderMock from './__mocks__/FileReaderMock';
import { assignIdToLocalApp, getAppData } from './__utils__/testUtils';

describe('Import/Export functionality', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should import dashboard', async () => {
    assignIdToLocalApp(uuidv4());
    const originalApp = getAppData();
    render(<Home />);
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    const fileContents = JSON.stringify(exportedDashboard);
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'exportedDashboard.json')] }
      });
    });
    expect(screen.queryByText('Evening')).toBeInTheDocument();
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

  it('should not import dashboard from empty JSON file', async () => {
    let errorMessage;
    render(<Home />);
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    jest.spyOn(window, 'alert').mockImplementation((message) => {
      errorMessage = message;
    });
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    const fileContents = '';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'blankFile.json')] }
      });
    });
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    expect(errorMessage).toEqual(
      'Dashboard file is not in the correct format. Please try another file.'
    );
  });

  it('should not import dashboard from malformed JSON file', async () => {
    let errorMessage;
    render(<Home />);
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    jest.spyOn(window, 'alert').mockImplementation((message) => {
      errorMessage = message;
    });
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    const fileContents = 'not_valid_json';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'blankFile.json')] }
      });
    });
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    expect(errorMessage).toEqual('Unexpected token o in JSON at position 1');
  });

  it('should not trigger import if files are missing', async () => {
    render(<Home />);
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    const fileContents = '';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [] }
      });
    });
    expect(screen.queryByText('Shore')).toBeInTheDocument();
  });

  it('should export dashboard', async () => {
    let exportedBlob: Blob | undefined;
    localStorage.setItem(
      'faith-dashboard-app',
      JSON.stringify(dashboardToExport)
    );
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    jest.spyOn(URL, 'createObjectURL').mockImplementation((blob: Blob) => {
      exportedBlob = blob;
      // Doesn't matter what this value is
      return '';
    });
    await userEvent.click(
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
          ['id', 'isSettingsOpen']
        );
      })
    });
  });
});
