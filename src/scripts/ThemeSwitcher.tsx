import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { AppTheme, ThemeListItem } from './types.d';

const themeList: ThemeListItem[] = [
  {
    label: 'Brown',
    value: AppTheme.brown
  },
  {
    label: 'Green',
    value: AppTheme.green
  },
  {
    label: 'Teal',
    value: AppTheme.teal
  },
  {
    label: 'Blue',
    value: AppTheme.blue
  }
];

function ThemeSwitcher() {

  const { app, dispatchApp } = useContext(AppContext);

  return (
    <div className="theme-switcher">
      <label className="theme-switcher-label" htmlFor="theme-switcher-dropdown">
        Color Theme:
      </label>
      <select className="theme-switcher-dropdown" id="theme-switcher-dropdown" value={app.theme} onChange={(event) => dispatchApp({ type: 'changeTheme', payload: event.target.value })}>
        <optgroup label="Color Theme">
          {themeList.map((themeListItem) => {
            return (<option value={themeListItem.value} key={themeListItem.value}>
              {themeListItem.label}
            </option>);
          })}
        </optgroup>
      </select>
    </div>
  );

}

export default ThemeSwitcher;
