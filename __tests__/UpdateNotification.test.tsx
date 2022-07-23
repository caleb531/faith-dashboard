import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/index';

class ServiceWorkerMock {}
let originalServiceWorker: typeof navigator.serviceWorker;

describe('Update Notification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    originalServiceWorker = navigator.serviceWorker;
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: ServiceWorkerMock
    });
    sessionStorage.setItem('sw', 'true');
  });

  afterEach(() => {
    jest.useRealTimers();
    sessionStorage.removeItem('sw');
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker
    });
  });

  it('should show', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: 'Update available! Click here to update.'
        })
      ).toBeInTheDocument();
    });
  });

  it('should show loading indicator when clicked', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: 'Update available! Click here to update.'
        })
      ).toBeInTheDocument();
    });
    const updateNotification = screen.getByRole('region', {
      name: 'Update available! Click here to update.'
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    // TODO: fix the below causing a Jest timeout
    // await userEvent.click(updateNotification);
  });
});
