import {Styles} from '@ijstech/components';
const Theme: Styles.Theme.ITheme = JSON.parse(JSON.stringify(Styles.Theme.defaultTheme));

// Background
Theme.background.main = '#FFFFFF';
Theme.background.paper = '#FAFAFA';
Theme.background.modal = '#FFFFFF';
Theme.background.default = '#EEEEEE';
// Theme.background.gradient = '';

// Colors
Theme.colors.primary.main = '#FF6600';
Theme.colors.primary.light = '#FF8533';
Theme.colors.primary.dark = '#FF8533';
Theme.colors.primary.contrastText = '#FFFFFF';
Theme.colors.secondary.main = '#AAAAAA';
Theme.colors.secondary.light = '#f5f5f5';
// Theme.colors.secondary.dark = '';
// Theme.colors.secondary.contrastText = '';
Theme.colors.success.main = '#77B24D';
// Theme.colors.success.light = '';
// Theme.colors.success.dark = '';
Theme.colors.success.contrastText = '#FFFFFF';
Theme.colors.error.main = '#B2554D';
// Theme.colors.error.light = '';
// Theme.colors.error.dark = '';
Theme.colors.error.contrastText = '#FFFFFF';
// Theme.colors.info.main = '';
// Theme.colors.info.light = '';
// Theme.colors.info.dark = '';
// Theme.colors.info.contrastText = '';
// Theme.colors.warning.main = '';
// Theme.colors.warning.light = '';
// Theme.colors.warning.dark = '';
// Theme.colors.warning.contrastText = '';

// Text
Theme.text.primary = '#5f6368';
// Theme.text.secondary = '';
// Theme.text.third = '';
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
Theme.divider = 'rgba(217,225,232,.6)';

// Docs
// Theme.docs.background = '';
// Theme.docs.text0 = '';
// Theme.docs.text1 = '';

// Input
Theme.input.background = '#FAFAFA';
// Theme.input.fontColor = '';

// Combobox
Theme.combobox.background = '#FAFAFA';
// Theme.combobox.fontColor = '';

// Action
Theme.action.hover = 'rgba(0, 0, 0, 0.04)';
// Theme.action.hoverOpacity = 1;
// Theme.action.active = '';
// Theme.action.activeOpacity = 1;
// Theme.action.disabled = '';
// Theme.action.disabledBackground = '';
// Theme.action.disabledOpacity = 1;
// Theme.action.focus = '';
// Theme.action.focusOpacity = 1;
// Theme.action.selected = '';
// Theme.action.selectedOpacity = 1;

// Layout
Theme.layout.container.width = '1400px';

// Layout
export default Theme;



