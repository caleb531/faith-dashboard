import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify({}));
  });

  it('should render', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: 'Faith Dashboard' })
    ).toBeInTheDocument();
  });

  it('should change theme to photo theme', async () => {
    render(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Worship' }));
    expect(document.body).toHaveClass('theme-worship');
  });
  it('should change theme to color theme', async () => {
    render(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Teal' }));
    expect(document.body).toHaveClass('theme-teal');
  });
  it('should persist theme', async () => {
    render(<Home />);
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Evening' }));
    expect(
      JSON.parse(localStorage.getItem('faith-dashboard-app') || '{}')
    ).toHaveProperty('theme', 'evening');
  });
});
