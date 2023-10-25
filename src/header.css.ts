import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export default Styles.style({
  zIndex: 2,
  $nest: {
    // '::-webkit-scrollbar-track': {
    //   borderRadius: '12px',
    //   border: '1px solid transparent',
    //   backgroundColor: 'unset'
    // },
    // '::-webkit-scrollbar': {
    //   width: '8px',
    //   backgroundColor: 'unset'
    // },
    // '::-webkit-scrollbar-thumb': {
    //   borderRadius: '12px',
    //   background: 'rgba(255, 255, 255, 0.2) 0% 0% no-repeat padding-box'
    // },
    '.os-modal': {
      boxSizing: 'border-box',
      $nest: {
        '.i-modal_header': {
          borderRadius: '10px 10px 0 0',
          background: 'unset',
          borderBottom: `2px solid ${Theme.divider}`,
          padding: '1rem',
          fontWeight: 700,
          fontSize: '1rem'
        }
      }
    },
    '.header-logo > img': {
      maxHeight: 'unset',
      maxWidth: 'unset'
    },
    '.wallet-modal > div': {
      boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px'
    },
    '.wallet-modal .modal': {
      minWidth: 200
    },
    '.custom-switch .wrapper': {
      borderRadius: 40,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
      $nest: {
        '.switch-base': {
          background: Theme.background.gradient
        },
        '.track::before': {
          fontSize: 18,
          color: Theme.text.primary
        },
        '.track::after': {
          transform: 'translateY(-50%) rotate(-30deg)',
          fontSize: 18,
          color: '#fff'
        },
        '.track': {
          background: 'linear-gradient(0deg, #252A48, #252A48), #8994A3',
          color: 'transparent'
        },
        '.switch-base.checked +.track': {
          background: Theme.background.main
        }
      }
    }
  }
})
