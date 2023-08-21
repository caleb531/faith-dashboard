import Home from '@app/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

describe('App Notification', () => {
  it('should display the specified message from the URL hash', async () => {
    window.location.hash = '#message=This+is+my+message';
    await renderServerComponent(<Home />);
    expect(screen.getByText('This is my message')).toBeInTheDocument();
  });

  it('should display the specified error message from the URL hash', async () => {
    window.location.hash = '#error_description=There+was+an+error';
    await renderServerComponent(<Home />);
    expect(screen.getByText('There was an error')).toBeInTheDocument();
  });

  it('should be dismissable via the modal Close button', async () => {
    window.location.hash = '#message=This+is+my+message';
    await renderServerComponent(<Home />);
    expect(screen.getByText('This is my message')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close Modal' }));
    expect(window.location.hash).toEqual('');
    expect(screen.queryByText('This is my message')).not.toBeInTheDocument();
  });
});
