import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

describe('Home', () => {
  it('should render', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: 'Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
