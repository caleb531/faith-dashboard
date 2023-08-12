'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useContext, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import { isSessionActive } from '../accountUtils';
import { exportDashboard, readDashboardFileToJSON } from '../importExportUtils';
import { getAppStorageKey } from '../storageUtils';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import AppContext from './AppContext';
import AppHeaderMenu from './AppHeaderMenu';
import SessionContext from './SessionContext';
import appStateDefault from './appStateDefault';

function AppHeaderAccount() {
  const supabase = createClientComponentClient();
  const { isCurrentStep, stepProps } = useTutorialStep('sign-up');
  const { dispatchToApp } = useContext(AppContext);

  // The session will be loaded asynchronously and isomorphically, via a
  // useEffect() call later in this function; this is done to avoid SSR
  // mismatches (please see the hook below)
  const session = useContext(SessionContext);
  const isUserActive = isSessionActive();
  const [authModalIsOpen, setSignInModalIsOpen] = useState(false);
  const isSignedIn = session && isUserActive;

  async function handleFileInputChange(
    event: React.FormEvent<HTMLInputElement>
  ) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput?.files?.length) {
      return;
    }
    try {
      const newApp = await readDashboardFileToJSON(fileInput.files[0]);
      const confirmation = confirm(
        'This will overwrite your current dashboard. Are you sure you want to continue?'
      );
      if (!isSignedIn || confirmation) {
        dispatchToApp({ type: 'replaceApp', payload: newApp });
      }
    } catch (error) {
      alert(
        error instanceof Error && error.message
          ? error.message
          : 'An error occurred while uploading the file. Please try again.'
      );
    } finally {
      // Always reset file input for any subsequent imports
      fileInput.value = '';
    }
  }
  async function handleExportDashboard() {
    exportDashboard();
  }

  async function signOut() {
    const confirmation = confirm(
      'Are you sure you want to sign out? This means syncing will stop working until you sign back in again.'
    );
    if (!confirmation) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('error', error);
    } else {
      // Revert to the default dashboard state when signing out
      localStorage.clear();
      // Do not show tutorial again
      localStorage.setItem(
        getAppStorageKey(),
        JSON.stringify({ ...appStateDefault, shouldShowTutorial: false })
      );
      const queryStr = new URLSearchParams({
        message:
          'You have been signed out. Your dashboard will be waiting for you when you sign in again.'
      }).toString();
      window.location.hash = `#${queryStr}`;
      window.location.reload();
    }
  }

  function onCloseSignInModal() {
    setSignInModalIsOpen(false);
  }

  return (
    <div className="app-header-account">
      {!isSignedIn && (
        <div className="app-header-account-section">
          {isCurrentStep ? <TutorialStepTooltip /> : null}
          <button
            type="button"
            className="app-header-menu-button app-header-control-button"
            onClick={() => setSignInModalIsOpen(true)}
            {...stepProps}
          >
            Sign Up/In
          </button>
          {authModalIsOpen ? (
            <AccountAuthFlow onCloseModal={onCloseSignInModal} />
          ) : null}
        </div>
      )}
      <div className="app-header-account-section">
        <AppHeaderMenu
          label={isSignedIn ? 'Your Account' : 'Tools'}
          icon={isSignedIn ? 'account-light' : 'menu-light'}
          items={[
            isSignedIn && {
              key: 'user-info',
              content: (
                <a data-disabled data-key="user-info">
                  <div data-field="user-name">
                    {session.user.user_metadata.first_name}{' '}
                    {session.user.user_metadata.last_name}
                  </div>
                  <div data-field="user-email">{session.user.email}</div>
                </a>
              )
            },
            isSignedIn && {
              key: 'account',
              href: '/account',
              content: 'Account Settings'
            },
            {
              key: 'import-dashboard',
              content: (
                <label htmlFor="app-import-input">
                  <a tabIndex={0}>Import Dashboard</a>
                </label>
              )
            },
            {
              key: 'export-dashboard',
              onClick: handleExportDashboard,
              content: 'Export Dashboard'
            },
            isSignedIn && {
              key: 'sign-out',
              onClick: signOut,
              content: 'Sign Out'
            }
          ]}
        />
      </div>
      <input
        id="app-import-input"
        name="app_import_input"
        type="file"
        accept=".json"
        className="app-import-input accessibility-only"
        onChange={handleFileInputChange}
      />
    </div>
  );
}

export default AppHeaderAccount;
