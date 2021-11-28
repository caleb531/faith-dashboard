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
        <img
          className="theme-switcher-icon"
          src="icons/paintbrush-light.svg"
          alt="Theme" />
      </label>
      <select className="theme-switcher-dropdown" id="theme-switcher-dropdown" value={app.theme} onChange={(event) => dispatchApp({ type: 'changeTheme', payload: event.target.value })}>
        {themeList.map((themeListItem) => {
          return (<option value={themeListItem.value} key={themeListItem.value}>
            {themeListItem.label}
          </option>);
        })}
      </select>
    </div>
  );

}

export default ThemeSwitcher;
