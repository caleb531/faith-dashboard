import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import Home from '../../pages/index';

describe('Homepage', function () {
  it('should render', function () {
    const { getByText } = render(<Home />);
    expect(getByText('Faith Dashboard')).toBeInTheDocument();
  });

  it('should render tutorial', function () {
    const { container } = render(<Home />);
    expect(container.querySelector('.tutorial-step-tooltip')).toContainHTML(
      'Welcome'
    );
  });
  it('should skip tutorial', function () {
    const { container } = render(<Home />);
    expect(
      container.querySelector('.tutorial-step-tooltip')
    ).toBeInTheDocument();
    const skipButton = container.querySelector(
      '.tutorial-step-tooltip-control.warning'
    );
    if (skipButton) {
      fireEvent.click(skipButton);
    }
    expect(
      container.querySelector('.tutorial-step-tooltip')
    ).not.toBeInTheDocument();
  });
});
