'use client';
import Button from '@components/reusable/Button';
import { useContext, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import AppContext from './AppContext';
import SessionContext from './SessionContext';

// Show account access or a quiet connection status in the same header control
function AppHeaderAuthControls() {
  const { isCurrentStep, stepProps } = useTutorialStep('sign-up');
  const { dispatchToApp } = useContext(AppContext);
  const [isDashboardManagerVisible, setIsDashboardManagerVisible] =
    useState(false);

  // Read verified account state, including background connection attempts
  const { isSignedIn, authStatus, isConnecting } = useContext(SessionContext);
  // Unknown authentication can't open sign-in, even after retries are exhausted
  const isUnavailable = authStatus === 'unavailable';
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  function onCloseAuthModal() {
    setAuthModalIsOpen(false);
  }

  return (
    !isSignedIn && (
      <div className="app-header-global-menu-section">
        {isCurrentStep && !isUnavailable ? <TutorialStepTooltip /> : null}
        <Button
          className="app-header-menu-button app-header-control-button"
          aria-disabled={isUnavailable || undefined}
          aria-live="polite"
          title={
            isUnavailable
              ? isConnecting
                ? 'Connecting...'
                : 'Unable to connect to your account. Your local dashboard is still available.'
              : undefined
          }
          onClick={isUnavailable ? undefined : () => setAuthModalIsOpen(true)}
          {...stepProps}
        >
          {isUnavailable
            ? isConnecting
              ? 'Connecting...'
              : 'Offline'
            : 'Sign Up/In'}
        </Button>
        {authModalIsOpen ? (
          <AccountAuthFlow onClose={onCloseAuthModal} />
        ) : null}
      </div>
    )
  );
}

export default AppHeaderAuthControls;
