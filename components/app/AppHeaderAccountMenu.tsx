import React, { useEffect, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import { supabase } from '../supabaseClient';

function AppHeaderAccountMenu() {
  const [user, setUser] = useState(supabase.auth.user());
  const [authModalIsOpen, setSignInModalIsOpen] = useState(false);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    console.log('error', error);
  }

  function onCloseSignInModal() {
    setSignInModalIsOpen(false);
  }

  // Re-render the view when the user signs in or out
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return user ? (
    <div className="app-header-account-menu">
      <label className="app-header-account-menu-label accessibility-only" htmlFor="app-header-account-menu-button">
         Your Account
      </label>
      <button
        type="button"
        className="app-header-account-menu-button"
        onClick={signOut}>
        <img
        className="app-header-account-menu-button-icon"
        src="icons/account-light.svg"
        alt=""
        draggable="false" />
      </button>
    </div>
  ) : (
    <div className="app-header-account-menu">
      <button
        type="button"
        className="app-header-account-menu-button"
        onClick={() => setSignInModalIsOpen(true)}>
        Sign Up/In
      </button>
      {authModalIsOpen ? (
        <AccountAuthFlow onCloseModal={onCloseSignInModal} />
      ) : null}
    </div>
  );
}

export default AppHeaderAccountMenu;
