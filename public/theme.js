const DEFAULT_THEME = 'dark';
const LOCALSTORAGE_THEME_KEY = 'chakra-ui-color-mode';
const LIGHT_THEME_HTML_BG = '#ffffff';
const DARK_THEME_HTML_BG = '#272727';
/**
 * Prevent flash of white when refreshing page
 */
;(function initTheme() {
    // Get theme from localStorage, if it doesn't exist, set it to default
    const theme = localStorage.getItem(LOCALSTORAGE_THEME_KEY) || DEFAULT_THEME;
    // Apply background color to html element, to prevent flash of white
    const backgroundColor = theme === 'dark' ? DARK_THEME_HTML_BG : LIGHT_THEME_HTML_BG;
    document.querySelector('html').style.setProperty('background', backgroundColor);
})();