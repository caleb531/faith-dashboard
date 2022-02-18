import React from 'react';
import { AppTheme } from './app.d';
import AppHeaderAddWidgetButton from './AppHeaderAddWidgetButton';
import AppHeaderThemeSwitcher from './AppHeaderThemeSwitcher';

type Props = { theme: AppTheme };

function AppHeader({ theme }: Props) {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AppHeaderAddWidgetButton />
        <AppHeaderThemeSwitcher theme={theme} />
      </div>
    </header>
  );

}

export default AppHeader;
