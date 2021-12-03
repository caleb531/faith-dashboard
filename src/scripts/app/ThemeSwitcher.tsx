import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { AppTheme, AppThemeListItem } from '../types.d';

const themeList: AppThemeListItem[] = [
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
  },
  {
    label: 'Rose',
    value: AppTheme.rose
  }
];

function ThemeSwitcher() {

  const { app, dispatchToApp } = useContext(AppContext);

  return (
    <div className="theme-switcher">
      <label className="theme-switcher-label" htmlFor="theme-switcher-dropdown">
        Color Theme:
      </label>
      <select className="theme-switcher-dropdown" id="theme-switcher-dropdown" value={app.theme} onChange={(event) => dispatchToApp({ type: 'changeTheme', payload: event.target.value })}>
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
