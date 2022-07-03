import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import SignIn from '../../pages/sign-in';
import SignUp from '../../pages/sign-up';
import { populateFormFields } from './__utils__/test-utils';

describe('Auth flow', () => {
  it('should access Sign Up page from button', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should validate that new account email addresses are matching', async () => {
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

  it('should validate that new account email addresses are not matching', async () => {
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

  it('should validate that new account passwords are matching', async () => {
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

  it('should validate that new account passwords are not matching', async () => {
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

  it('should require all fields to be populated on Sign Up page', async () => {
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

  it('should require all fields to be populated on Sign In page', async () => {
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

  it('should require valid email addresses on Sign Up page', async () => {
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

  it('should require valid email address on Sign In page', async () => {
    render(<SignIn />);
    await populateFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should require CAPTCHA to be completed on Sign Up page', async () => {
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

  it('should require CAPTCHA to be completed on Sign In page', async () => {
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
});
