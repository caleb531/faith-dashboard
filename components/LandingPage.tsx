import React from 'react';
import AppHeader from './app/AppHeader';
import useApp from './app/useApp';

type Props = {
  heading: string,
  altLink?: {
    title: string,
    href: string
  }
  children: JSX.Element | (JSX.Element | null)[] | null,
};

function LandingPage({ heading, altLink, children }: Props) {

  const [app] = useApp();

  return (
    <main className="landing-page-wrapper">
      <AppHeader currentTheme={app.theme} allowAddWidget={false} />
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
    </main>
  );
}

export default LandingPage;
