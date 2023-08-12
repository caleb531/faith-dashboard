import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../app/page';
import { renderServerComponent } from './__utils__/renderServerComponent';
import { getAppData } from './__utils__/testUtils';

describe('Theme Switcher', () => {
  it('should close', async () => {
    await renderServerComponent(<Home />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Background Theme' })
    );
    expect(
      screen.getByRole('heading', { name: 'Change Theme' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close Modal' }));
    expect(
      screen.queryByRole('heading', { name: 'Change Theme' })
    ).not.toBeInTheDocument();
  });
  it('should change theme to photo theme', async () => {
    await renderServerComponent(<Home />);
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
    await renderServerComponent(<Home />);
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
