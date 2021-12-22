import React, { useContext } from 'react';
import { AppTheme, AppThemeListItem } from './app.d';
import AppContext from './AppContext';

const themeList: AppThemeListItem[] = [
  {
    label: 'Brown',
    value: 'brown'
  },
  {
    label: 'Green',
    value: 'green'
  },
  {
    label: 'Teal',
    value: 'teal'
  },
  {
    label: 'Blue',
    value: 'blue'
  },
  {
    label: 'Rose',
    value: 'rose'
  }
];

type Props = { theme: AppTheme };

function ThemeSwitcher({ theme }: Props) {

  const dispatchToApp = useContext(AppContext);

  return (
    <div className="theme-switcher">
      <label className="theme-switcher-label accessibility-only" htmlFor="theme-switcher-dropdown">
        Color Theme
      </label>
      <select className="theme-switcher-dropdown" id="theme-switcher-dropdown" value={theme} onChange={(event) => dispatchToApp({ type: 'changeTheme', payload: event.target.value as AppTheme })}>
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
