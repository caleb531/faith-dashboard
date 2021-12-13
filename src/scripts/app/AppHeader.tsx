import React from 'react';
import AddWidgetHeader from '../add-widget/AddWidgetHeader';
import { AppTheme } from '../types.d';
import ThemeSwitcher from './ThemeSwitcher';

type Props = { theme: AppTheme };

const AppHeader = React.memo(function AppHeader({ theme }: Props) {

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AddWidgetHeader />
        <ThemeSwitcher theme={theme} />
      </div>
    </header>
  );

});

export default AppHeader;
