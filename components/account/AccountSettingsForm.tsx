'use client';
import AuthForm from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import SessionContext from '@components/app/SessionContext';
import useFormFieldMatcher from '@components/useFormFieldMatcher';
import useTimeout from '@components/useTimeout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext } from 'react';

function AccountSettingsForm() {
  const supabase = createClientComponentClient();
  const { user } = useContext(SessionContext);
  const [emailFieldProps, confirmEmailFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Emails must match'
  });
  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });
  const setPageReloadTimeout = useTimeout();
  // The delay (in milliseconds) to wait after a sucessful form submission
  // before reloading the page (only applies to certain forms)
  const reloadDelay = 1000;

  function reloadPage() {
    setPageReloadTimeout(() => {
      window.location.reload();
    }, reloadDelay);
  }

  return user ? (
    <div className="account-settings-container">
      <AuthForm
        action="/auth/update-user-name"
        submitLabel="Save Details"
        submittingLabel="Saving..."
        successLabel="Saved!"
        useAjax
      >
        <h2>Your Details</h2>

        <AuthFormField
          type="text"
          id="account-settings-form-first-name"
          name="first_name"
          placeholder="First Name"
          defaultValue={user.user_metadata.first_name}
          required
        />

        <AuthFormField
          type="text"
          id="account-settings-form-last-name"
          name="last_name"
          placeholder="Last Name"
          defaultValue={user.user_metadata.last_name}
          required
        />
      </AuthForm>

      {user.new_email ? (
        <AuthForm
          action="/auth/cancel-email-change"
          onSuccess={reloadPage}
          submitLabel="Cancel Email Change"
          submittingLabel="Submitting..."
          successLabel="Email Change Canceled!"
          useAjax
        >
          <h2>Change Email</h2>

          <p>
            Your email is currently{' '}
            <span className="landing-page-em">{user.email}</span>.
          </p>

          {user.new_email ? (
            <p>
              You have an invite currently pending for{' '}
              <span className="landing-page-em">{user.new_email}</span>. Please
              check your email.
            </p>
          ) : null}
        </AuthForm>
      ) : (
        <AuthForm
          action="/auth/request-email-change"
          onSuccess={reloadPage}
          submitLabel="Change Email"
          submittingLabel="Submitting..."
          successLabel="Almost done! Check your email to confirm the change"
          useAjax
        >
          <h2>Change Email</h2>

          <p>
            Your email is currently{' '}
            <span className="landing-page-em">{user.email}</span>.
          </p>

          <AuthFormField
            type="email"
            id="account-settings-form-email"
            name="email"
            placeholder="New Email"
            required
            {...emailFieldProps}
          />
          <AuthFormField
            type="email"
            id="account-settings-form-confirm-email"
            name="confirm_email"
            placeholder="Confirm New Email"
            required
            {...confirmEmailFieldProps}
          />
        </AuthForm>
      )}

      <AuthForm
        action="/auth/change-password"
        submitLabel="Change Password"
        submittingLabel="Changing..."
        successLabel="Password Changed!"
        useAjax
      >
        <h2>Change Password</h2>

        <AuthFormField
          type="password"
          id="account-settings-form-old-password"
          name="current_password"
          placeholder="Current Password"
          required
        />
        <AuthFormField
          type="password"
          id="account-settings-form-new-password"
          name="new_password"
          placeholder="New Password"
          required
          {...passwordFieldProps}
        />
        <AuthFormField
          type="password"
          id="account-settings-form-confirm-new-password"
          name="confirm_new_password"
          placeholder="Confirm New Password"
          required
          {...confirmPasswordFieldProps}
        />
      </AuthForm>

      <h2>Delete Account</h2>

      <p>
        Please contact{' '}
        <a href="mailto:support@faithdashboard.com?subject=Delete%20My%20Account">
          support@faithdashboard.com
        </a>{' '}
        to permanently delete your account.
      </p>
    </div>
  ) : (
    <div className="account-settings-container">
      <p>You are not signed in. Redirecting you to the Sign In page...</p>
    </div>
  );
}

export default AccountSettingsForm;
