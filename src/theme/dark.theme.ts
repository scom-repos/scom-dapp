import {Styles} from '@ijstech/components';
const Theme: Styles.Theme.ITheme = JSON.parse(JSON.stringify(Styles.Theme.darkTheme));

// Background
Theme.background.main = '#0C1234';
Theme.background.paper = '#192046';
Theme.background.modal = '#192046';
Theme.background.default = '#1E1E1E';
Theme.background.gradient = 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box';

// Colors
Theme.colors.primary.main = '#ff9800';
Theme.colors.primary.light = '#2B2B2B';
Theme.colors.primary.dark = '#F05E61';
Theme.colors.primary.contrastText = '#FFFFFF';
Theme.colors.secondary.main = '#222237';
Theme.colors.secondary.light = '#2B2B2B';
Theme.colors.secondary.dark = '#3B3B3B';
Theme.colors.secondary.contrastText = '#FFFFFF';
// Theme.colors.success.main = '';
// Theme.colors.success.light = '';
// Theme.colors.success.dark = '';
// Theme.colors.success.contrastText = '';
Theme.colors.error.main = '#B2554D';
// Theme.colors.error.light = '';
// Theme.colors.error.dark = '';
// Theme.colors.error.contrastText = '';
// Theme.colors.info.main = '';
// Theme.colors.info.light = '';
// Theme.colors.info.dark = '';
// Theme.colors.info.contrastText = '';
Theme.colors.warning.main = '#ffa726';
Theme.colors.warning.light = '#F6C958';
Theme.colors.warning.dark = '#f57c00';
Theme.colors.warning.contrastText = '#FFFFFF';


// Text
Theme.text.primary = '#FFFFFF';
Theme.text.secondary = 'hsla(0, 0%, 100%, 0.55)';
Theme.text.third = '#f7d064';
// Theme.text.hint = '';
// Theme.text.disabled = '';

// Typography
// Theme.typography.fontSize = '';
// Theme.typography.fontFamily = '';

// Shadows
// Theme.shadows["0"] = '';
// Theme.shadows["1"] = '';
// Theme.shadows["2"] = '';
// Theme.shadows["3"] = '';
// Theme.shadows["4"] = '';

// Breakpoints
// Theme.breakboints.xs = 0;
// Theme.breakboints.sm = 0;
// Theme.breakboints.md = 0;
// Theme.breakboints.lg = 0;
// Theme.breakboints.xl = 0;

// Divider
Theme.divider = '#D9D9D9';

// Docs
Theme.docs.background = '#181C1F';
Theme.docs.text0 = '#fff';
Theme.docs.text1 = '#fff';

// Input
Theme.input.background = '#232B5A';
Theme.input.fontColor = '#fff';

// Combobox
Theme.combobox.background = '#232B5A';
Theme.combobox.fontColor = '#fff';

// Action
Theme.action.hover = 'rgba(255,255,255,0.08)';
Theme.action.hoverOpacity = 0.08;
Theme.action.active = 'rgba(0, 0, 0, 0.54)';
Theme.action.activeOpacity = 0.12;
Theme.action.disabled = '#404040';
Theme.action.disabledBackground = 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box';
Theme.action.disabledOpacity = 0.38;
Theme.action.focus = 'rgba(255,255,255, 0.12)';
// Theme.action.focusOpacity = 1;
// Theme.action.selected = '';
// Theme.action.selectedOpacity = 1;

// Layout
Theme.layout.container.width = '1400px';

export default Theme;
