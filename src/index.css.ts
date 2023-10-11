import { Styles } from '@ijstech/components';
import Assets from './assets';

// Styles.Theme.darkTheme.background.default = '#192F51';
// Styles.Theme.darkTheme.background.paper = '#0090DA';
// Styles.Theme.darkTheme.colors.primary.dark = '#192F51';
// Styles.Theme.darkTheme.colors.primary.light = '#0090DA';
// Styles.Theme.darkTheme.colors.primary.main = '#192F51';
// Styles.Theme.darkTheme.colors.secondary.dark = '#939393';
// Styles.Theme.darkTheme.colors.secondary.light = '#EBEBEB';
// Styles.Theme.darkTheme.colors.secondary.main = '#B8B8B8';
// Styles.Theme.darkTheme.text.primary = '#fff';
// Styles.Theme.darkTheme.text.secondary = '#939393';
// // Styles.Theme.darkTheme.typography.fontFamily = 'Poppins';
// Styles.Theme.darkTheme.colors.warning.dark = '#f57c00';
// Styles.Theme.darkTheme.colors.warning.light = '#F6C958';
// Styles.Theme.darkTheme.colors.warning.main = '#ffa726';
// Styles.Theme.darkTheme.colors.error.light = '#FD7C6B';
// Styles.Theme.darkTheme.divider = '#EBEBEB';
// // Styles.Theme.darkTheme.typography.fontSize = '16px';
// Styles.Theme.darkTheme.background.modal = '#fff';

export default Styles.style({
    $nest: {
        '*': {
            boxSizing: 'border-box'
        },
        '@media screen and (min-width: 768px) and (max-width: 1280px)': {
            $nest: {
                '.w-80': {
                    width: 'calc(100% - 64px)'
                }
            }
        },
        '@media screen and (max-width: 767px)': {
            $nest: {
                '.w-80': {
                    width: 'calc(100% - 32px)'
                }
            }
        }
    }
});
Styles.fontFace({
    fontFamily: "Poppins",
    src: `url("${Assets.fonts.poppins.bold}") format("truetype")`,
    fontWeight: 'bold',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: "Poppins",
    src: `url("${Assets.fonts.poppins.italic}") format("truetype")`,
    fontWeight: '300',
    fontStyle: 'italic'
});
Styles.fontFace({
    fontFamily: "Poppins",
    src: `url("${Assets.fonts.poppins.regular}") format("truetype")`,
    fontWeight: 'normal',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: "Poppins",
    src: `url("${Assets.fonts.poppins.medium}") format("truetype")`,
    fontWeight: '600',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: "Poppins",
    src: `url("${Assets.fonts.poppins.thin}") format("truetype")`,
    fontWeight: '300',
    fontStyle: 'normal'
});