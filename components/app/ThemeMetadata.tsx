import Head from 'next/head';

// Retrieve the hexadecimal color code of the current app theme, for use in the
// theme-color meta tag
function getThemeHexCode() {
  if (typeof getComputedStyle !== 'undefined') {
    return getComputedStyle(document.body)
      .getPropertyValue('--current-theme-color')
      ?.trim();
  } else {
    return '';
  }
}

// The theme-color meta tag (source:
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color)
function ThemeMetadata() {
  const themeHexCode = getThemeHexCode();
  return (
    <Head>
      {/* Dynamically set the theme-color according to the current app theme */}
      {themeHexCode ? <meta name="theme-color" content={themeHexCode} /> : null}
    </Head>
  );
}

export default ThemeMetadata;
