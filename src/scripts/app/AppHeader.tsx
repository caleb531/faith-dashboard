import React from 'react';
import AddWidgetHeader from '../add-widget/AddWidgetHeader';
import { AppState } from '../types.d';
import ThemeSwitcher from './ThemeSwitcher';

type Props = { app: AppState };

function AppHeader({ app }: Props) {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AddWidgetHeader />
        <ThemeSwitcher theme={app.theme} />
      </div>
    </header>
  );

}

export default AppHeader;
