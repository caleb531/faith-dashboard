import App from '@components/app/App';
import { redirect } from 'next/navigation';
import React from 'react';
import {
  getSession,
  getSignInUrlForCurrentPage,
  getUser
} from './authUtils.server';
import LinkButton from './reusable/LinkButton';

type Props = {
  heading: string;
  altLink?: {
    title: string;
    href: string;
  };
  isProtected?: boolean;
  children: React.ReactNode;
};

// The default argument is mostly to suppress an error related to React's
// internal describeNativeComponentFrame() function, which calls the component
// in an erroneous way so as to gather stack trace information that is useful
// for debugging
async function LandingPage(
  { heading, altLink, isProtected, children }: Props = {
    heading: '',
    children: <></>
  }
) {
  const session = await getSession();
  const user = await getUser();
  // If route is protected, redirect to the Sign In page if the user has not
  // signed in
  if (isProtected && !session) {
    redirect(getSignInUrlForCurrentPage());
  }
  return (
    <App session={session} user={user}>
      <article className="landing-page">
        <section className="landing-page-section sheet">
          <header>
            <h1>{heading}</h1>
            <LinkButton
              href="/"
              className="sheet-control sheet-control-left landing-page-control landing-page-home-control"
            >
              <img
                className="sheet-control-icon landing-page-control-icon landing-page-home-control-icon"
                src="/icons/home-dark.svg"
                alt="Go to Dashboard"
                draggable="false"
              />
            </LinkButton>
            {altLink ? (
              <LinkButton
                href={altLink.href}
                className="sheet-control sheet-control-right landing-page-control landing-page-alt-control"
              >
                {altLink.title}
              </LinkButton>
            ) : null}
          </header>
          {children}
        </section>
      </article>
    </App>
  );
}

export default LandingPage;
