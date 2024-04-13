'use client';
import Button from '@components/reusable/Button';
import { useContext, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import AppContext from './AppContext';
import SessionContext from './SessionContext';

function AppHeaderAuthControls() {
  const { isCurrentStep, stepProps } = useTutorialStep('sign-up');
  const { dispatchToApp } = useContext(AppContext);
  const [isDashboardManagerVisible, setIsDashboardManagerVisible] =
    useState(false);

  // The session will be loaded asynchronously and isomorphically, via a
  // useEffect() call later in this function; this is done to avoid SSR
  // mismatches (please see the hook below)
  const { isSignedIn } = useContext(SessionContext);
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  function onCloseAuthModal() {
    setAuthModalIsOpen(false);
  }

  return (
    !isSignedIn && (
      <div className="app-header-global-menu-section">
        {isCurrentStep ? <TutorialStepTooltip /> : null}
        <Button
          className="app-header-menu-button app-header-control-button"
          onClick={() => setAuthModalIsOpen(true)}
          {...stepProps}
        >
          Sign Up/In
        </Button>
        {authModalIsOpen ? (
          <AccountAuthFlow onClose={onCloseAuthModal} />
        ) : null}
      </div>
    )
  );
}

export default AppHeaderAuthControls;
