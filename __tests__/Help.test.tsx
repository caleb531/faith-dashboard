import Help from '@app/help/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

describe('Help page', () => {
  it('should render', async () => {
    await renderServerComponent(<Help />);
    expect(
      screen.getByRole('heading', { name: 'Help | Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
