import React from 'react';
import Modal from '../generic/Modal';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';
import ThemeSwitcherList from './ThemeSwitcherList';

type Props = { currentTheme: AppTheme, onCloseThemeSwitcher: () => void };

function ThemeSwitcher({ currentTheme, onCloseThemeSwitcher }: Props) {

  return (
    <Modal onCloseModal={onCloseThemeSwitcher}>
        <section className="theme-switcher">
          <h1>Choose Theme</h1>
          <p>Click a theme to use it for your dashboard!</p>
          <h2>You can pick a photo...</h2>
          <ThemeSwitcherList
            themeList={photoThemeList}
            themeType="photo"
            onChooseTheme={() => onCloseThemeSwitcher()} />
          <h2>...or pick a color...</h2>
          <ThemeSwitcherList
            themeList={colorThemeList}
            themeType="color"
            onChooseTheme={() => onCloseThemeSwitcher()} />
        </section>
    </Modal>
  );

}

export default ThemeSwitcher;
