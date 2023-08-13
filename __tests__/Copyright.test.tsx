import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import Copyright from '../app/copyright/page';
import { renderServerComponent } from './__utils__/renderServerComponent';

describe('Copyright page', () => {
  it('should render', async () => {
    await renderServerComponent(<Copyright />);
    expect(
      screen.getByRole('heading', { name: 'Copyright | Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
