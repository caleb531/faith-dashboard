import React from 'react';
import { AppTheme } from './app.d';
import AppHeaderAddWidgetButton from './AppHeaderAddWidgetButton';
import AppHeaderThemeSwitcher from './AppHeaderThemeSwitcher';

type Props = { currentTheme: AppTheme };

function AppHeader({ currentTheme }: Props) {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AppHeaderAddWidgetButton />
        <AppHeaderThemeSwitcher currentTheme={currentTheme} />
      </div>
    </header>
  );

}

export default AppHeader;
