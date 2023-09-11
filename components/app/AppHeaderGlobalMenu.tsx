'use client';
import { useContext, useState } from 'react';
import { exportDashboard } from '../importExportUtils';
import { getAppStorageKey } from '../storageUtils';
import AppContext from './AppContext';
import AppHeaderMenu from './AppHeaderMenu';
import AppImportInput from './AppImportInput';
import AppImportTrigger from './AppImportTrigger';
import DashboardManager from './DashboardManager';
import SessionContext from './SessionContext';
import { AppState } from './app.types';
import { getDefaultAppState } from './appUtils';

function AppHeaderGlobalMenu() {
  const { dispatchToApp } = useContext(AppContext);
  const [isDashboardManagerVisible, setIsDashboardManagerVisible] =
    useState(false);

  const { user, isSignedIn } = useContext(SessionContext);

  async function handleExportDashboard() {
    exportDashboard();
  }

  function onImportSuccess(importedApp: AppState) {
    dispatchToApp({ type: 'replaceApp', payload: importedApp });
  }

  async function signOut() {
    const confirmation = confirm(
      'Are you sure you want to sign out? This means syncing will stop working until you sign back in again.'
    );
    if (!confirmation) {
      return;
    }
    const { error } = await (
      await fetch('/auth/sign-out', { method: 'POST' })
    ).json();
    if (error) {
      console.log('error', error);
      const queryStr = new URLSearchParams({
        message: 'Sorry, there was an error signing you out.'
      }).toString();
      window.location.hash = `#${queryStr}`;
      window.location.reload();
    } else {
      // Revert to the default dashboard state when signing out
      localStorage.clear();
      // Do not show tutorial again
      localStorage.setItem(
        getAppStorageKey(),
        JSON.stringify({ ...getDefaultAppState(), shouldShowTutorial: false })
      );
      const queryStr = new URLSearchParams({
        message:
          'You have been signed out. Your dashboard will be waiting for you when you sign in again.'
      }).toString();
      window.location.href = `/#${queryStr}`;
      window.location.reload();
    }
  }

  return (
    <>
      <AppHeaderMenu
        label={isSignedIn ? 'Your Account' : 'Tools'}
        icon={isSignedIn ? 'account-light' : 'menu-light'}
        items={[
          isSignedIn &&
            user && {
              key: 'user-info',
              content: (
                <a data-disabled data-key="user-info">
                  <div data-field="user-name">
                    {user.user_metadata.first_name}{' '}
                    {user.user_metadata.last_name}
                  </div>
                  <div data-field="user-email">{user.email}</div>
                </a>
              )
            },
          isSignedIn && {
            key: 'dashboards',
            onClick: () => {
              setIsDashboardManagerVisible(true);
            },
            content: 'My Dashboards'
          },
          {
            key: 'import-dashboard',
            content: (
              <AppImportTrigger inputId="app-global-menu-import-input">
                <a tabIndex={0}>Import Dashboard</a>
              </AppImportTrigger>
            )
          },
          {
            key: 'export-dashboard',
            onClick: handleExportDashboard,
            content: 'Export Dashboard'
          },
          isSignedIn && {
            key: 'account',
            href: '/account',
            content: 'Account Settings'
          },
          {
            key: 'help',
            href: '/help',
            content: 'Help & Support'
          },
          isSignedIn && {
            key: 'sign-out',
            onClick: signOut,
            content: 'Sign Out'
          }
        ]}
      />
      {isDashboardManagerVisible ? (
        <DashboardManager
          onClose={() => {
            setIsDashboardManagerVisible(false);
          }}
        />
      ) : null}
      <AppImportInput
        id="app-global-menu-import-input"
        onImportSuccess={onImportSuccess}
      />
    </>
  );
}

export default AppHeaderGlobalMenu;
