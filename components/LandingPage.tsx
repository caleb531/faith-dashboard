import React from 'react';
import useLandingPage from './useLandingPage';

type Props = {
  children: JSX.Element | (JSX.Element | null)[] | null,
};

function LandingPage({ children }: Props) {

  useLandingPage();

  return (
    <article className="landing-page">
      <section className="landing-page-section">
        <a href="/" className="landing-page-control landing-page-back-control">
          <img
            className="landing-page-control-icon landing-page-back-control-icon"
            src="icons/back-dark.svg"
            alt="Go Back"
            draggable="false" />
        </a>
        {children}
      </section>
    </article>
  );
}

export default LandingPage;
