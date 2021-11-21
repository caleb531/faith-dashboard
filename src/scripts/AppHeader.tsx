import React from 'react';
import AddWidget from './AddWidget';
import ThemeSwitcher from './ThemeSwitcher';

function AppHeader() {

  return (
    <header className="app-header">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <AddWidget />
      <ThemeSwitcher />
    </header>
  );

}

export default AppHeader;
