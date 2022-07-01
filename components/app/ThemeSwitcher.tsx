import { useContext, useEffect } from 'react';
import Modal from '../generic/Modal';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import AppContext from './AppContext';
import photoThemeList from './appPhotoThemeList';
import ThemeSwitcherList from './ThemeSwitcherList';

// The number of milliseconds that the Theme Switcher modal will stay open
// after choosing a theme (to give the user time to react to the change)
const themeChangeDelay = 350;

type Props = {
  currentTheme: AppTheme;
  onCloseThemeSwitcher: () => void;
};

function ThemeSwitcher({ currentTheme, onCloseThemeSwitcher }: Props) {
  const dispatchToApp = useContext(AppContext);
  let themeSwitchTimer: ReturnType<typeof setTimeout>;

  function onChooseTheme(newTheme: AppTheme): void {
    dispatchToApp({ type: 'changeTheme', payload: newTheme });
    // Close modal after short delay to give user time to see that the selected
    // theme has been changed (since the 'selected' checkmark will now show up
    // over the theme they just clicked)
    themeSwitchTimer = setTimeout(() => {
      onCloseThemeSwitcher();
    }, themeChangeDelay);
  }

  // Clear the timeout when the ThemeSwitcher component unmounts to prevent the
  // "unmounted component" error from React
  useEffect(() => {
    return () => {
      clearTimeout(themeSwitchTimer);
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <Modal onCloseModal={onCloseThemeSwitcher}>
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
