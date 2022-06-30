import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../../pages/index';
import tutorialSteps from '../tutorial/tutorialSteps';

describe('Tutorial', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it('should skip', () => {
    render(<Home />);
    const skipButton = screen.getByRole('button', { name: 'Skip Tutorial' });
    expect(skipButton).toBeInTheDocument();
    fireEvent.click(skipButton);
    expect(
      // getByText() throws an error if the element does not exist in the DOM,
      // so we need to use queryByText() instead
      screen.queryByRole('button', { name: 'Skip Tutorial' })
    ).not.toBeInTheDocument();
  });

  it('should advance', () => {
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Get Started' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get Started' }));
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText(/This is your dashboard/)).toBeInTheDocument();
  });
  it('should complete all defined steps', () => {
    render(<Home />);
    const advanceButtonLabelPattern = /Get Started|Next|Done/;
    tutorialSteps.forEach(() => {
      fireEvent.click(
        screen.getByRole('button', { name: advanceButtonLabelPattern })
      );
    });
    expect(
      screen.queryByRole('button', { name: advanceButtonLabelPattern })
    ).not.toBeInTheDocument();
  });
});
