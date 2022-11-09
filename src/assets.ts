import { application } from '@ijstech/components';
const moduleDir = application.currentModuleDir;
type themeType = "light" | "dark";
type viewportType = "desktop" | "tablet" | "mobile";
// type IThemeLogo = {
//     [key in themeType]: string;
// }
// type IViewportLogo = {
//     [key in viewportType]: IThemeLogo | string;
// }
interface ILogo {
    header: string;
    footer: string;
}
interface IBreakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
}
class Assets {
    private static _instance: Assets;
    private _breakpoints: IBreakpoints;
    public static get instance() {
        if (!this._instance) this._instance = new this();
        return this._instance
    }
    get logo(): ILogo {
        // TODO: get current theme
        let currnetTheme: themeType = "dark";
        let _logo: ILogo;
        if (window.innerWidth > this._breakpoints?.tablet) {
            _logo = this._getLogo("desktop", currnetTheme);
        } else if (window.innerWidth > this._breakpoints?.mobile) {
            _logo = this._getLogo("tablet", currnetTheme);
        } else {
            _logo = this._getLogo("mobile", currnetTheme);
        }
        return _logo;
    }
    set breakpoints(value: IBreakpoints) {
        this._breakpoints = value;
    }
    get breakpoints() {
        return this._breakpoints;
    }
    private _getLogo(viewport: viewportType, theme: themeType): ILogo {
        const header = 
            application.assets(`logo/header/${viewport}/${theme}`) || application.assets(`logo/header/${viewport}`) ||
            application.assets(`logo/header/${theme}`) || application.assets(`logo/header`);
        const footer =
            application.assets(`logo/footer/${viewport}/${theme}`) || application.assets(`logo/footer/${viewport}`) ||
            application.assets(`logo/footer/${theme}`) || application.assets(`logo/footer`);
        return { header, footer }
    }
}
export const assets = Assets.instance;
function fullPath(path: string): string {
    return `${moduleDir}/${path}`
};
export default {
    fonts: {
        poppins: {
            bold: fullPath('fonts/poppins/PoppinsBold.ttf'),
            italic: fullPath('fonts/poppins/PoppinsItalic.ttf'),
            light: fullPath('fonts/poppins/PoppinsLight.ttf'),
            medium: fullPath('fonts/poppins/PoppinsMedium.ttf'),
            regular: fullPath('fonts/poppins/PoppinsRegular.ttf'),
            thin: fullPath('fonts/poppins/PoppinsThin.ttf'),
        }
    },
    img: {
        network: {
            bsc: fullPath('img/network/bsc.svg'),
            eth: fullPath('img/network/eth.svg'),
            amio: fullPath('img/network/amio.svg'),
            avax: fullPath('img/network/avax.svg'),
            ftm: fullPath('img/network/ftm.svg'),
            polygon: fullPath('img/network/polygon.svg'),
        },
        wallet: {
            metamask: fullPath('img/wallet/metamask.png'),
            trustwallet: fullPath('img/wallet/trustwallet.svg'),
            binanceChainWallet: fullPath('img/wallet/binance-chain-wallet.svg'),
            walletconnect: fullPath('img/wallet/walletconnect.svg')
        }
    },
    fullPath
};