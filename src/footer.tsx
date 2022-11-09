import {
  application,
  customElements,
  Module,
  ControlElement,
  Styles,
  Container,
  Image,
  Label
} from '@ijstech/components';
import { logoStyle } from './footer.css';
import { assets } from './assets';

const Theme = Styles.Theme.ThemeVars;

export interface FooterElement extends ControlElement {
  logo?: string;
  copyrightInfo?: string;
  version?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["main-footer"]: FooterElement;
    }
  }
};

@customElements('main-footer')
export class Footer extends Module {
  private imgLogo: Image;
  private lblCopyright: Label;
  private lblVersion: Label;

  init() {
    super.init();
    this.updateLogo = this.updateLogo.bind(this);
    this.updateLogo();
    const version = this.getAttribute("version", true, "");
    this.lblVersion.caption = version ? "Version: " + version : version;
    this.lblVersion.visible = !!version;
    const copyright = this.getAttribute('copyrightInfo', true, "");
    this.lblCopyright.caption = version ? copyright + " |" : copyright;;
    this.lblCopyright.visible = !!copyright;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.updateLogo);
  }

  disconnectCallback(): void {
    super.disconnectCallback();
    window.removeEventListener('resize', this.updateLogo);
  }

  updateLogo() {
    this.imgLogo.url = assets.logo.footer;
  }

  render() {
    return (
      <i-panel padding={{ top: '1rem', bottom: '1rem', right: '2rem', left: '2rem' }} background={{ color: Styles.Theme.ThemeVars.background.main }}>
        <i-hstack horizontalAlignment="space-between" verticalAlignment="center" width="100%">
          <i-vstack gap="0.5rem" width="100%">
            <i-hstack padding={{ bottom: '0.5rem' }} border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} verticalAlignment="center" gap={8}>
              <i-image id="imgLogo" class={logoStyle} />
              <i-label id="lblPoweredBy" caption='Powered by Secure Compute' font={{ bold: true }}></i-label>
            </i-hstack>
            <i-hstack gap={4} verticalAlignment="center" wrap="wrap">
              <i-label id="lblCopyright" font={{ color: Theme.text.secondary, size: '0.875em' }}></i-label>
              <i-label id="lblVersion" font={{ color: Theme.text.secondary, size: '0.875em' }}></i-label>
            </i-hstack>
          </i-vstack>
        </i-hstack>
      </i-panel>
    )
  }
}