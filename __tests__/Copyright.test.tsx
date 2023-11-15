import Copyright from '@app/copyright/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

describe('Copyright page', () => {
  it('should render', async () => {
    await renderServerComponent(<Copyright />);
    expect(
      await screen.findByRole('heading', {
        name: 'Copyright | Faith Dashboard'
      })
    ).toBeInTheDocument();
  });
});
