/* eslint-disable react/no-unescaped-entities */
import LandingPage from '../components/LandingPage';
import LinkButton from '../components/reusable/LinkButton';

function PageNotFound() {
  return (
    <LandingPage heading="Page Not Found | Faith Dashboard">
      <p>Sorry about that! You ended up on a page that doesn't exist.</p>

      <p>
        <LinkButton href="/">Return to App</LinkButton>
      </p>
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: 'Page Not Found | Faith Dashboard'
    }
  };
}

export default PageNotFound;
