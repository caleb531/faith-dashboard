import React, { useState } from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';
import ThemeSwitcher from './ThemeSwitcher';

const allThemes = [...photoThemeList, ...colorThemeList];

type Props = { currentTheme: AppTheme };

function AppHeaderThemeSwitcher({ currentTheme }: Props) {

  const { isCurrentStep, stepProps } = useTutorialStep('change-theme');
  const [themeSwitcherIsOpen, setThemeSwitcherIsOpen] = useState(false);

  return (
    <div className="app-header-theme-switcher">
      {isCurrentStep ? <TutorialMessage /> : null}
      <label className="theme-switcher-label accessibility-only" htmlFor="theme-switcher-dropdown">
        Color Theme
      </label>
      <button
        className="app-header-theme-switcher-button"
        id="theme-switcher-dropdown"
        onClick={() => setThemeSwitcherIsOpen((isOpen) => !isOpen)}
        {...stepProps}>
        {allThemes.find((themeListItem) => {
          return themeListItem.value === currentTheme;
        })?.label}
      </button>
      {themeSwitcherIsOpen ? (
        <ThemeSwitcher currentTheme={currentTheme} onCloseThemeSwitcher={() => setThemeSwitcherIsOpen(false)} />
      ) : null}
    </div>
  );

}

export default AppHeaderThemeSwitcher;
