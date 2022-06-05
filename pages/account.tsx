import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import AuthForm from '../components/account/AuthForm';
import AuthFormField from '../components/account/AuthFormField';
import serializeForm from '../components/account/serializeForm';
import { isSessionActive } from '../components/accountUtils';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';
import useFormFieldMatcher from '../components/useFormFieldMatcher';

type Props = {
  pageTitle: string
};

function AccountSettings({ pageTitle }: Props) {

  const [user, setUser] = useState<User | null>(null);
  const [emailFieldProps, confirmEmailFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Emails must match'
  });
  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });

  function updateUserData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = serializeForm(event.currentTarget);
    if (fields.email) {
      return supabase.auth.update({ email: fields.email });
    } else if (fields.password) {
      return supabase.auth.update({ password: fields.password });
    } else {
      return supabase.auth.update({ data: fields });
    }
  }

  // TODO
  function deleteAccount() {
    return Promise.resolve({
      user: null,
      error: null
    });
  }

  // Load the user data asynchronously and isomorphically
  useEffect(() => {
    if (isSessionActive()) {
      setUser(supabase.auth.user());
    } else {
      window.location.assign('/sign-in');
    }
  }, [user]);

  return (
    <LandingPage heading={pageTitle}>
      {user ?
      <>
        <AuthForm
          onSubmit={updateUserData}
          submitLabel="Save Details"
          submittingLabel="Saving..."
          successLabel="Saved!">

          <h2>Your Details</h2>

          <AuthFormField
            className="account-auth-form-input"
            type="text"
            id="account-settings-form-first-name"
            name="first_name"
            placeholder="First Name"
            defaultValue={user.user_metadata.first_name}
            required
            />

          <AuthFormField
            className="account-auth-form-input"
            type="text"
            id="account-settings-form-last-name"
            name="last_name"
            placeholder="Last Name"
            defaultValue={user.user_metadata.last_name}
            required
            />

        </AuthForm>

        <AuthForm
          onSubmit={updateUserData}
          submitLabel="Change Email"
          submittingLabel="Changing..."
          successLabel="Email Changed!">

          <h2>Change Email</h2>

          <p>Your email is currently <span className="landing-page-em">{user.email}</span>.</p>

          <AuthFormField
            className="account-auth-form-input"
            type="email"
            id="account-settings-form-email"
            name="email"
            placeholder="New Email"
            required
            {...emailFieldProps}
            />
          <AuthFormField
            className="account-auth-form-input"
            type="email"
            id="account-settings-form-confirm-email"
            name="confirm_email"
            placeholder="Confirm New Email"
            required
            {...confirmEmailFieldProps}
            />

        </AuthForm>

        <AuthForm
          onSubmit={updateUserData}
          submitLabel="Change Password"
          submittingLabel="Changing..."
          successLabel="Password Changed!">

          <h2>Change Password</h2>

          <AuthFormField
            className="account-auth-form-input"
            type="password"
            id="account-settings-form-old-password"
            name="old_password"
            placeholder="Old Password"
            required
            />
          <AuthFormField
            className="account-auth-form-input"
            type="password"
            id="account-settings-form-password"
            name="password"
            placeholder="New Password"
            required
            {...passwordFieldProps}
            />
          <AuthFormField
            className="account-auth-form-input"
            type="password"
            id="account-settings-form-confirm-password"
            name="confirm_password"
            placeholder="Confirm New Password"
            required
            {...confirmPasswordFieldProps}
            />

        </AuthForm>

        <h2>Delete Account</h2>

        <p><span className="landing-page-em">Please note:</span> this will delete your account, dashboards, and all of your widget data.<br />This cannot be undone.</p>

        <AuthForm
          onSubmit={deleteAccount}
          submitLabel="Delete Account"
          submittingLabel="Deleting..."
          successLabel="Account Deleted">
        </AuthForm>

      </> : <>
        <p>You are not signed in. Redirecting you to the Sign In page...</p>
      </>}
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: 'Account Settings | Faith Dashboard',
      pageDescription: 'Account settings for Faith Dashboard, your one place for anything and everything that inspires your faith.'
    }
  };
}

export default AccountSettings;
