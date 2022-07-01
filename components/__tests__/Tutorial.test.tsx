import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import tutorialSteps from '../tutorial/tutorialSteps';

describe('Tutorial', () => {
  it('should render', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it('should skip', async () => {
    render(<Home />);
    const skipButton = screen.getByRole('button', { name: 'Skip Tutorial' });
    expect(skipButton).toBeInTheDocument();
    await userEvent.click(skipButton);
    expect(
      // getByText() throws an error if the element does not exist in the DOM,
      // so we need to use queryByText() instead
      screen.queryByRole('button', { name: 'Skip Tutorial' })
    ).not.toBeInTheDocument();
  });

  it('should advance', async () => {
    render(<Home />);
    expect(
      screen.getByRole('button', { name: 'Get Started' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Get Started' }));
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText(/This is your dashboard/)).toBeInTheDocument();
  });
  it('should complete all defined steps', async () => {
    render(<Home />);
    const advanceButtonLabelPattern = /Get Started|Next|Done/;
    for (const step of tutorialSteps) {
      await userEvent.click(
        screen.getByRole('button', { name: advanceButtonLabelPattern })
      );
    }
    expect(
      screen.queryByRole('button', { name: advanceButtonLabelPattern })
    ).not.toBeInTheDocument();
  });
});
