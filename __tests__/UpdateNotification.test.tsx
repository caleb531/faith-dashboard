import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import Home from '../pages/index';

class ServiceWorkerMock {}
let originalServiceWorker: typeof navigator.serviceWorker;
const updateAvailableMessage = 'Update available! Click here to update.';

const originalLocationObject = window.location;

describe('Update Notification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // @ts-ignore (see <https://stackoverflow.com/a/61649798/560642>)
    delete window.location;
    // Mock location.reload()
    window.location = {
      ...originalLocationObject,
      reload: jest.fn(),
      assign: jest.fn()
    };
    // Mock navigator.serviceWorker
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
    window.location = originalLocationObject;
  });

  it('should show', async () => {
    render(<Home />);
    // The waitForElementToBeRemoved() call is necessary to squash act(...)
    // warnings; it is unknown why the other tests do not have this issue
    // (source:
    // https://github.com/testing-library/react-testing-library/issues/1051#issuecomment-1212955270)
    await waitForElementToBeRemoved(screen.getByText('Loading...'));
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: updateAvailableMessage
        })
      ).toBeInTheDocument();
    });
  });

  it('should show loading indicator when clicked', async () => {
    render(<Home />);
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
    // For some reason, using userEvent.click() for the below causes Jest to
    // timeout; so we are using fireEvent instead
    fireEvent.click(updateNotification);
    expect(screen.queryByText('Loading...')).toBeInTheDocument();
  });
  it('should reload page when service worker is updated', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: updateAvailableMessage
        })
      ).toBeInTheDocument();
    });
    fireEvent.click(
      screen.getByRole('region', {
        name: updateAvailableMessage
      })
    );
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
