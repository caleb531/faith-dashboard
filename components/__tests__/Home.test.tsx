import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

describe('Homepage', function () {
  it('should render', function () {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: 'Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
