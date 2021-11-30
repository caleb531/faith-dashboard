import React from 'react';
import AddWidgetHeader from '../add-widget/AddWidgetHeader';
import ThemeSwitcher from './ThemeSwitcher';

function AppHeader() {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AddWidgetHeader />
        <ThemeSwitcher />
      </div>
    </header>
  );

}

export default AppHeader;
