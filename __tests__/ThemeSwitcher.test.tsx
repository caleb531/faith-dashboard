import Home from '@app/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { getAppData } from '@tests/__utils__/testUtils';

describe('Theme Switcher', () => {
  it('should close', async () => {
    await renderServerComponent(<Home />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Background Theme' })
    );
    expect(
      await screen.findByRole('heading', { name: 'Change Theme' })
    ).toBeInTheDocument();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Close Modal' })
    );
    expect(
      screen.queryByRole('heading', { name: 'Change Theme' })
    ).not.toBeInTheDocument();
  });
  it('should change theme to photo theme', async () => {
    await renderServerComponent(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Worship' })
    );
    expect(document.body).toHaveClass('theme-worship');
    expect(getAppData()).toHaveProperty('theme', 'worship');
  });
  it('should change theme to color theme', async () => {
    await renderServerComponent(<Home />);
    // Assert default theme
    expect(document.body).toHaveClass('theme-shore');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Background Theme' })
    );
    await userEvent.click(await screen.findByRole('button', { name: 'Teal' }));
    expect(document.body).toHaveClass('theme-teal');
    expect(getAppData()).toHaveProperty('theme', 'teal');
  });
});
