import {
  customElements,
  Module,
  ControlElement,
  Styles,
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
  hasLogo?: boolean;
  customStyles?: any;
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
    const hasLogo = this.getAttribute("hasLogo", true, true);
    this.imgLogo.visible = hasLogo;
    this.updateLogo = this.updateLogo.bind(this);
    this.updateLogo();
    const version = this.getAttribute("version", true, "");
    this.lblVersion.caption = version ? "Version: " + version : version;
    this.lblVersion.visible = !!version;
    const copyright = this.getAttribute('copyrightInfo', true, "");
    this.lblCopyright.caption = version ? copyright + " |" : copyright;
    this.lblCopyright.visible = !!copyright;
    try {
      const customStyleAttr = this.getAttribute('customStyles', true);
      const customStyle = Styles.style(customStyleAttr)
      customStyle && this.classList.add(customStyle)
    } catch {}
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.updateLogo);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.updateLogo);
  }

  updateLogo() {
    const url = assets.logo.footer;
    if (this.imgLogo.url !== url)
      this.imgLogo.url = url;
  }

  render() {
    return (
      <i-panel height={105} padding={{ top: '1rem', bottom: '1rem', right: '2rem', left: '2rem' }} background={{ color: Styles.Theme.ThemeVars.background.main }}>
        <i-hstack horizontalAlignment="space-between" verticalAlignment="center" width="100%">
          <i-vstack gap="0.5rem" width="100%" class="footer-content">
            <i-hstack
              padding={{ bottom: '0.5rem' }}
              border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }}
              verticalAlignment="center" gap={8}
              class="footer-content_logo"
            >
              <i-image id="imgLogo" class={logoStyle} height={40} />
              <i-hstack id="lblPoweredBy" gap={4} class="power-by">
                <i-label caption='Powered by' class="lb-power"></i-label>
                <i-label caption='Secure' font={{bold: true, transform: 'uppercase'}} class="lb-secure"></i-label>
                <i-label caption='Compute' font={{bold: true, transform: 'uppercase'}} class="lb-compute"></i-label>
              </i-hstack>
              {/* <i-label id="lblPoweredBy" caption='Powered by Secure Compute' font={{ bold: true }}></i-label> */}
            </i-hstack>
            <i-hstack gap={4} verticalAlignment="center" wrap="wrap" class="footer-content_copyright">
              <i-label id="lblCopyright" font={{ color: Theme.text.secondary, size: '0.875em' }}></i-label>
              <i-label id="lblVersion" font={{ color: Theme.text.secondary, size: '0.875em' }}></i-label>
            </i-hstack>
          </i-vstack>
        </i-hstack>
      </i-panel>
    )
  }
}