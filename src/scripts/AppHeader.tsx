import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

function AppHeader(props) {

  return (
    <div className="app-header">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <ThemeSwitcher {...props} />
    </div>
  );

}

export default AppHeader;
