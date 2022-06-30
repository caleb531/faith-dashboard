import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import Home from '../../pages/index';

describe('Tutorial', function () {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render', function () {
    const { container } = render(<Home />);
    expect(container.querySelector('.tutorial-step-tooltip')).toContainHTML(
      'Welcome'
    );
  });

  it('should skip', function () {
    const { container, getByText } = render(<Home />);
    expect(
      container.querySelector('.tutorial-step-tooltip')
    ).toBeInTheDocument();
    fireEvent.click(getByText('Skip Tutorial'));
    expect(
      container.querySelector('.tutorial-step-tooltip')
    ).not.toBeInTheDocument();
  });

  it('should advance tutorial', function () {
    const { container, getByText } = render(<Home />);
    expect(
      container.querySelector('.tutorial-step-tooltip')
    ).toBeInTheDocument();
    fireEvent.click(getByText('Get Started'));
    expect(getByText('Next')).toBeInTheDocument();
    expect(container.querySelector('.tutorial-step-tooltip')).toContainHTML(
      'This is your dashboard'
    );
  });
});
