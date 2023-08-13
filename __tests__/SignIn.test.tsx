import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '../__tests__/__mocks__/supabaseAuthHelpersMock';
import SignIn from '../app/sign-in/page';
import { mockCaptchaSuccessOnce } from './__mocks__/captchaMockUtils';
import { renderServerComponent } from './__utils__/renderServerComponent';
import { mockSupabaseApiResponse } from './__utils__/supabaseMockUtils';
import { populateFormFields } from './__utils__/testUtils';
describe('Sign In page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should require all form fields to be populated', async () => {
    await renderServerComponent(<SignIn />);
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
    await renderServerComponent(<SignIn />);
    await populateFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should sign in successfully', async () => {
    mockCaptchaSuccessOnce('mytoken');
    mockSupabaseApiResponse(supabase.auth, 'signInWithPassword', {
      user: {
        email: 'caleb@example.com',
        user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
      },
      session: {},
      error: null
    });
    await renderServerComponent(<SignIn />);
    await populateFormFields({
      Email: 'caleb@example.com',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'caleb@example.com',
      password: 'CorrectHorseBatteryStaple'
    });
  });

  it('should error if honey pot field is populated', async () => {
    mockCaptchaSuccessOnce('mytoken');
    await renderServerComponent(<SignIn />);
    await populateFormFields({
      Email: 'kaleb@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Please leave this field blank': 'abc123'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(
      screen.getByText('Cannot submit form; please try again')
    ).toBeInTheDocument();
  });

  it('should handle errors from server', async () => {
    mockCaptchaSuccessOnce('mytoken');
    mockSupabaseApiResponse(supabase.auth, 'signInWithPassword', {
      user: null,
      session: null,
      error: {
        message: 'Invalid login credentials'
      }
    });
    await renderServerComponent(<SignIn />);
    await populateFormFields({
      Email: 'kaleb@example.com',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
    expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
  });
});
