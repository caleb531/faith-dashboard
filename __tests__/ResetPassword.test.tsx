import ResetPassword from '@app/sign-up/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { populateFormFields } from '@tests/__utils__/testUtils';

describe('Reset Password page', () => {
  it('should validate that passwords are matching', async () => {
    await renderServerComponent(<ResetPassword />);
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
    await renderServerComponent(<ResetPassword />);
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
    await renderServerComponent(<ResetPassword />);
    const requiredFields = ['Password', 'Confirm Password'];
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });
});
