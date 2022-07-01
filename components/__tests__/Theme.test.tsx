import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';

describe('Theme', () => {
  it('should change to photo theme', async () => {
    render(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Worship' }));
    expect(document.body).toHaveClass('theme-worship');
  });
  it('should change to color theme', async () => {
    render(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Teal' }));
    expect(document.body).toHaveClass('theme-teal');
  });
  it('should persist', async () => {
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
