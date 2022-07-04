import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import SignUp from '../../pages/sign-up';
import { populateFormFields } from './__utils__/test-utils';

describe('Sign Up page', () => {
  it('should be accessible from app header', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('should validate that email addresses are matching', async () => {
    render(<SignUp />);
    await populateFormFields({
      Email: 'john@example.com',
      'Confirm Email': 'john@example.com'
    });
    expect(screen.getByLabelText('Confirm Email')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that email addresses are not matching', async () => {
    render(<SignUp />);
    await populateFormFields({
      Email: 'john@example.com',
      'Confirm Email': 'john@example.con'
    });
    expect(screen.getByLabelText('Confirm Email')).toHaveProperty(
      'validationMessage',
      'Emails must match'
    );
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
      'Confirm Email',
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
      Email: 'notanemail',
      'Confirm Email': 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
    expect(screen.getByLabelText('Confirm Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should require CAPTCHA to be completed', async () => {
    render(<SignUp />);
    await populateFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'notanemail',
      'Confirm Email': 'notanemail',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(
      screen.getByText('Error: Please complete the CAPTCHA')
    ).toBeInTheDocument();
  });
});
