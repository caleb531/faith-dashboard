import ForgotPassword from '@app/forgot-password/page';
import SignIn from '@app/sign-in/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { typeIntoFormFields } from '@tests/__utils__/testUtils';

describe('Forgot Password page', () => {
  it('should be accessible from Sign In page', async () => {
    await renderServerComponent(<SignIn />);
    expect(
      screen.getByRole('link', { name: 'Forgot Password?' })
    ).toBeInTheDocument();
  });

  it('should require all form fields to be populated', async () => {
    await renderServerComponent(<ForgotPassword />);
    await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.valueMissing',
      true
    );
  });

  it('should require valid email address', async () => {
    await renderServerComponent(<ForgotPassword />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });
});
