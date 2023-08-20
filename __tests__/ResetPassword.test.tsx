import ResetPassword from '@app/reset-password/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { populateFormFields } from '@tests/__utils__/testUtils';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';

describe('Reset Password page', () => {
  it('should validate that passwords are matching', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<ResetPassword />);
    await populateFormFields({
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStaple'
    });
    expect(screen.getByLabelText('Confirm New Password')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that passwords are not matching', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<ResetPassword />);
    await populateFormFields({
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStale'
    });
    expect(screen.getByLabelText('Confirm New Password')).toHaveProperty(
      'validationMessage',
      'Passwords must match'
    );
  });

  it('should require all form fields to be populated', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<ResetPassword />);
    const requiredFields = ['New Password', 'Confirm New Password'];
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset Password' })
    );
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });
});
