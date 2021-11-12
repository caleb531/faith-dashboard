import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

function AppHeader() {

  return (
    <div className="app-header">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <ThemeSwitcher />
    </div>
  );

}

export default AppHeader;
