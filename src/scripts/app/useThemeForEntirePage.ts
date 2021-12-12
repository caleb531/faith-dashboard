import { useEffect } from 'react';
import { AppTheme } from '../types.d';

// The useThemeForEntirePage() hook takes the given color theme and applies it
// to the
// <body> element of the page
export default function useThemeForEntirePage(theme: AppTheme) {

  useEffect(() => {
    // Remove any previous theme-* classes applied to the <body>
    Array.from(document.body.classList).forEach((className) => {
      if (/^theme-/.test(className)) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

}