import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import Home from '../../pages/index';

describe('Tutorial', function () {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render', function () {
    const { getByTestId } = render(<Home />);
    expect(getByTestId('tutorial-step-tooltip')).toContainHTML('Welcome');
  });

  it('should skip', function () {
    const { getByTestId, getByText } = render(<Home />);
    expect(getByTestId('tutorial-step-tooltip')).toBeInTheDocument();
    const skipButton = getByText('Skip Tutorial');
    expect(skipButton).toBeInTheDocument();
    fireEvent.click(skipButton);
    // TODO: get this assertion passing
    expect(getByTestId('tutorial-step-tooltip')).not.toBeInTheDocument();
  });

  it('should advance tutorial', function () {
    const { getByTestId, getByText } = render(<Home />);
    expect(getByTestId('tutorial-step-tooltip')).toBeInTheDocument();
    fireEvent.click(getByText('Get Started'));
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByTestId('tutorial-step-tooltip')).toContainHTML(
      'This is your dashboard'
    );
  });
});
