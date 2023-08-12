import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '../app/privacy-policy/page';

describe('Privacy Policy page', () => {
  it('should render', async () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole('heading', { name: 'Privacy Policy | Faith Dashboard' })
    ).toBeInTheDocument();
  });
});
