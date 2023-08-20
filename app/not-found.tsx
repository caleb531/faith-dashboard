import LandingPage from '@components/LandingPage';
import LinkButton from '@components/reusable/LinkButton';

async function PageNotFound() {
  return (
    <LandingPage heading="Page Not Found | Faith Dashboard">
      <p>Sorry about that! You ended up on a page that doesn't exist.</p>

      <p>
        <LinkButton href="/">Return to App</LinkButton>
      </p>
    </LandingPage>
  );
}

export function generateMetadata() {
  return {
    title: 'Page Not Found | Faith Dashboard'
  };
}

export default PageNotFound;
