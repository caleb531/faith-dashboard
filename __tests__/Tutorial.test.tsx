import '@testing-library/jest-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../app/page';
import tutorialSteps from '../components/tutorial/tutorialSteps';
import { getAppData } from './__utils__/testUtils';

describe('Tutorial', () => {
  it('should render', async () => {
    render(<Home />);
    // The waitForElementToBeRemoved() call is necessary to squash act(...)
    // warnings; it is unknown why the other tests do not have this issue
    // (source:
    // https://github.com/testing-library/react-testing-library/issues/1051#issuecomment-1212955270)
    await waitForElementToBeRemoved(screen.getByText('Loading...'));
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it('should skip', async () => {
    render(<Home />);
    expect(getAppData()).toHaveProperty('shouldShowTutorial', true);
    const skipButton = screen.getByRole('button', { name: 'Skip Tutorial' });
    expect(skipButton).toBeInTheDocument();
    await userEvent.click(skipButton);
    expect(
      // getByText() throws an error if the element does not exist in the DOM,
      // so we need to use queryByText() instead
      screen.queryByRole('button', { name: 'Skip Tutorial' })
    ).not.toBeInTheDocument();
    expect(getAppData()).toHaveProperty('shouldShowTutorial', false);
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
