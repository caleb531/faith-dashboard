import PageNotFound from '@app/not-found';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

describe('Not Found page', () => {
  it('should render', async () => {
    await renderServerComponent(<PageNotFound />);
    expect(
      screen.getByRole('heading', { name: 'Page Not Found | Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
