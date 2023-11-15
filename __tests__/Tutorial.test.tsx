import Home from '@app/page';
import tutorialSteps from '@components/tutorial/tutorialSteps';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { getAppData } from '@tests/__utils__/testUtils';

describe('Tutorial', () => {
  it('should render', async () => {
    await renderServerComponent(<Home />);
    expect(await screen.findByText(/Welcome/)).toBeInTheDocument();
  });

  it('should skip', async () => {
    await renderServerComponent(<Home />);
    const skipButton = await screen.findByRole('button', {
      name: 'Skip Tutorial'
    });
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
    await renderServerComponent(<Home />);
    expect(
      await screen.findByRole('button', { name: 'Get Started' })
    ).toBeInTheDocument();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Get Started' })
    );
    expect(
      await screen.findByRole('button', { name: 'Next' })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/This is your dashboard/)
    ).toBeInTheDocument();
  });
  it('should complete all defined steps', async () => {
    await renderServerComponent(<Home />);
    const advanceButtonLabelPattern = /Get Started|Next|Done/;
    for (const _step of tutorialSteps) {
      await userEvent.click(
        await screen.findByRole('button', { name: advanceButtonLabelPattern })
      );
    }
    expect(
      screen.queryByRole('button', { name: advanceButtonLabelPattern })
    ).not.toBeInTheDocument();
  });
});
