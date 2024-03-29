'use client';
import Link from 'next/link';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppFooter() {
  const { isCurrentStep, stepProps } = useTutorialStep('help');

  return (
    <footer className="app-footer">
      <small className="app-footer-dedication">
        By <a href="https://calebevans.me/">Caleb Evans</a>. Dedicated to Christ
        our Lord.
      </small>
      <ul className="app-footer-links">
        <li className="app-footer-link">
          <a href="https://twitter.com/faithdashboard">@faithdashboard</a>
        </li>
        <li className="app-footer-link-help">
          {/* The inner container is so that the tutorial bubble message can be properly positioned (because the :after on the parent skews its own width) */}
          <span className="app-footer-link-help-inner" {...stepProps}>
            {isCurrentStep ? <TutorialStepTooltip /> : null}
            <Link href="/help">Help</Link>
          </span>
        </li>
        <li className="app-footer-link">
          <Link href="/privacy-policy">Privacy</Link>
        </li>
        <li className="app-footer-link">
          <Link href="/copyright">Copyright</Link>
        </li>
      </ul>
    </footer>
  );
}

export default AppFooter;
