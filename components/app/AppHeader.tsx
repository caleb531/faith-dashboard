import React from 'react';
import { AppTheme } from './app.d';
import AppHeaderAccountMenu from './AppHeaderAccountMenu';
import AppHeaderAddWidgetButton from './AppHeaderAddWidgetButton';
import AppHeaderThemeSwitcher from './AppHeaderThemeSwitcher';

type Props = {
  currentTheme: AppTheme
};

function AppHeader({
  currentTheme
}: Props) {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AppHeaderAddWidgetButton />
        <AppHeaderThemeSwitcher currentTheme={currentTheme} />
        <AppHeaderAccountMenu />
      </div>
    </header>
  );

}

export default AppHeader;
