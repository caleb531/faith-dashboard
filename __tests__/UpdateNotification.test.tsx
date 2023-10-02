import Home from '@app/page';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  mockLocationObject,
  restoreLocationObject
} from './__utils__/testUtils';

class ServiceWorkerMock {}
let originalServiceWorker: typeof navigator.serviceWorker;
const updateAvailableMessage = 'Update available! Click here to update.';

describe('Update Notification', () => {
  beforeEach(() => {
    mockLocationObject();
    // Mock navigator.serviceWorker
    originalServiceWorker = navigator.serviceWorker;
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: ServiceWorkerMock
    });
    sessionStorage.setItem('sw', 'true');
  });

  afterEach(() => {
    sessionStorage.removeItem('sw');
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker
    });
    restoreLocationObject();
  });

  it('should show', async () => {
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: updateAvailableMessage
        })
      ).toBeInTheDocument();
    });
  });

  it('should show loading indicator when clicked', async () => {
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: updateAvailableMessage
        })
      ).toBeInTheDocument();
    });
    const updateNotification = screen.getByRole('region', {
      name: updateAvailableMessage
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    await userEvent.click(updateNotification);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('should reload page when service worker is updated', async () => {
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: updateAvailableMessage
        })
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole('region', {
        name: updateAvailableMessage
      })
    );
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
