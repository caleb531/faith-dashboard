import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../pages';

describe('Import/Export functionality', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should import dashboard', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }));
    await fireEvent.change(screen.getByLabelText('Import Dashboard'), {
      target: {
        files: [
          /* TODO: populate this array with a polyfilled File object */
        ]
      }
    });
  });
});
