import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import { getSession, isSessionActive } from '../accountUtils';
import { supabase } from '../supabaseClient';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import AppHeaderMenu from './AppHeaderMenu';
import appStateDefault from './appStateDefault';

function AppHeaderAccount() {
  const { isCurrentStep, stepProps } = useTutorialStep('sign-up');

  const [isShowingMenu, setIsShowingMenu] = useState(false);
  // The session will be loaded asynchronously and isomorphically, via a
  // useEffect() call later in this function; this is done to avoid SSR
  // mismatches (please see the hook below)
  const [session, setSession] = useState<Session | null>(null);
  const [isUserActive, setIsUserActive] = useState(false);
  const [authModalIsOpen, setSignInModalIsOpen] = useState(false);

  function importDashboard() {
    console.log('import dashboard');
    setIsShowingMenu(false);
  }
  function exportDashboard() {
    console.log('export dashboard');
    setIsShowingMenu(false);
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
        'faith-dashboard-app',
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

  // Update session asynchronously and isomorphically (so as to avoid any SSR
  // mismatch with the rendered page HTML); we use useIsomorphicLayoutEffect()
  // instead of useEffect() directly to minimize any possible page flicker
  async function updateSession() {
    const newSession = await getSession();
    // Do not re-render if login state hasn't changed
    if (session !== newSession) {
      setSession(newSession);
    }
    isSessionActive(newSession).then((newIsUserActive) => {
      // Do not re-render if login state hasn't changed
      if (newIsUserActive !== isUserActive) {
        setIsUserActive(newIsUserActive);
      }
    });
  }
  useEffect(() => {
    updateSession();
    // This useEffect() can only run a finite number of times because it would
    // otherwise cause an infinite loop due to the dependencies always changing
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  // Detect session change and re-render account header accordingly
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const isSignedIn = session && isUserActive;

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
              onClick: importDashboard,
              content: 'Import Dashboard'
            },
            {
              key: 'export-dashboard',
              onClick: exportDashboard,
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
    </div>
  );
}

export default AppHeaderAccount;
