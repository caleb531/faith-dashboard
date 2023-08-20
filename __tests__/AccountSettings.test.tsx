import AccountSettings from '@app/account/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

describe('Account Settings page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render', async () => {
    await renderServerComponent(<AccountSettings />);
    expect(
      screen.getByRole('heading', {
        name: 'Account Settings | Faith Dashboard'
      })
    ).toBeInTheDocument();
  });
});
