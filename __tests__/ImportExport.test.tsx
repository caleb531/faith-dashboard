import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import Home from '../pages';
import exportedDashboard from './__json__/exportedDashboard.json';
import FileReaderMock from './__mocks__/FileReaderMock';
import { assignIdToLocalApp, getCurrentAppId } from './__utils__/testUtils';

describe('Import/Export functionality', () => {
  beforeEach(() => {
    jest.spyOn(window, 'FileReader').mockImplementation(() => {
      return new FileReaderMock() as FileReader;
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should import dashboard', async () => {
    assignIdToLocalApp(uuidv4());
    const originalAppId = getCurrentAppId();
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
    const newAppId = getCurrentAppId();
    expect(newAppId).not.toEqual(originalAppId);
  });

  it('should not import dashboard from empty JSON file', async () => {
    render(<Home />);
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    const fileContents = '';
    FileReaderMock._fileData = fileContents;
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'blankFile.json')] }
      });
    });
    expect(screen.queryByText('Shore')).toBeInTheDocument();
  });
});
