import React, { useState } from 'react';
import AddWidgetButton from '../generic/AddWidgetButton';
import WidgetPicker from '../widget-picker/WidgetPicker';
import { AppTheme } from './app.d';
import ThemeSwitcher from './ThemeSwitcher';

type Props = { theme: AppTheme };

const AppHeader = React.memo(function AppHeader({ theme }: Props) {

  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);

  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">Faith Dashboard</h1>
      <div className="app-header-controls">
        <AddWidgetButton onPressButton={() => setWidgetPickerIsOpen(true)} />
        {widgetPickerIsOpen ? (
          <WidgetPicker
            onCloseWidgetPicker={() => setWidgetPickerIsOpen(false)} />
        ) : null}
        <ThemeSwitcher theme={theme} />
      </div>
    </header>
  );

});

export default AppHeader;
