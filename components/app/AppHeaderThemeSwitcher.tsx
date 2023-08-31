import Button from '@components/reusable/Button';
import Icon from '@components/reusable/Icon';
import { useContext, useState } from 'react';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import ThemeContext from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';

const allThemes = [...photoThemeList, ...colorThemeList];

function AppHeaderThemeSwitcher() {
  const { isCurrentStep, stepProps } = useTutorialStep('change-theme');
  const currentThemeId = useContext(ThemeContext);
  const [themeSwitcherIsOpen, setThemeSwitcherIsOpen] = useState(false);

  return (
    <div className="app-header-theme-switcher">
      {isCurrentStep ? <TutorialStepTooltip /> : null}
      <label
        className="theme-switcher-label accessibility-only"
        htmlFor="app-header-theme-switcher-button"
      >
        Background Theme
      </label>
      <Button
        className="app-header-theme-switcher-button app-header-control-button"
        id="app-header-theme-switcher-button"
        onClick={() => setThemeSwitcherIsOpen((isOpen) => !isOpen)}
        {...stepProps}
      >
        <Icon name="paintbrush-light" />
        <span className="app-header-theme-switcher-button-label">
          {
            allThemes.find((themeListItem) => {
              return themeListItem.id === currentThemeId;
            })?.name
          }
        </span>
      </Button>
      {themeSwitcherIsOpen ? (
        <ThemeSwitcher
          onCloseThemeSwitcher={() => setThemeSwitcherIsOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default AppHeaderThemeSwitcher;
