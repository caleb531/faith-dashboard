import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '../components/supabaseClient';
import SignUp from '../pages/sign-up';
import {
  mockCaptchaFailOnce,
  mockCaptchaSuccessOnce
} from './__mocks__/captchaMockUtils';
import { mockSupabaseApiResponse } from './__mocks__/supabaseMockUtils';
import { populateFormFields } from './__utils__/testUtils';

describe('Sign Up page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should validate that passwords are matching', async () => {
    render(<SignUp />);
    await populateFormFields({
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    expect(screen.getByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that passwords are not matching', async () => {
    render(<SignUp />);
    await populateFormFields({
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStale'
    });
    expect(screen.getByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      'Passwords must match'
    );
  });

  it('should require all form fields to be populated', async () => {
    render(<SignUp />);
    const requiredFields = [
      'First Name',
      'Last Name',
      'Email',
      'Password',
      'Confirm Password'
    ];
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should require valid email addresses', async () => {
    render(<SignUp />);
    await populateFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should require CAPTCHA to be completed', async () => {
    mockCaptchaFailOnce();
    render(<SignUp />);
    await populateFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(
      screen.getByText('Error: Please complete the CAPTCHA')
    ).toBeInTheDocument();
  });

  it('should create account successfully', async () => {
    mockCaptchaSuccessOnce('mytoken');
    const signUpStub = mockSupabaseApiResponse(supabase.auth, 'signUp', {
      user: {
        email: 'john@example.com',
        user_metadata: { first_name: 'John', last_name: 'Doe' }
      },
      session: {},
      error: null
    });
    render(<SignUp />);
    await populateFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(supabase.auth.signUp).toHaveBeenCalledWith(
      {
        email: 'john@example.com',
        password: 'CorrectHorseBatteryStaple'
      },
      {
        captchaToken: 'mytoken',
        data: {
          first_name: 'John',
          last_name: 'Doe'
        }
      }
    );
  });

  it('should handle errors from server', async () => {
    mockCaptchaSuccessOnce('mytoken');
    const signUpStub = mockSupabaseApiResponse(supabase.auth, 'signUp', {
      user: null,
      session: null,
      error: {
        message: 'User already exists'
      }
    });
    render(<SignUp />);
    await populateFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('User already exists')).toBeInTheDocument();
  });
});
