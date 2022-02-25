import App from '../components/app/App';

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/',
      pageTitle: 'Faith Dashboard',
      pageDescription: 'Be strengthened every day with this private board for your favorite Bible verses, sermons, and anything else you need to be encouraged when life happens.'
    }
  };
}

export default App;
