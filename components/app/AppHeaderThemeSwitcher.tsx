import React, { useState } from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';

const allThemes = [...photoThemeList, ...colorThemeList];

type Props = { theme: AppTheme };

function AppHeaderThemeSwitcher({ theme }: Props) {

  const { isCurrentStep, stepProps } = useTutorialStep('change-theme');
  const [themeSwitcherIsOpen, setThemeSwitcherIsOpen] = useState(false);

  return (
    <div className="app-header-theme-switcher">
      {isCurrentStep ? <TutorialMessage /> : null}
      <label className="theme-switcher-label accessibility-only" htmlFor="theme-switcher-dropdown">
        Color Theme
      </label>
      <button className="app-header-theme-switcher-button" id="theme-switcher-dropdown" onClick={() => setThemeSwitcherIsOpen(true)} {...stepProps}>
        {allThemes.find((themeListItem) => {
          return themeListItem.value === theme;
        })?.label}
      </button>
    </div>
  );

}

export default AppHeaderThemeSwitcher;
