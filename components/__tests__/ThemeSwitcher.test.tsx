import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import { getAppData } from './__utils__/test-utils';

describe('Theme Switcher', () => {
  it('should change theme to photo theme', async () => {
    render(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Worship' }));
    expect(document.body).toHaveClass('theme-worship');
    expect(getAppData()).toHaveProperty('theme', 'worship');
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
    expect(getAppData()).toHaveProperty('theme', 'teal');
  });
});
