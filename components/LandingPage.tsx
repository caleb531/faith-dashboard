import React from 'react';
import useLandingPage from './useLandingPage';

type Props = {
  heading: string,
  altLink?: {
    title: string,
    href: string
  }
  children: JSX.Element | (JSX.Element | null)[] | null,
};

function LandingPage({ heading, altLink, children }: Props) {

  useLandingPage();

  return (
    <article className="landing-page">
      <section className="landing-page-section">
        <header>
          <h1>{heading}</h1>
          <a href="/" className="landing-page-control landing-page-home-control">
            <img
              className="landing-page-control-icon landing-page-home-control-icon"
              src="icons/home-dark.svg"
              alt="Go to Dashboard"
              draggable="false" />
          </a>
          {altLink ? (
          <a href={altLink.href} className="landing-page-control landing-page-alt-control">{altLink.title}</a>
          ) : null}
        </header>
        {children}
      </section>
    </article>
  );
}

export default LandingPage;
