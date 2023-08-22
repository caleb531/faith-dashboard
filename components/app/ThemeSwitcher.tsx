import { useContext } from 'react';
import Modal from '../reusable/Modal';
import useTimeout from '../useTimeout';
import AppContext from './AppContext';
import ThemeSwitcherList from './ThemeSwitcherList';
import { AppTheme } from './app.types';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';

// The number of milliseconds that the Theme Switcher modal will stay open
// after choosing a theme (to give the user time to react to the change)
const themeChangeDelay = 350;

type Props = {
  currentTheme: AppTheme;
  onCloseThemeSwitcher: () => void;
};

function ThemeSwitcher({ currentTheme, onCloseThemeSwitcher }: Props) {
  const { dispatchToApp } = useContext(AppContext);
  const setThemeSwitchTimeout = useTimeout();

  function onChooseTheme(newTheme: AppTheme): void {
    dispatchToApp({ type: 'changeTheme', payload: newTheme });
    // Close modal after short delay to give user time to see that the selected
    // theme has been changed (since the 'selected' checkmark will now show up
    // over the theme they just clicked)
    setThemeSwitchTimeout(() => {
      onCloseThemeSwitcher();
    }, themeChangeDelay);
  }

  return (
    <Modal onClose={onCloseThemeSwitcher}>
      <section className="theme-switcher">
        <h1>Change Theme</h1>
        <p>Click a theme to use it for your dashboard!</p>
        <h2>You can pick a photo...</h2>
        <ThemeSwitcherList
          themeList={photoThemeList}
          themeType="photo"
          onChooseTheme={onChooseTheme}
          currentTheme={currentTheme}
        />
        <h2>...or pick a color...</h2>
        <ThemeSwitcherList
          themeList={colorThemeList}
          themeType="color"
          onChooseTheme={onChooseTheme}
          currentTheme={currentTheme}
        />
      </section>
    </Modal>
  );
}

export default ThemeSwitcher;
