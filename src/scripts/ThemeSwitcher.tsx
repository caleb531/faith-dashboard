import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { AppTheme } from './App.d';
import { ThemeListItem } from './ThemeSwitcher.d';

const themeList: Array<ThemeListItem> = [
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
    <select className="theme-switcher" value={app.theme} onChange={(event) => dispatchApp({type: 'changeTheme', payload: event.target.value})}>
      {themeList.map((themeListItem) => {
        return (<option value={themeListItem.value} key={themeListItem.value}>
          {themeListItem.label}
        </option>);
      })}
    </select>
  );

}

export default ThemeSwitcher;
