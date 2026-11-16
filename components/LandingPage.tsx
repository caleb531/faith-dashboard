import App from '@components/app/App';
import { redirect } from 'next/navigation';
import React from 'react';
import { getAuth, getSignInUrlForCurrentPage } from './authUtils.server';
import AuthGate from './account/AuthGate';
import Icon from './reusable/Icon';
import LinkButton from './reusable/LinkButton';

type Props = {
  heading: string;
  altLink?: {
    title: string;
    href: string;
  };
  isProtected?: boolean;
  redirectSignedInUsersTo?: string;
  children: React.ReactNode;
};

// The default argument is mostly to suppress an error related to React's
// internal describeNativeComponentFrame() function, which calls the component
// in an erroneous way so as to gather stack trace information that is useful
// for debugging
async function LandingPage(
  {
    heading,
    altLink,
    isProtected,
    redirectSignedInUsersTo,
    children
  }: Props = {
    heading: '',
    children: <></>
  }
) {
  // An unavailable service is different from a confirmed missing session
  const auth = await getAuth();
  // Preserve the destination when recovery confirms that login is needed
  const signInUrl =
    isProtected && auth.status !== 'authenticated'
      ? await getSignInUrlForCurrentPage()
      : '/sign-in';
  if (isProtected && auth.status === 'anonymous') {
    // If route is protected, redirect to the Sign In page if the user has not
    // signed in
    redirect(signInUrl);
  } else if (redirectSignedInUsersTo && auth.status === 'authenticated') {
    // If the user is signed in but on a page which should only be accessible to
    // signed-out users, redirect them to the designated page
    redirect(redirectSignedInUsersTo);
  }
  return (
    <App auth={auth}>
      <article className="landing-page">
        <section className="landing-page-section sheet">
          <header>
            <h1>{heading}</h1>
            <LinkButton
              href="/"
              className="sheet-control sheet-control-left landing-page-control landing-page-home-control"
              unstyled
            >
              <Icon
                name="home-dark"
                alt="Go to Dashboard"
                fetchPriority="low"
              />
            </LinkButton>
            {altLink ? (
              <LinkButton
                href={altLink.href}
                className="sheet-control sheet-control-right landing-page-control landing-page-alt-control"
                unstyled
              >
                {altLink.title}
              </LinkButton>
            ) : null}
          </header>
          <AuthGate
            isProtected={isProtected}
            signInUrl={signInUrl}
            redirectSignedInUsersTo={redirectSignedInUsersTo}
          >
            {children}
          </AuthGate>
        </section>
      </article>
    </App>
  );
}

export default LandingPage;
