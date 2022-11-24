import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import { isSessionActive } from '../accountUtils';
import { supabase } from '../supabaseClient';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import appStateDefault from './appStateDefault';

function AppHeaderAccount() {
  const { isCurrentStep, stepProps } = useTutorialStep('sign-up');

  const [isShowingMenu, setIsShowingMenu] = useState(false);
  // The session will be loaded asynchronously and isomorphically, via a
  // useEffect() call later in this function; this is done to avoid SSR
  // mismatches (please see the hook below)
  const [session, setSession] = useState<Session | null>(null);
  const [authModalIsOpen, setSignInModalIsOpen] = useState(false);

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
    const newSession = (await supabase.auth.getSession()).data.session;
    if (session !== newSession) {
      setSession(newSession);
    }
  }
  useIsomorphicLayoutEffect(() => {
    updateSession();
  }, []);

  // Detect session change and re-render account header accordingly
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session);
      }
    });
    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  return session?.user && (await isSessionActive(session)) ? (
    <div className="app-header-account">
      <label
        className="app-header-account-label accessibility-only"
        htmlFor="app-header-account-button"
      >
        Your Account
      </label>
      <button
        type="button"
        className="app-header-account-button"
        onClick={() => setIsShowingMenu(!isShowingMenu)}
      >
        <img
          className="app-header-account-button-icon"
          src="/icons/account-light.svg"
          alt="Your Account"
          draggable="false"
        />
      </button>
      {isShowingMenu ? (
        <div className="app-header-account-menu">
          <div
            className="app-header-account-menu-overlay"
            onClick={() => setIsShowingMenu(false)}
          ></div>
          <menu className="app-header-account-menu-list">
            <li className="app-header-account-menu-list-item app-header-account-menu-list-item-user-info">
              <a data-disabled>
                <div className="app-header-account-menu-user-name">
                  {session.user.user_metadata.first_name}{' '}
                  {session.user.user_metadata.last_name}
                </div>
                <div className="app-header-account-menu-user-email">
                  {session.user.email}
                </div>
              </a>
            </li>
            <li className="app-header-account-menu-list-item app-header-account-menu-list-item-account-settings">
              <Link href="/account">Account Settings</Link>
            </li>
            <li
              className="app-header-account-menu-list-item app-header-account-menu-list-item-sign-out"
              onClick={signOut}
            >
              <a>Sign Out</a>
            </li>
          </menu>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="app-header-account">
      {isCurrentStep ? <TutorialStepTooltip /> : null}
      <button
        type="button"
        className="app-header-account-button app-header-control-button"
        onClick={() => setSignInModalIsOpen(true)}
        {...stepProps}
      >
        Sign Up/In
      </button>
      {authModalIsOpen ? (
        <AccountAuthFlow onCloseModal={onCloseSignInModal} />
      ) : null}
    </div>
  );
}

export default AppHeaderAccount;
