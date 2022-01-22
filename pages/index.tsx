import http from 'http';
import { GetServerSideProps } from 'next';
import App from '../components/app/App';

// A regular expression used for matching a www domain
const wwwRegex = /^www\./;

function redirectWwwToNonWww(req: http.IncomingMessage, res: http.ServerResponse) {
  if (wwwRegex.test(String(req.headers.host))) {
    const newHost = String(req.headers.host).replace(wwwRegex, '');
    res.writeHead(301, { Location: `http://${newHost}` });
    res.end();
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  redirectWwwToNonWww(context.req, context.res);
  return { props: {} };
};

export default App;
