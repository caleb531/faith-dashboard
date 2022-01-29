import React from 'react';
import GettingStartedMessage from '../getting-started/GettingStartedMessage';
import useGettingStartedStep from '../getting-started/useGettingStartedStep';

const AppFooter = React.memo(function AppFooter() {

  const { isCurrentStep, stepProps } = useGettingStartedStep('help');

  return (
    <footer className="app-footer">
      <small className="app-footer-dedication">By <a href="https://calebevans.me/">Caleb Evans</a>. Dedicated to Christ our Lord</small>
      &nbsp;&middot;&nbsp;
      <span className="app-footer-help-container">
      {isCurrentStep ? <GettingStartedMessage /> : null}
      <a href="help/" {...stepProps}>Help</a>
      </span>
      &nbsp;&middot;&nbsp;
      <a href="copyright/">Copyright</a>
    </footer>
  );

});

export default AppFooter;
