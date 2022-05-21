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
        <a href="/" className="landing-page-control landing-page-home-control">
          <img
            className="landing-page-control-icon landing-page-home-control-icon"
            src="icons/home-dark.svg"
            alt="Go to Dashboard"
            draggable="false" />
        </a>
        {children}
      </section>
    </article>
  );
}

export default LandingPage;
