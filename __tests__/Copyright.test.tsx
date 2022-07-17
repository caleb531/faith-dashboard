import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Copyright from '../pages/copyright';

describe('Copyright page', () => {
  it('should render', async () => {
    render(<Copyright />);
    expect(
      screen.getByRole('heading', { name: 'Copyright | Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
