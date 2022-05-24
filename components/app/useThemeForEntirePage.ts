import { groupBy } from 'lodash-es';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';

// Generate lookup tables of the different theme types so we can determine
// which specific theme belongs to which theme type
const colorThemesById = groupBy(colorThemeList, 'value');
const photoThemesById = groupBy(photoThemeList, 'value');

// The useThemeForEntirePage() hook takes the given color theme and applies it
// to the <body> element of the page
export default function useThemeForEntirePage(theme: AppTheme) {

  useIsomorphicLayoutEffect(() => {
    document.body.classList.add(
      'theme',
      `theme-${theme}`
    );
    if (colorThemesById[theme]) {
      document.body.classList.add('color-theme');
    } else if (photoThemesById[theme]) {
      document.body.classList.add('photo-theme');
    }
    return () => {
      // Remove any previous theme-* or *-theme classes applied to the <body>
      Array.from(document.body.classList).forEach((className) => {
        if (/^((theme-\w+)|(\w+-theme))/.test(className)) {
          document.body.classList.remove(className);
        }
      });
    };
  }, [theme]);

}
