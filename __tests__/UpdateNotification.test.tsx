import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
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
  it('should show', () => {
    render(<Home />);
  });
});
