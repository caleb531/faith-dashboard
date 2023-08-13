import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import PrivacyPolicy from '../app/privacy-policy/page';
import { renderServerComponent } from './__utils__/renderServerComponent';

describe('Privacy Policy page', () => {
  it('should render', async () => {
    await renderServerComponent(<PrivacyPolicy />);
    expect(
      screen.getByRole('heading', { name: 'Privacy Policy | Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
