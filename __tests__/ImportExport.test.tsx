import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../pages';
import exportedDashboard from './__json__/exportedDashboard.json';
import FileReaderMock from './__mocks__/FileReaderMock';

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
    render(<Home />);
    expect(screen.queryByText('Shore')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    const fileContents = JSON.stringify(exportedDashboard);
    FileReaderMock._fileData = fileContents;
    await act(() => {
      fireEvent.change(screen.getByLabelText('Import Dashboard'), {
        target: { files: [new File([fileContents], 'exportedDashboard.json')] }
      });
    });
    expect(screen.queryByText('Evening')).toBeInTheDocument();
  });
});
