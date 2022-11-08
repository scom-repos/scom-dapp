import {application} from '@ijstech/components';
const moduleDir = application.currentModuleDir;

function fullPath(path: string): string{
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