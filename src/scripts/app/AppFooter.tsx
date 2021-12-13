import React from 'react';

const AppFooter = React.memo(function AppFooter() {

  return (
    <footer className="app-footer">
      <small className="footer-dedication">By Caleb Evans. Dedicated to Christ our Lord</small>
      &nbsp;&middot;&nbsp;
      <a href="copyright.html">Copyright</a>
    </footer>
  );

});

export default AppFooter;
