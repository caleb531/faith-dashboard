import React, { useContext } from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import AppContext from './AppContext';
import photoThemeList from './appPhotoThemeList';



type Props = { theme: AppTheme };

function ThemeSwitcher({ theme }: Props) {

  const dispatchToApp = useContext(AppContext);
  const { isCurrentStep, stepProps } = useTutorialStep('change-theme');

  return (
    <div className="theme-switcher">
      {isCurrentStep ? <TutorialMessage /> : null}
      <label className="theme-switcher-label accessibility-only" htmlFor="theme-switcher-dropdown">
        Color Theme
      </label>
      <select className="theme-switcher-dropdown" id="theme-switcher-dropdown" value={theme} onChange={(event) => dispatchToApp({ type: 'changeTheme', payload: event.target.value as AppTheme })} {...stepProps}>
        <optgroup label="Photo Theme">
          {photoThemeList.map((themeListItem) => {
            return (<option value={themeListItem.value} key={themeListItem.value}>
              {themeListItem.label}
            </option>);
          })}
        </optgroup>
        <optgroup label="Color Theme">
          {colorThemeList.map((themeListItem) => {
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
