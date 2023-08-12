import App from './app/App';
import { JSXChildren } from './global.types';
import LinkButton from './reusable/LinkButton';

type Props = {
  heading: string;
  altLink?: {
    title: string;
    href: string;
  };
  children: JSXChildren;
};

function LandingPage({ heading, altLink, children }: Props) {
  return (
    <App>
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
