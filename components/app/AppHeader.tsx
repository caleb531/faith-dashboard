import Link from 'next/link';
import React from 'react';
import { AppTheme } from './app.d';
import AppHeaderAccount from './AppHeaderAccount';
import AppHeaderAddWidgetButton from './AppHeaderAddWidgetButton';
import AppHeaderThemeSwitcher from './AppHeaderThemeSwitcher';

type Props = {
  currentTheme: AppTheme,
  allowAddWidget?: boolean
};

function AppHeader({
  currentTheme,
  allowAddWidget = true
}: Props) {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">
        <Link href="/"><a className="app-header-title-link">Faith Dashboard</a></Link>
      </h1>
      <div className="app-header-controls">
        {allowAddWidget ? <AppHeaderAddWidgetButton /> : null}
        <AppHeaderThemeSwitcher currentTheme={currentTheme} />
        <AppHeaderAccount />
      </div>
    </header>
  );

}

export default AppHeader;
