import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../../pages/index';

describe('Tutorial', function () {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render', function () {
    render(<Home />);
    expect(screen.getByTestId('tutorial-step-tooltip')).toContainHTML(
      'Welcome'
    );
  });

  it('should skip', function () {
    render(<Home />);
    expect(screen.getByTestId('tutorial-step-tooltip')).toBeInTheDocument();
    const skipButton = screen.getByText('Skip Tutorial');
    expect(skipButton).toBeInTheDocument();
    fireEvent.click(skipButton);
    expect(
      // getByTestId() throws an error if the element does not exist in the
      // DOM, so we need to use queryByTestId() instead
      screen.queryByTestId('tutorial-step-tooltip')
    ).not.toBeInTheDocument();
  });

  it('should advance tutorial', function () {
    render(<Home />);
    expect(screen.getByTestId('tutorial-step-tooltip')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Get Started'));
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByTestId('tutorial-step-tooltip')).toContainHTML(
      'This is your dashboard'
    );
  });
});
