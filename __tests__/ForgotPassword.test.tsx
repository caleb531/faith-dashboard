import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPassword from '../pages/forgot-password';
import SignIn from '../pages/sign-in';
import { populateFormFields } from './__utils__/testUtils';

describe('Forgot Password page', () => {
  it('should be accessible from Sign In page', async () => {
    render(<SignIn />);
    expect(
      screen.getByRole('link', { name: 'Forgot Password?' })
    ).toBeInTheDocument();
  });

  it('should require all form fields to be populated', async () => {
    render(<ForgotPassword />);
    await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.valueMissing',
      true
    );
  });

  it('should require valid email address', async () => {
    render(<ForgotPassword />);
    await populateFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });
});
