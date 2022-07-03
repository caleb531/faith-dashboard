import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import SignIn from '../../pages/sign-in';
import SignUp from '../../pages/sign-up';

describe('Auth flow', () => {
  it('should access Sign Up page from button', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should validate that new account email addresses are matching', async () => {
    render(<SignUp />);
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(
      screen.getByLabelText('Confirm Email'),
      'john@example.com'
    );
    expect(screen.getByLabelText('Confirm Email')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that new account email addresses are not matching', async () => {
    render(<SignUp />);
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(
      screen.getByLabelText('Confirm Email'),
      'john@example.con'
    );
    expect(screen.getByLabelText('Confirm Email')).toHaveProperty(
      'validationMessage',
      'Emails must match'
    );
  });

  it('should validate that new account passwords are matching', async () => {
    render(<SignUp />);
    await userEvent.type(
      screen.getByLabelText('Password'),
      'CorrectHorseBatteryStaple'
    );
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'CorrectHorseBatteryStaple'
    );
    expect(screen.getByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that new account passwords are not matching', async () => {
    render(<SignUp />);
    await userEvent.type(
      screen.getByLabelText('Password'),
      'CorrectHorseBatteryStaple'
    );
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'CorrectHorseBatteryStale'
    );
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
});
