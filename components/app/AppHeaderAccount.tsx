import { Session } from '@supabase/supabase-js';
import React, { useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import { supabase } from '../supabaseClient';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

function AppHeaderAccount() {
  const [isShowingMenu, setIsShowingMenu] = useState(false);
  // The session will be loaded asynchronously and isomorphically, via a
  // useEffect() call later in this function; this is done to avoid SSR
  // mismatches (please see the hook below)
  const [session, setSession] = useState<Session | null>(null);
  const [authModalIsOpen, setSignInModalIsOpen] = useState(false);

  async function signOut() {
    const confirmation = confirm('Are you sure you want to sign out? This means syncing will stop working until you sign back in again.');
    if (!confirmation) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    console.log('error', error);
  }

  function onCloseSignInModal() {
    setSignInModalIsOpen(false);
  }

  // Update session asynchronously and isomorphically (so as to avoid any SSR
  // mismatch with the rendered page HTML); we use useIsomorphicLayoutEffect()
  // instead of useEffect() directly to minimize any possible page flicker
  useIsomorphicLayoutEffect(() => {
    setSession(supabase.auth.session());
  }, []);

  return session?.user ? (
    <div className="app-header-account">
      <label className="app-header-account-label accessibility-only" htmlFor="app-header-account-button">
         Your Account
      </label>
      <button
        type="button"
        className="app-header-account-button"
        onClick={() => setIsShowingMenu(!isShowingMenu)}>
        <img
        className="app-header-account-button-icon"
        src="icons/account-light.svg"
        alt=""
        draggable="false" />
      </button>
      {isShowingMenu ? (
        <div className="app-header-account-menu">
          <div
            className="app-header-account-menu-overlay"
            onClick={() => setIsShowingMenu(false)}>
          </div>
          <menu className="app-header-account-menu-list">
            <li
              className="app-header-account-menu-list-item app-header-account-menu-list-item-user-info"
              data-disabled>
                <div className="app-header-account-menu-user-name">
                  {session.user.user_metadata.first_name} {session.user.user_metadata.last_name}
                </div>
                <div className="app-header-account-menu-user-email">
                  {session.user.email}
                </div>
              </li>
            <li
              className="app-header-account-menu-list-item app-header-account-menu-list-item-sign-out"
              onClick={signOut}>
              Sign Out
            </li>
          </menu>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="app-header-account">
      <button
        type="button"
        className="app-header-account-button app-header-control-button"
        onClick={() => setSignInModalIsOpen(true)}>
        Sign Up/In
      </button>
      {authModalIsOpen ? (
        <AccountAuthFlow onCloseModal={onCloseSignInModal} />
      ) : null}
    </div>
  );
}

export default AppHeaderAccount;
