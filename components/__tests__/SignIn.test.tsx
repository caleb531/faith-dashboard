import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages';
import SignIn from '../../pages/sign-in';
import { supabase } from '../supabaseClient';
import useVerifyCaptcha from '../useVerifyCaptcha';
import { populateFormFields } from './__utils__/test-utils';

describe('Sign In page', () => {
  it('should be accessible from app header', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should require all form fields to be populated', async () => {
    render(<SignIn />);
    const requiredFields = ['Email', 'Password'];
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should require valid email address', async () => {
    render(<SignIn />);
    await populateFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should require CAPTCHA to be completed', async () => {
    render(<SignIn />);
    await populateFormFields({
      Email: 'notanemail',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(
      screen.getByText('Error: Please complete the CAPTCHA')
    ).toBeInTheDocument();
  });

  it('should attempt to sign in', async () => {
    (useVerifyCaptcha as jest.Mock).mockImplementationOnce(() => {
      return [
        () => 'token',
        () => {
          // noop
        }
      ];
    });
    jest.spyOn(supabase.auth, 'signIn');
    render(<SignIn />);
    await populateFormFields({
      Email: 'caleb@example.com',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(supabase.auth.signIn).toHaveBeenCalled();
  });
});
