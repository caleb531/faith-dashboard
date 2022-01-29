import React from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';

const AppFooter = React.memo(function AppFooter() {

  const { isCurrentStep, stepProps } = useTutorialStep('help');

  return (
    <footer className="app-footer">
      <small className="app-footer-dedication">By <a href="https://calebevans.me/">Caleb Evans</a>. Dedicated to Christ our Lord.</small>
      <div className="app-footer-links">
        <span className="app-footer-help-container">
        {isCurrentStep ? <TutorialMessage /> : null}
        <a href="help/" {...stepProps}>Help</a>
        </span>
        &nbsp;&middot;&nbsp;
        <a href="copyright/">Copyright</a>
      </div>
    </footer>
  );

});

export default AppFooter;
