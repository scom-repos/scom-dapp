var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/dapp/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assets = void 0;
    const moduleDir = components_1.application.currentModuleDir;
    class Assets {
        static get instance() {
            if (!this._instance)
                this._instance = new this();
            return this._instance;
        }
        get logo() {
            let currentTheme = components_1.Styles.Theme.currentTheme;
            let theme = currentTheme === components_1.Styles.Theme.defaultTheme ? "light" : "dark";
            let _logo = this._getLogo(this.viewport, theme);
            return _logo;
        }
        set breakpoints(value) {
            this._breakpoints = value;
        }
        get breakpoints() {
            return this._breakpoints;
        }
        get viewport() {
            var _a, _b;
            if (window.innerWidth > ((_a = this._breakpoints) === null || _a === void 0 ? void 0 : _a.tablet))
                return "desktop";
            else if (window.innerWidth > ((_b = this._breakpoints) === null || _b === void 0 ? void 0 : _b.mobile))
                return "tablet";
            else
                return "mobile";
        }
        _getLogoPath(viewport, theme, type) {
            let asset = components_1.application.assets(`logo/${type}`) || components_1.application.assets(`logo`);
            let path;
            if (typeof asset === 'object') {
                if (typeof asset[viewport] === 'object') {
                    path = asset[viewport][theme];
                }
                else if (typeof asset[viewport] === 'string') {
                    path = asset[viewport];
                }
                else if (asset[theme]) {
                    4;
                    path = asset[theme];
                }
            }
            else if (typeof asset === 'string') {
                path = asset;
            }
            return path;
        }
        _getLogo(viewport, theme) {
            const header = this._getLogoPath(viewport, theme, "header");
            const footer = this._getLogoPath(viewport, theme, "footer");
            return { header, footer };
        }
    }
    exports.assets = Assets.instance;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
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
});
define("@scom/dapp/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/dapp/assets.ts"], function (require, exports, components_2, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_2.Styles.Theme.darkTheme.background.default = '#192F51';
    components_2.Styles.Theme.darkTheme.background.paper = '#0090DA';
    components_2.Styles.Theme.darkTheme.colors.primary.dark = '#192F51';
    components_2.Styles.Theme.darkTheme.colors.primary.light = '#0090DA';
    components_2.Styles.Theme.darkTheme.colors.primary.main = '#192F51';
    components_2.Styles.Theme.darkTheme.colors.secondary.dark = '#939393';
    components_2.Styles.Theme.darkTheme.colors.secondary.light = '#EBEBEB';
    components_2.Styles.Theme.darkTheme.colors.secondary.main = '#B8B8B8';
    components_2.Styles.Theme.darkTheme.text.primary = '#fff';
    components_2.Styles.Theme.darkTheme.text.secondary = '#939393';
    components_2.Styles.Theme.darkTheme.typography.fontFamily = 'Poppins';
    components_2.Styles.Theme.darkTheme.colors.warning.dark = '#f57c00';
    components_2.Styles.Theme.darkTheme.colors.warning.light = '#F6C958';
    components_2.Styles.Theme.darkTheme.colors.warning.main = '#ffa726';
    components_2.Styles.Theme.darkTheme.colors.error.light = '#FD7C6B';
    components_2.Styles.Theme.darkTheme.divider = '#EBEBEB';
    components_2.Styles.Theme.darkTheme.typography.fontSize = '16px';
    components_2.Styles.Theme.darkTheme.background.modal = '#fff';
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.default = components_2.Styles.style({
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
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.bold}") format("truetype")`,
        fontWeight: 'bold',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.italic}") format("truetype")`,
        fontWeight: '300',
        fontStyle: 'italic'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.regular}") format("truetype")`,
        fontWeight: 'normal',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.medium}") format("truetype")`,
        fontWeight: '600',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.thin}") format("truetype")`,
        fontWeight: '300',
        fontStyle: 'normal'
    });
});
define("@scom/dapp/helper.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getParamsFromUrl = exports.abbreviateNum = exports.toWeiInv = exports.getAPI = exports.limitDecimals = exports.formatNumberWithSeparators = exports.formatNumber = exports.compareDate = exports.formatDate = void 0;
    // import moment from 'moment';
    const formatDate = (date, customType) => {
        const formatType = customType || 'DD/MM/YYYY';
        // return moment(date).format(formatType);
    };
    exports.formatDate = formatDate;
    const compareDate = (fromDate, toDate) => {
        // if (!toDate) {
        //   toDate = moment();
        // }
        // return moment(fromDate).isSameOrBefore(toDate);
    };
    exports.compareDate = compareDate;
    const formatNumber = (value, decimals) => {
        let val = value;
        const minValue = '0.0000001';
        if (typeof value === 'string') {
            val = new eth_wallet_1.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        if (val != 0 && new eth_wallet_1.BigNumber(val).lt(minValue)) {
            return `<${minValue}`;
        }
        return exports.formatNumberWithSeparators(val, decimals || 4);
    };
    exports.formatNumber = formatNumber;
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision) {
            let outputStr = '';
            if (value >= 1) {
                outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            if (outputStr.length > 18) {
                outputStr = outputStr.substr(0, 18) + '...';
            }
            return outputStr;
            // let parts = parseFloat(value.toPrecision(precision)).toString().split(".");
            // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // return parts.join(".");
        }
        else {
            return value.toLocaleString('en-US');
            // let parts = value.toString().split(".");
            // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // return parts.join(".");
        }
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    const limitDecimals = (value, decimals) => {
        let val = value;
        if (typeof value !== 'string') {
            val = val.toString();
        }
        let chart;
        if (val.includes('.')) {
            chart = '.';
        }
        else if (val.includes(',')) {
            chart = ',';
        }
        else {
            return value;
        }
        const parts = val.split(chart);
        let decimalsPart = parts[1];
        if (decimalsPart && decimalsPart.length > decimals) {
            parts[1] = decimalsPart.substr(0, decimals);
        }
        return parts.join(chart);
    };
    exports.limitDecimals = limitDecimals;
    async function getAPI(url, paramsObj) {
        let queries = '';
        if (paramsObj) {
            try {
                queries = new URLSearchParams(paramsObj).toString();
            }
            catch (err) {
                console.log('err', err);
            }
        }
        let fullURL = url + (queries ? `?${queries}` : '');
        const response = await fetch(fullURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response.json();
    }
    exports.getAPI = getAPI;
    const toWeiInv = (n, unit) => {
        if (new eth_wallet_1.BigNumber(n).eq(0))
            return new eth_wallet_1.BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        return new eth_wallet_1.BigNumber('1').shiftedBy((unit || 18) * 2).idiv(new eth_wallet_1.BigNumber(n).shiftedBy(unit || 18));
    };
    exports.toWeiInv = toWeiInv;
    const abbreviateNum = (value) => {
        let newValue = value;
        const suffixes = ["", "K", "M", "B", "T"];
        let suffixIdx = 0;
        while (newValue >= 1000) {
            newValue /= 1000;
            suffixIdx++;
        }
        if (suffixIdx >= suffixes.length) {
            return value.toString();
        }
        return exports.formatNumber(newValue, 2) + suffixes[suffixIdx];
    };
    exports.abbreviateNum = abbreviateNum;
    const getParamsFromUrl = () => {
        const startIdx = window.location.href.indexOf("?");
        const search = window.location.href.substring(startIdx, window.location.href.length);
        const queryString = search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams;
    };
    exports.getParamsFromUrl = getParamsFromUrl;
});
define("@scom/dapp/walletList.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.walletList = void 0;
    // import { getInfuraId, getSiteSupportedNetworks } from '.';
    exports.walletList = [
        {
            name: eth_wallet_2.WalletPlugin.MetaMask,
            displayName: 'MetaMask',
            img: 'metamask'
        },
        {
            name: eth_wallet_2.WalletPlugin.TrustWallet,
            displayName: 'Trust Wallet',
            img: 'trustwallet'
        },
        {
            name: eth_wallet_2.WalletPlugin.BinanceChainWallet,
            displayName: 'Binance Chain Wallet',
            img: 'binanceChainWallet'
        },
        {
            name: eth_wallet_2.WalletPlugin.WalletConnect,
            displayName: 'WalletConnect',
            iconFile: 'walletconnect'
        }
    ];
});
// export const getWalletOptions = (): { [key in WalletPlugin]?: any } => {
// let networkList = getSiteSupportedNetworks();
// const rpcs: {[chainId: number]:string} = {}
// for (const network of networkList) {
//     let rpc = network.rpc
//     if ( rpc ) rpcs[network.chainId] = rpc;
// }
// return {
//     [WalletPlugin.WalletConnect]: {
//         infuraId: getInfuraId(),
//         bridge: "https://bridge.walletconnect.org",
//         rpc: rpcs
//     }
// }
// }
define("@scom/dapp/wallet.ts", ["require", "exports", "@ijstech/components", "@scom/dapp/walletList.ts", "@ijstech/eth-wallet"], function (require, exports, components_3, walletList_1, eth_wallet_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateWallets = exports.getSupportedWallets = exports.truncateAddress = exports.hasMetaMask = exports.hasWallet = exports.logoutWallet = exports.switchNetwork = exports.connectWallet = exports.isWalletConnected = void 0;
    ;
    ;
    function isWalletConnected() {
        const wallet = eth_wallet_3.Wallet.getInstance();
        return wallet.isConnected;
    }
    exports.isWalletConnected = isWalletConnected;
    async function connectWallet(walletPlugin, eventHandlers) {
        // let walletProvider = localStorage.getItem('walletProvider') || '';
        let wallet = eth_wallet_3.Wallet.getInstance();
        const walletOptions = ''; //getWalletOptions();
        let providerOptions = walletOptions[walletPlugin];
        if (!wallet.chainId) {
            // wallet.chainId = getDefaultChainId();
        }
        await wallet.connect(walletPlugin, {
            onAccountChanged: (account) => {
                var _a, _b;
                if (eventHandlers && eventHandlers.accountsChanged) {
                    eventHandlers.accountsChanged(account);
                }
                const connected = !!account;
                if (connected) {
                    localStorage.setItem('walletProvider', ((_b = (_a = eth_wallet_3.Wallet.getInstance()) === null || _a === void 0 ? void 0 : _a.clientSideProvider) === null || _b === void 0 ? void 0 : _b.walletPlugin) || '');
                }
                components_3.application.EventBus.dispatch("isWalletConnected" /* IsWalletConnected */, connected);
            },
            onChainChanged: (chainIdHex) => {
                const chainId = Number(chainIdHex);
                if (eventHandlers && eventHandlers.chainChanged) {
                    eventHandlers.chainChanged(chainId);
                }
                components_3.application.EventBus.dispatch("chainChanged" /* chainChanged */, chainId);
            }
        }, providerOptions);
        return wallet;
    }
    exports.connectWallet = connectWallet;
    async function switchNetwork(chainId) {
        var _a;
        if (!isWalletConnected()) {
            components_3.application.EventBus.dispatch("chainChanged" /* chainChanged */, chainId);
            return;
        }
        const wallet = eth_wallet_3.Wallet.getInstance();
        if (((_a = wallet === null || wallet === void 0 ? void 0 : wallet.clientSideProvider) === null || _a === void 0 ? void 0 : _a.walletPlugin) === eth_wallet_3.WalletPlugin.MetaMask) {
            await wallet.switchNetwork(chainId);
        }
    }
    exports.switchNetwork = switchNetwork;
    async function logoutWallet() {
        const wallet = eth_wallet_3.Wallet.getInstance();
        await wallet.disconnect();
        localStorage.setItem('walletProvider', '');
        components_3.application.EventBus.dispatch("IsWalletDisconnected" /* IsWalletDisconnected */, false);
    }
    exports.logoutWallet = logoutWallet;
    const hasWallet = function () {
        let hasWallet = false;
        for (let wallet of walletList_1.walletList) {
            if (eth_wallet_3.Wallet.isInstalled(wallet.name)) {
                hasWallet = true;
                break;
            }
        }
        return hasWallet;
    };
    exports.hasWallet = hasWallet;
    const hasMetaMask = function () {
        return eth_wallet_3.Wallet.isInstalled(eth_wallet_3.WalletPlugin.MetaMask);
    };
    exports.hasMetaMask = hasMetaMask;
    const truncateAddress = (address) => {
        if (address === undefined || address === null)
            return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    };
    exports.truncateAddress = truncateAddress;
    const getSupportedWallets = () => {
        return walletList_1.walletList.filter(wallet => state.wallets.includes(wallet.name));
    };
    exports.getSupportedWallets = getSupportedWallets;
    const state = {
        wallets: []
    };
    const updateWallets = (options) => {
        if (options.wallets) {
            state.wallets = options.wallets;
        }
    };
    exports.updateWallets = updateWallets;
});
define("@scom/dapp/network.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/dapp/helper.ts", "@scom/dapp/wallet.ts"], function (require, exports, eth_wallet_4, helper_1, wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isDefaultNetworkFromWallet = exports.getEnv = exports.getInfuraId = exports.isValidEnv = exports.getSiteSupportedNetworks = exports.getDefaultChainId = exports.getNetworkType = exports.viewOnExplorerByAddress = exports.viewOnExplorerByTxHash = exports.getNetworkList = exports.getNetworkInfo = exports.getErc20 = exports.getWalletProvider = exports.getWallet = exports.getChainId = exports.registerSendTxEvents = exports.updateNetworks = exports.formatNumber = exports.formatDate = exports.logoutWallet = exports.connectWallet = exports.switchNetwork = exports.truncateAddress = exports.hasMetaMask = exports.hasWallet = exports.isWalletConnected = void 0;
    Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return helper_1.formatDate; } });
    Object.defineProperty(exports, "formatNumber", { enumerable: true, get: function () { return helper_1.formatNumber; } });
    Object.defineProperty(exports, "isWalletConnected", { enumerable: true, get: function () { return wallet_1.isWalletConnected; } });
    Object.defineProperty(exports, "hasWallet", { enumerable: true, get: function () { return wallet_1.hasWallet; } });
    Object.defineProperty(exports, "hasMetaMask", { enumerable: true, get: function () { return wallet_1.hasMetaMask; } });
    Object.defineProperty(exports, "truncateAddress", { enumerable: true, get: function () { return wallet_1.truncateAddress; } });
    Object.defineProperty(exports, "switchNetwork", { enumerable: true, get: function () { return wallet_1.switchNetwork; } });
    Object.defineProperty(exports, "connectWallet", { enumerable: true, get: function () { return wallet_1.connectWallet; } });
    Object.defineProperty(exports, "logoutWallet", { enumerable: true, get: function () { return wallet_1.logoutWallet; } });
    ;
    const networks = [
        {
            name: "Ethereum",
            chainId: 1,
            img: "eth",
            rpc: "https://mainnet.infura.io/v3/{InfuraId}",
            symbol: "ETH",
            env: "mainnet",
            explorerName: "Etherscan",
            explorerTxUrl: "https://etherscan.io/tx/",
            explorerAddressUrl: "https://etherscan.io/address/"
        },
        {
            name: "Kovan Test Network",
            chainId: 42,
            img: "eth",
            rpc: "https://kovan.infura.io/v3/{InfuraId}",
            symbol: "ETH",
            env: "testnet",
            explorerName: "Etherscan",
            explorerTxUrl: "https://kovan.etherscan.io/tx/",
            explorerAddressUrl: "https://kovan.etherscan.io/address/"
        },
        {
            name: "Binance Smart Chain",
            chainId: 56,
            img: "bsc",
            rpc: "https://bsc-dataseed.binance.org/",
            symbol: "BNB",
            env: "mainnet",
            explorerName: "BSCScan",
            explorerTxUrl: "https://bscscan.com/tx/",
            explorerAddressUrl: "https://bscscan.com/address/"
        },
        {
            name: "Polygon",
            chainId: 137,
            img: "polygon",
            symbol: "MATIC",
            env: "mainnet",
            explorerName: "PolygonScan",
            explorerTxUrl: "https://polygonscan.com/tx/",
            explorerAddressUrl: "https://polygonscan.com/address/"
        },
        {
            name: "Fantom Opera",
            chainId: 250,
            img: "ftm",
            rpc: "https://rpc.ftm.tools/",
            symbol: "FTM",
            env: "mainnet",
            explorerName: "FTMScan",
            explorerTxUrl: "https://ftmscan.com/tx/",
            explorerAddressUrl: "https://ftmscan.com/address/"
        },
        {
            name: "BSC Testnet",
            chainId: 97,
            img: "bsc",
            rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            symbol: "BNB",
            env: "testnet",
            explorerName: "BSCScan",
            explorerTxUrl: "https://testnet.bscscan.com/tx/",
            explorerAddressUrl: "https://testnet.bscscan.com/address/"
        },
        {
            name: "Amino Testnet",
            chainId: 31337,
            img: "amio",
            symbol: "ACT",
            env: "testnet"
        },
        {
            name: "Avalanche FUJI C-Chain",
            chainId: 43113,
            img: "avax",
            rpc: "https://api.avax-test.network/ext/bc/C/rpc",
            symbol: "AVAX",
            env: "testnet",
            explorerName: "SnowTrace",
            explorerTxUrl: "https://testnet.snowtrace.io/tx/",
            explorerAddressUrl: "https://testnet.snowtrace.io/address/"
        },
        {
            name: "Mumbai",
            chainId: 80001,
            img: "polygon",
            rpc: "https://matic-mumbai.chainstacklabs.com",
            symbol: "MATIC",
            env: "testnet",
            explorerName: "PolygonScan",
            explorerTxUrl: "https://mumbai.polygonscan.com/tx/",
            explorerAddressUrl: "https://mumbai.polygonscan.com/address/"
        },
        {
            name: "Fantom Testnet",
            chainId: 4002,
            img: "ftm",
            rpc: "https://rpc.testnet.fantom.network/",
            symbol: "FTM",
            env: "testnet",
            explorerName: "FTMScan",
            explorerTxUrl: "https://testnet.ftmscan.com/tx/",
            explorerAddressUrl: "https://testnet.ftmscan.com/address/"
        },
        {
            name: "AminoX Testnet",
            chainId: 13370,
            img: "amio",
            symbol: "ACT",
            env: "testnet",
            explorerName: "AminoX Explorer",
            explorerTxUrl: "https://aminoxtestnet.blockscout.alphacarbon.network/tx/",
            explorerAddressUrl: "https://aminoxtestnet.blockscout.alphacarbon.network/address/"
        }
    ];
    const updateNetworks = (options) => {
        if (options.env) {
            setEnv(options.env);
        }
        if (options.infuraId) {
            setInfuraId(options.infuraId);
        }
        if (options.networks) {
            setNetworkList(options.networks, options.infuraId);
        }
        if (options.defaultChainId) {
            setDefaultChainId(options.defaultChainId);
        }
    };
    exports.updateNetworks = updateNetworks;
    function registerSendTxEvents(sendTxEventHandlers) {
        const wallet = eth_wallet_4.Wallet.getInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    }
    exports.registerSendTxEvents = registerSendTxEvents;
    ;
    function getChainId() {
        return eth_wallet_4.Wallet.getInstance().chainId;
    }
    exports.getChainId = getChainId;
    ;
    function getWallet() {
        return eth_wallet_4.Wallet.getInstance();
    }
    exports.getWallet = getWallet;
    ;
    function getWalletProvider() {
        return localStorage.getItem('walletProvider') || '';
    }
    exports.getWalletProvider = getWalletProvider;
    ;
    function getErc20(address) {
        const wallet = getWallet();
        return new eth_wallet_4.Erc20(wallet, address);
    }
    exports.getErc20 = getErc20;
    ;
    const state = {
        networkMap: {},
        defaultChainId: 0,
        infuraId: "",
        env: "",
        defaultNetworkFromWallet: false
    };
    const setNetworkList = (networkList, infuraId) => {
        var _a;
        state.networkMap = {};
        state.defaultNetworkFromWallet = networkList === "*";
        if (state.defaultNetworkFromWallet) {
            const networksMap = getWallet().networksMap;
            for (const chainId in networksMap) {
                const networkInfo = networksMap[chainId];
                const rpc = networkInfo.rpcUrls && networkInfo.rpcUrls.length ? networkInfo.rpcUrls[0] : "";
                const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
                state.networkMap[networkInfo.chainId] = {
                    chainId: networkInfo.chainId,
                    name: networkInfo.chainName,
                    rpc: state.infuraId && rpc ? rpc.replace(/{InfuraId}/g, state.infuraId) : rpc,
                    symbol: ((_a = networkInfo.nativeCurrency) === null || _a === void 0 ? void 0 : _a.symbol) || "",
                    explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                    explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : "",
                };
            }
            return;
        }
        networks.forEach(network => {
            const rpc = infuraId && network.rpc ? network.rpc.replace(/{InfuraId}/g, infuraId) : network.rpc;
            state.networkMap[network.chainId] = Object.assign(Object.assign({}, network), { isDisabled: true, rpc });
        });
        if (Array.isArray(networkList)) {
            for (let network of networkList) {
                if (infuraId && network.rpc) {
                    network.rpc = network.rpc.replace(/{InfuraId}/g, infuraId);
                }
                Object.assign(state.networkMap[network.chainId], Object.assign({ isDisabled: false }, network));
            }
        }
    };
    const getNetworkInfo = (chainId) => {
        return state.networkMap[chainId];
    };
    exports.getNetworkInfo = getNetworkInfo;
    const getNetworkList = () => {
        return Object.values(state.networkMap);
    };
    exports.getNetworkList = getNetworkList;
    const viewOnExplorerByTxHash = (chainId, txHash) => {
        let network = exports.getNetworkInfo(chainId);
        if (network && network.explorerTxUrl) {
            let url = `${network.explorerTxUrl}${txHash}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByTxHash = viewOnExplorerByTxHash;
    const viewOnExplorerByAddress = (chainId, address) => {
        let network = exports.getNetworkInfo(chainId);
        if (network && network.explorerAddressUrl) {
            let url = `${network.explorerAddressUrl}${address}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByAddress = viewOnExplorerByAddress;
    const getNetworkType = (chainId) => {
        var _a;
        let network = exports.getNetworkInfo(chainId);
        return (_a = network === null || network === void 0 ? void 0 : network.explorerName) !== null && _a !== void 0 ? _a : 'Unknown';
    };
    exports.getNetworkType = getNetworkType;
    const setDefaultChainId = (chainId) => {
        state.defaultChainId = chainId;
    };
    const getDefaultChainId = () => {
        return state.defaultChainId;
    };
    exports.getDefaultChainId = getDefaultChainId;
    const getSiteSupportedNetworks = () => {
        let networkFullList = Object.values(state.networkMap);
        let list = networkFullList.filter(network => !network.isDisabled && exports.isValidEnv(network.env));
        return list;
    };
    exports.getSiteSupportedNetworks = getSiteSupportedNetworks;
    const isValidEnv = (env) => {
        const _env = state.env === 'testnet' || state.env === 'mainnet' ? state.env : "";
        return !_env || !env || env === _env;
    };
    exports.isValidEnv = isValidEnv;
    const setInfuraId = (infuraId) => {
        state.infuraId = infuraId;
    };
    const getInfuraId = () => {
        return state.infuraId;
    };
    exports.getInfuraId = getInfuraId;
    const setEnv = (env) => {
        state.env = env;
    };
    const getEnv = () => {
        return state.env;
    };
    exports.getEnv = getEnv;
    const isDefaultNetworkFromWallet = () => {
        return state.defaultNetworkFromWallet;
    };
    exports.isDefaultNetworkFromWallet = isDefaultNetworkFromWallet;
});
define("@scom/dapp/header.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    exports.default = components_4.Styles.style({
        $nest: {
            '::-webkit-scrollbar-track': {
                borderRadius: '12px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: 'unset'
            },
            '::-webkit-scrollbar-thumb': {
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2) 0% 0% no-repeat padding-box'
            },
            '.btn-network:hover': {
                backgroundColor: '#101026',
                border: '1px solid #101026'
            },
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
                    },
                    '.list-view': {
                        $nest: {
                            '.list-item:hover': {
                                $nest: {
                                    '> *': {
                                        opacity: 1
                                    }
                                }
                            },
                            '.list-item': {
                                cursor: 'pointer',
                                transition: 'all .3s ease-in',
                                $nest: {
                                    '&.disabled-network-selection': {
                                        cursor: 'default',
                                        $nest: {
                                            '&:hover > *': {
                                                opacity: '0.5 !important',
                                            }
                                        }
                                    },
                                    '> *': {
                                        opacity: .5
                                    }
                                }
                            },
                            '.list-item.is-actived': {
                                $nest: {
                                    '> *': {
                                        opacity: 1
                                    },
                                    '&:after': {
                                        content: "''",
                                        top: '50%',
                                        left: 12,
                                        position: 'absolute',
                                        background: '#20bf55',
                                        borderRadius: '50%',
                                        width: 10,
                                        height: 10,
                                        transform: 'translate3d(-50%,-50%,0)'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '.header-logo > img': {
                width: '100%',
                maxHeight: 50
            }
        }
    });
});
///<amd-module name='@scom/dapp/pathToRegexp.ts'/> 
/*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)
  *  Licensed under the MIT License.
  *  https://github.com/pillarjs/path-to-regexp/blob/1cbb9f3d9c3bff97298ec45b1bb2b0beb879babf/LICENSE
  *--------------------------------------------------------------------------------------------*/
define("@scom/dapp/pathToRegexp.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pathToRegexp = exports.tokensToRegexp = exports.regexpToFunction = exports.match = exports.tokensToFunction = exports.compile = exports.parse = void 0;
    /**
     * Tokenize input string.
     */
    function lexer(str) {
        const tokens = [];
        let i = 0;
        while (i < str.length) {
            const char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                let name = "";
                let j = i + 1;
                while (j < str.length) {
                    const code = str.charCodeAt(j);
                    if (
                    // `0-9`
                    (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name)
                    throw new TypeError(`Missing parameter name at ${i}`);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                let count = 1;
                let pattern = "";
                let j = i + 1;
                if (str[j] === "?") {
                    throw new TypeError(`Pattern cannot start with "?" at ${j}`);
                }
                while (j < str.length) {
                    if (str[j] === "\\") {
                        pattern += str[j++] + str[j++];
                        continue;
                    }
                    if (str[j] === ")") {
                        count--;
                        if (count === 0) {
                            j++;
                            break;
                        }
                    }
                    else if (str[j] === "(") {
                        count++;
                        if (str[j + 1] !== "?") {
                            throw new TypeError(`Capturing groups are not allowed at ${j}`);
                        }
                    }
                    pattern += str[j++];
                }
                if (count)
                    throw new TypeError(`Unbalanced pattern at ${i}`);
                if (!pattern)
                    throw new TypeError(`Missing pattern at ${i}`);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }
    /**
     * Parse a string for the raw tokens.
     */
    function parse(str, options = {}) {
        const tokens = lexer(str);
        const { prefixes = "./" } = options;
        const defaultPattern = `[^${escapeString(options.delimiter || "/#?")}]+?`;
        const result = [];
        let key = 0;
        let i = 0;
        let path = "";
        const tryConsume = (type) => {
            if (i < tokens.length && tokens[i].type === type)
                return tokens[i++].value;
        };
        const mustConsume = (type) => {
            const value = tryConsume(type);
            if (value !== undefined)
                return value;
            const { type: nextType, index } = tokens[i];
            throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
        };
        const consumeText = () => {
            let result = "";
            let value;
            while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            const char = tryConsume("CHAR");
            const name = tryConsume("NAME");
            const pattern = tryConsume("PATTERN");
            if (name || pattern) {
                let prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || "",
                });
                continue;
            }
            const value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            const open = tryConsume("OPEN");
            if (open) {
                const prefix = consumeText();
                const name = tryConsume("NAME") || "";
                const pattern = tryConsume("PATTERN") || "";
                const suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: name || (pattern ? key++ : ""),
                    pattern: name && !pattern ? defaultPattern : pattern,
                    prefix,
                    suffix,
                    modifier: tryConsume("MODIFIER") || "",
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }
    exports.parse = parse;
    /**
     * Compile a string to a template function for the path.
     */
    function compile(str, options) {
        return tokensToFunction(parse(str, options), options);
    }
    exports.compile = compile;
    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens, options = {}) {
        const reFlags = flags(options);
        const { encode = (x) => x, validate = true } = options;
        // Compile all the tokens into regexps.
        const matches = tokens.map((token) => {
            if (typeof token === "object") {
                return new RegExp(`^(?:${token.pattern})$`, reFlags);
            }
        });
        return (data) => {
            let path = "";
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (typeof token === "string") {
                    path += token;
                    continue;
                }
                const value = data ? data[token.name] : undefined;
                const optional = token.modifier === "?" || token.modifier === "*";
                const repeat = token.modifier === "*" || token.modifier === "+";
                if (Array.isArray(value)) {
                    if (!repeat) {
                        throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
                    }
                    if (value.length === 0) {
                        if (optional)
                            continue;
                        throw new TypeError(`Expected "${token.name}" to not be empty`);
                    }
                    for (let j = 0; j < value.length; j++) {
                        const segment = encode(value[j], token);
                        if (validate && !matches[i].test(segment)) {
                            throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                        }
                        path += token.prefix + segment + token.suffix;
                    }
                    continue;
                }
                if (typeof value === "string" || typeof value === "number") {
                    const segment = encode(String(value), token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                    }
                    path += token.prefix + segment + token.suffix;
                    continue;
                }
                if (optional)
                    continue;
                const typeOfMessage = repeat ? "an array" : "a string";
                throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
            }
            return path;
        };
    }
    exports.tokensToFunction = tokensToFunction;
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    function match(str, options) {
        const keys = [];
        const re = pathToRegexp(str, keys, options);
        return regexpToFunction(re, keys, options);
    }
    exports.match = match;
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    function regexpToFunction(re, keys, options = {}) {
        const { decode = (x) => x } = options;
        return function (pathname) {
            const m = re.exec(pathname);
            if (!m)
                return false;
            const { 0: path, index } = m;
            const params = Object.create(null);
            for (let i = 1; i < m.length; i++) {
                if (m[i] === undefined)
                    continue;
                const key = keys[i - 1];
                if (key.modifier === "*" || key.modifier === "+") {
                    params[key.name] = m[i].split(key.prefix + key.suffix).map((value) => {
                        return decode(value, key);
                    });
                }
                else {
                    params[key.name] = decode(m[i], key);
                }
            }
            return { path, index, params };
        };
    }
    exports.regexpToFunction = regexpToFunction;
    /**
     * Escape a regular expression string.
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    /**
     * Get the flags for a regexp from the options.
     */
    function flags(options) {
        return options && options.sensitive ? "" : "i";
    }
    /**
     * Pull out keys from a regexp.
     */
    function regexpToRegexp(path, keys) {
        if (!keys)
            return path;
        const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
        let index = 0;
        let execResult = groupsRegex.exec(path.source);
        while (execResult) {
            keys.push({
                // Use parenthesized substring match if available, index otherwise
                name: execResult[1] || index++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: "",
            });
            execResult = groupsRegex.exec(path.source);
        }
        return path;
    }
    /**
     * Transform an array into a regexp.
     */
    function arrayToRegexp(paths, keys, options) {
        const parts = paths.map((path) => pathToRegexp(path, keys, options).source);
        return new RegExp(`(?:${parts.join("|")})`, flags(options));
    }
    /**
     * Create a path regexp from string input.
     */
    function stringToRegexp(path, keys, options) {
        return tokensToRegexp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    function tokensToRegexp(tokens, keys, options = {}) {
        const { strict = false, start = true, end = true, encode = (x) => x, delimiter = "/#?", endsWith = "", } = options;
        const endsWithRe = `[${escapeString(endsWith)}]|$`;
        const delimiterRe = `[${escapeString(delimiter)}]`;
        let route = start ? "^" : "";
        // Iterate over the tokens and create our regexp string.
        for (const token of tokens) {
            if (typeof token === "string") {
                route += escapeString(encode(token));
            }
            else {
                const prefix = escapeString(encode(token.prefix));
                const suffix = escapeString(encode(token.suffix));
                if (token.pattern) {
                    if (keys)
                        keys.push(token);
                    if (prefix || suffix) {
                        if (token.modifier === "+" || token.modifier === "*") {
                            const mod = token.modifier === "*" ? "?" : "";
                            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
                        }
                        else {
                            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
                        }
                    }
                    else {
                        if (token.modifier === "+" || token.modifier === "*") {
                            route += `((?:${token.pattern})${token.modifier})`;
                        }
                        else {
                            route += `(${token.pattern})${token.modifier}`;
                        }
                    }
                }
                else {
                    route += `(?:${prefix}${suffix})${token.modifier}`;
                }
            }
        }
        if (end) {
            if (!strict)
                route += `${delimiterRe}?`;
            route += !options.endsWith ? "$" : `(?=${endsWithRe})`;
        }
        else {
            const endToken = tokens[tokens.length - 1];
            const isEndDelimited = typeof endToken === "string"
                ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1
                : endToken === undefined;
            if (!strict) {
                route += `(?:${delimiterRe}(?=${endsWithRe}))?`;
            }
            if (!isEndDelimited) {
                route += `(?=${delimiterRe}|${endsWithRe})`;
            }
        }
        return new RegExp(route, flags(options));
    }
    exports.tokensToRegexp = tokensToRegexp;
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp)
            return regexpToRegexp(path, keys);
        if (Array.isArray(path))
            return arrayToRegexp(path, keys, options);
        return stringToRegexp(path, keys, options);
    }
    exports.pathToRegexp = pathToRegexp;
});
define("@scom/dapp/header.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/dapp/network.ts", "@scom/dapp/header.css.ts", "@scom/dapp/assets.ts", "@scom/dapp/network.ts", "@scom/dapp/wallet.ts", "@scom/dapp/pathToRegexp.ts"], function (require, exports, components_5, eth_wallet_5, network_1, header_css_1, assets_2, network_2, wallet_2, pathToRegexp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Header = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    ;
    ;
    let Header = class Header extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this.supportedNetworks = [];
            this.walletInfo = {
                address: '',
                balance: '',
                networkId: 0
            };
            this.onChainChanged = async (chainId) => {
                this.walletInfo.networkId = chainId;
                this.selectedNetwork = network_2.getNetworkInfo(chainId);
                let wallet = eth_wallet_5.Wallet.getInstance();
                const isConnected = wallet.isConnected;
                this.walletInfo.balance = isConnected ? network_1.formatNumber((await wallet.balance).toFixed(), 2) : '0';
                this.updateConnectedStatus(isConnected);
                this.updateList(isConnected);
                this.renderMobileMenu();
                this.renderDesktopMenu();
            };
            this.updateConnectedStatus = (isConnected) => {
                var _a, _b, _c;
                if (isConnected) {
                    this.lblBalance.caption = `${this.walletInfo.balance} ${this.symbol}`;
                    this.btnWalletDetail.caption = this.shortlyAddress;
                    this.lblWalletAddress.caption = this.shortlyAddress;
                    const networkInfo = network_2.getNetworkInfo(eth_wallet_5.Wallet.getInstance().chainId);
                    this.hsViewAccount.visible = !!(networkInfo === null || networkInfo === void 0 ? void 0 : networkInfo.explorerAddressUrl);
                }
                else {
                    this.hsViewAccount.visible = false;
                }
                const isSupportedNetwork = this.selectedNetwork && this.supportedNetworks.findIndex(network => network === this.selectedNetwork) !== -1;
                if (isSupportedNetwork) {
                    const img = ((_a = this.selectedNetwork) === null || _a === void 0 ? void 0 : _a.img) ? assets_2.default.img.network[this.selectedNetwork.img] || components_5.application.assets(this.selectedNetwork.img) : undefined;
                    this.btnNetwork.icon = img ? this.$render("i-icon", { width: 26, height: 26, image: { url: img } }) : undefined;
                    this.btnNetwork.caption = (_c = (_b = this.selectedNetwork) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "";
                }
                else {
                    this.btnNetwork.icon = undefined;
                    this.btnNetwork.caption = network_1.isDefaultNetworkFromWallet() ? "Unknown Network" : "Unsupported Network";
                }
                this.btnConnectWallet.visible = !isConnected;
                this.hsBalance.visible = isConnected;
                this.pnlWalletDetail.visible = isConnected;
            };
            this.openConnectModal = () => {
                this.mdConnect.title = "Connect wallet";
                this.mdConnect.visible = true;
            };
            this.openNetworkModal = () => {
                if (network_1.isDefaultNetworkFromWallet())
                    return;
                this.mdNetwork.visible = true;
            };
            this.openWalletDetailModal = () => {
                this.mdWalletDetail.visible = true;
            };
            this.openAccountModal = (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                this.mdAccount.visible = true;
            };
            this.openSwitchModal = (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                this.mdConnect.title = "Switch wallet";
                this.mdConnect.visible = true;
            };
            this.logout = async (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                await network_2.logoutWallet();
                this.updateConnectedStatus(false);
                this.updateList(false);
                this.mdAccount.visible = false;
            };
            this.connectToProviderFunc = async (walletPlugin) => {
                if (eth_wallet_5.Wallet.isInstalled(walletPlugin)) {
                    await network_2.connectWallet(walletPlugin);
                }
                else {
                    let config = eth_wallet_5.WalletPluginConfig[walletPlugin];
                    let homepage = config && config.homepage ? config.homepage() : '';
                    window.open(homepage, '_blank');
                }
                this.mdConnect.visible = false;
            };
            this.copyWalletAddress = () => {
                components_5.application.copyToClipboard(this.walletInfo.address || "");
            };
            this.renderWalletList = () => {
                this.gridWalletList.clearInnerHTML();
                this.walletMapper = new Map();
                const walletList = wallet_2.getSupportedWallets();
                walletList.forEach((wallet) => {
                    const isActive = this.isWalletActive(wallet.name);
                    if (isActive)
                        this.currActiveWallet = wallet.name;
                    const hsWallet = (this.$render("i-hstack", { class: isActive ? 'is-actived list-item' : 'list-item', verticalAlignment: 'center', gap: 12, background: { color: Theme.colors.secondary.light }, border: { radius: 10 }, position: "relative", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, horizontalAlignment: "space-between", onClick: () => this.connectToProviderFunc(wallet.name) },
                        this.$render("i-label", { caption: wallet.displayName, margin: { left: '1rem' }, wordBreak: "break-word", font: { size: '.875rem', bold: true, color: Theme.colors.primary.dark } }),
                        this.$render("i-image", { width: 34, height: "auto", url: assets_2.default.img.wallet[wallet.img] || components_5.application.assets(wallet.img) })));
                    this.walletMapper.set(wallet.name, hsWallet);
                    this.gridWalletList.append(hsWallet);
                });
            };
            this.$eventBus = components_5.application.EventBus;
            this.registerEvent();
        }
        ;
        get symbol() {
            var _a, _b, _c;
            let symbol = '';
            if (((_a = this.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId) && ((_b = this.selectedNetwork) === null || _b === void 0 ? void 0 : _b.symbol)) {
                symbol = (_c = this.selectedNetwork) === null || _c === void 0 ? void 0 : _c.symbol;
            }
            return symbol;
        }
        get shortlyAddress() {
            const address = this.walletInfo.address;
            if (!address)
                return 'No address selected';
            return network_1.truncateAddress(address);
        }
        registerEvent() {
            let wallet = eth_wallet_5.Wallet.getInstance();
            this.$eventBus.register(this, "connectWallet" /* ConnectWallet */, this.openConnectModal);
            this.$eventBus.register(this, "isWalletConnected" /* IsWalletConnected */, async (connected) => {
                if (connected) {
                    this.walletInfo.address = wallet.address;
                    this.walletInfo.balance = network_1.formatNumber((await wallet.balance).toFixed(), 2);
                    this.walletInfo.networkId = wallet.chainId;
                }
                this.selectedNetwork = network_2.getNetworkInfo(wallet.chainId);
                this.updateConnectedStatus(connected);
                this.updateList(connected);
                this.renderMobileMenu();
                this.renderDesktopMenu();
            });
            this.$eventBus.register(this, "IsWalletDisconnected" /* IsWalletDisconnected */, async (connected) => {
                this.selectedNetwork = network_2.getNetworkInfo(wallet.chainId);
                this.updateConnectedStatus(connected);
                this.updateList(connected);
            });
            this.$eventBus.register(this, "chainChanged" /* chainChanged */, async (chainId) => {
                this.onChainChanged(chainId);
            });
        }
        init() {
            this.classList.add(header_css_1.default);
            this.selectedNetwork = network_2.getNetworkInfo(network_2.getDefaultChainId());
            super.init();
            this._menuItems = this.getAttribute("menuItems", true, []);
            this.renderMobileMenu();
            this.renderDesktopMenu();
            this.controlMenuDisplay();
            this.renderWalletList();
            this.renderNetworks();
            this.updateConnectedStatus(network_1.isWalletConnected());
            this.initData();
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener('resize', this.controlMenuDisplay.bind(this));
        }
        disconnectCallback() {
            super.disconnectCallback();
            window.removeEventListener('resize', this.controlMenuDisplay.bind(this));
        }
        controlMenuDisplay() {
            const url = assets_2.assets.logo.header;
            if (window.innerWidth < 760) {
                this.hsMobileMenu.visible = true;
                this.hsDesktopMenu.visible = false;
                if (this.imgMobileLogo.url !== url)
                    this.imgMobileLogo.url = url;
            }
            else {
                this.hsMobileMenu.visible = false;
                this.hsDesktopMenu.visible = true;
                if (this.imgDesktopLogo.url !== url)
                    this.imgDesktopLogo.url = url;
            }
        }
        updateDot(connected, type) {
            var _a, _b, _c;
            const wallet = eth_wallet_5.Wallet.getInstance();
            if (type === 'network') {
                if (this.currActiveNetworkId !== undefined && this.currActiveNetworkId !== null && this.networkMapper.has(this.currActiveNetworkId)) {
                    this.networkMapper.get(this.currActiveNetworkId).classList.remove('is-actived');
                }
                if (connected && this.networkMapper.has(wallet.chainId)) {
                    this.networkMapper.get(wallet.chainId).classList.add('is-actived');
                }
                this.currActiveNetworkId = wallet.chainId;
            }
            else {
                if (this.currActiveWallet && this.walletMapper.has(this.currActiveWallet)) {
                    this.walletMapper.get(this.currActiveWallet).classList.remove('is-actived');
                }
                if (connected && this.walletMapper.has((_a = wallet.clientSideProvider) === null || _a === void 0 ? void 0 : _a.walletPlugin)) {
                    this.walletMapper.get((_b = wallet.clientSideProvider) === null || _b === void 0 ? void 0 : _b.walletPlugin).classList.add('is-actived');
                }
                this.currActiveWallet = (_c = wallet.clientSideProvider) === null || _c === void 0 ? void 0 : _c.walletPlugin;
            }
        }
        updateList(isConnected) {
            if (isConnected && network_2.getWalletProvider() !== eth_wallet_5.WalletPlugin.MetaMask) {
                this.lblNetworkDesc.caption = "We support the following networks, please switch network in the connected wallet.";
            }
            else {
                this.lblNetworkDesc.caption = "We support the following networks, please click to connect.";
            }
            this.updateDot(isConnected, 'wallet');
            this.updateDot(isConnected, 'network');
        }
        viewOnExplorerByAddress() {
            network_2.viewOnExplorerByAddress(eth_wallet_5.Wallet.getInstance().chainId, this.walletInfo.address);
        }
        async switchNetwork(chainId) {
            if (!chainId || network_1.isDefaultNetworkFromWallet())
                return;
            await network_2.switchNetwork(chainId);
            this.mdNetwork.visible = false;
        }
        isWalletActive(walletPlugin) {
            var _a;
            const provider = walletPlugin.toLowerCase();
            return eth_wallet_5.Wallet.isInstalled(walletPlugin) && ((_a = eth_wallet_5.Wallet.getInstance().clientSideProvider) === null || _a === void 0 ? void 0 : _a.walletPlugin) === provider;
        }
        isNetworkActive(chainId) {
            return eth_wallet_5.Wallet.getInstance().chainId === chainId;
        }
        renderNetworks() {
            this.gridNetworkGroup.clearInnerHTML();
            this.networkMapper = new Map();
            this.supportedNetworks = network_2.getSiteSupportedNetworks();
            this.gridNetworkGroup.append(...this.supportedNetworks.map((network) => {
                const img = network.img ? this.$render("i-image", { url: assets_2.default.img.network[network.img] || components_5.application.assets(network.img), width: 34, height: 34 }) : [];
                const isActive = this.isNetworkActive(network.chainId);
                if (isActive)
                    this.currActiveNetworkId = network.chainId;
                const hsNetwork = (this.$render("i-hstack", { onClick: () => this.switchNetwork(network.chainId), background: { color: Theme.colors.secondary.light }, border: { radius: 10 }, position: "relative", class: isActive ? 'is-actived list-item' : 'list-item', padding: { top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' } },
                    this.$render("i-hstack", { margin: { left: '1rem' }, verticalAlignment: "center", gap: 12 },
                        img,
                        this.$render("i-label", { caption: network.name, wordBreak: "break-word", font: { size: '.875rem', bold: true, color: Theme.colors.primary.dark } }))));
                this.networkMapper.set(network.chainId, hsNetwork);
                return hsNetwork;
            }));
        }
        async initData() {
            let accountsChangedEventHandler = async (account) => {
            };
            let chainChangedEventHandler = async (hexChainId) => {
                this.updateConnectedStatus(true);
            };
            const selectedProvider = localStorage.getItem('walletProvider');
            const isValidProvider = Object.values(eth_wallet_5.WalletPlugin).includes(selectedProvider);
            if (network_2.hasWallet() && isValidProvider) {
                await network_2.connectWallet(selectedProvider, {
                    'accountsChanged': accountsChangedEventHandler,
                    'chainChanged': chainChangedEventHandler
                });
            }
        }
        getMenuPath(url, params) {
            try {
                const toPath = pathToRegexp_1.compile(url, { encode: encodeURIComponent });
                return toPath(params);
            }
            catch (err) { }
            return "";
        }
        _getMenuData(list, mode, validMenuItemsFn) {
            const menuItems = [];
            list.filter(validMenuItemsFn).forEach((item, key) => {
                const linkTarget = item.isToExternal ? '_blank' : '_self';
                const path = this.getMenuPath(item.url, item.params);
                const _menuItem = {
                    title: item.caption,
                    link: { href: '/#' + path, target: linkTarget },
                };
                if (mode === 'mobile') {
                    _menuItem.font = { color: Theme.colors.primary.main };
                    if (item.img)
                        _menuItem.icon = { width: 24, height: 24, image: { width: 24, height: 24, url: components_5.application.assets(item.img) } };
                }
                if (item.menus && item.menus.length) {
                    _menuItem.items = this._getMenuData(item.menus, mode, validMenuItemsFn);
                }
                menuItems.push(_menuItem);
            });
            return menuItems;
        }
        getMenuData(list, mode) {
            var _a;
            let chainId = ((_a = this.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId) || eth_wallet_5.Wallet.getInstance().chainId;
            let validMenuItemsFn;
            if (chainId) {
                validMenuItemsFn = (item) => !item.isDisabled && (!item.networks || item.networks.includes(chainId)) && network_1.isValidEnv(item.env);
            }
            else {
                validMenuItemsFn = (item) => !item.isDisabled && network_1.isValidEnv(item.env);
            }
            return this._getMenuData(list, mode, validMenuItemsFn);
        }
        renderMobileMenu() {
            const data = this.getMenuData(this._menuItems, 'mobile');
            this.menuMobile.data = data;
        }
        renderDesktopMenu() {
            const data = this.getMenuData(this._menuItems, 'desktop');
            this.menuDesktop.data = data;
        }
        toggleMenu() {
            this.mdMobileMenu.visible = !this.mdMobileMenu.visible;
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, background: { color: Theme.background.paper } },
                this.$render("i-grid-layout", { width: '100%', position: "relative", verticalAlignment: 'center', templateColumns: ["1fr", "auto"] },
                    this.$render("i-hstack", { id: "hsMobileMenu", verticalAlignment: "center", width: "max-content", visible: false },
                        this.$render("i-icon", { id: "hamburger", class: 'pointer', name: "bars", width: "20px", height: "20px", display: "inline-block", margin: { right: 5 }, fill: Theme.text.primary, onClick: this.toggleMenu }),
                        this.$render("i-modal", { id: "mdMobileMenu", height: "auto", minWidth: "250px", showBackdrop: false, popupPlacement: "bottomLeft", background: { color: Theme.background.modal } },
                            this.$render("i-menu", { id: "menuMobile", mode: "inline" })),
                        this.$render("i-image", { id: "imgMobileLogo", class: "header-logo", margin: { right: '0.5rem' } })),
                    this.$render("i-hstack", { id: "hsDesktopMenu", wrap: "nowrap", verticalAlignment: "center", width: "100%", overflow: "hidden" },
                        this.$render("i-image", { id: "imgDesktopLogo", class: "header-logo", margin: { right: '1.25rem' } }),
                        this.$render("i-menu", { id: "menuDesktop", width: "100%", border: { left: { color: '#192046', width: '1px', style: 'solid' } } })),
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end' },
                        this.$render("i-panel", null,
                            this.$render("i-button", { id: "btnNetwork", class: "btn-network", margin: { right: '1rem' }, padding: { top: '0.375rem', bottom: '0.375rem', left: '0.75rem', right: '0.75rem' }, background: { color: '#101026' }, border: { width: '1px', style: 'solid', color: '#101026', radius: 5 }, font: { color: Theme.text.primary }, onClick: this.openNetworkModal, caption: "Unsupported Network" })),
                        this.$render("i-hstack", { id: "hsBalance", visible: false, horizontalAlignment: "center", verticalAlignment: "center", background: { color: "#192046" }, lineHeight: "25px", border: { radius: 6 }, padding: { top: 6, bottom: 6, left: 10, right: 10 } },
                            this.$render("i-label", { id: "lblBalance", font: { color: Theme.text.primary } })),
                        this.$render("i-panel", { id: "pnlWalletDetail", visible: false },
                            this.$render("i-button", { id: "btnWalletDetail", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, margin: { left: '0.5rem' }, border: { radius: 5 }, font: { color: Theme.text.primary }, background: { color: Theme.colors.error.light }, onClick: this.openWalletDetailModal }),
                            this.$render("i-modal", { id: "mdWalletDetail", height: "auto", maxWidth: 200, minWidth: 200, showBackdrop: false, popupPlacement: "bottomRight", background: { color: "#252a48" } },
                                this.$render("i-vstack", { gap: 15, padding: { top: 10, left: 10, right: 10, bottom: 10 } },
                                    this.$render("i-button", { caption: "Account", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.text.primary }, background: { color: "transparent linear-gradient(90deg, #8C5AFF 0%, #442391 100%) 0% 0% no-repeat padding-box" }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openAccountModal }),
                                    this.$render("i-button", { caption: "Switch wallet", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.text.primary }, background: { color: "transparent linear-gradient(90deg, #8C5AFF 0%, #442391 100%) 0% 0% no-repeat padding-box" }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openSwitchModal }),
                                    this.$render("i-button", { caption: "Logout", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.text.primary }, background: { color: "transparent linear-gradient(90deg, #8C5AFF 0%, #442391 100%) 0% 0% no-repeat padding-box" }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.logout })))),
                        this.$render("i-button", { id: "btnConnectWallet", caption: "Connect Wallet", border: { radius: 5 }, font: { color: Theme.text.primary }, padding: { top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' }, margin: { left: '0.5rem' }, onClick: this.openConnectModal }))),
                this.$render("i-modal", { id: 'mdNetwork', title: 'Supported Network', class: 'os-modal', width: 440, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { height: '100%', lineHeight: 1.5, padding: { left: '1rem', right: '1rem', bottom: '2rem' } },
                        this.$render("i-label", { id: 'lblNetworkDesc', margin: { top: '1rem' }, font: { size: '.875rem' }, wordBreak: "break-word", caption: 'We support the following networks, please click to connect.' }),
                        this.$render("i-hstack", { margin: { left: '-1.25rem', right: '-1.25rem' }, height: '100%' },
                            this.$render("i-grid-layout", { id: 'gridNetworkGroup', font: { color: '#f05e61' }, height: "calc(100% - 160px)", width: "100%", overflow: { y: 'auto' }, margin: { top: '1.5rem' }, padding: { left: '1.25rem', right: '1.25rem' }, columnsPerRow: 1, templateRows: ['max-content'], class: 'list-view', gap: { row: '0.5rem' } })))),
                this.$render("i-modal", { id: 'mdConnect', title: 'Connect Wallet', class: 'os-modal', width: 440, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { padding: { left: '1rem', right: '1rem', bottom: '2rem' }, lineHeight: 1.5 },
                        this.$render("i-label", { font: { size: '.875rem' }, caption: 'Recommended wallet for Chrome', margin: { top: '1rem' }, wordBreak: "break-word" }),
                        this.$render("i-panel", null,
                            this.$render("i-grid-layout", { id: 'gridWalletList', class: 'list-view', margin: { top: '0.5rem' }, columnsPerRow: 1, templateRows: ['max-content'], gap: { row: 8 } })))),
                this.$render("i-modal", { id: 'mdAccount', title: 'Account', class: 'os-modal', width: 440, height: 200, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { width: "100%", padding: { top: "1.75rem", bottom: "1rem", left: "2.75rem", right: "2.75rem" }, gap: 5 },
                        this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: 'center' },
                            this.$render("i-label", { font: { size: '0.875rem' }, caption: 'Connected with' }),
                            this.$render("i-button", { caption: 'Logout', font: { color: Theme.text.primary }, background: { color: Theme.colors.error.light }, padding: { top: 6, bottom: 6, left: 10, right: 10 }, border: { radius: 5 }, onClick: this.logout })),
                        this.$render("i-label", { id: "lblWalletAddress", font: { size: '1.25rem', bold: true, color: Theme.colors.primary.main }, lineHeight: 1.5 }),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "2.5rem" },
                            this.$render("i-hstack", { class: "pointer", verticalAlignment: "center", tooltip: { content: `The address has been copied`, trigger: 'click' }, gap: "0.5rem", onClick: this.copyWalletAddress },
                                this.$render("i-icon", { name: "copy", width: "16px", height: "16px", fill: Theme.text.secondary }),
                                this.$render("i-label", { caption: "Copy Address", font: { size: "0.875rem", bold: true } })),
                            this.$render("i-hstack", { id: "hsViewAccount", class: "pointer", verticalAlignment: "center", onClick: this.viewOnExplorerByAddress.bind(this) },
                                this.$render("i-icon", { name: "external-link-alt", width: "16", height: "16", fill: Theme.text.secondary, display: "inline-block" }),
                                this.$render("i-label", { caption: "View on Explorer", margin: { left: "0.5rem" }, font: { size: "0.875rem", bold: true } })))))));
        }
    };
    __decorate([
        components_5.observable()
    ], Header.prototype, "walletInfo", void 0);
    Header = __decorate([
        components_5.customElements('main-header')
    ], Header);
    exports.Header = Header;
});
define("@scom/dapp/footer.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logoStyle = void 0;
    exports.logoStyle = components_6.Styles.style({
        $nest: {
            '> img': {
                width: '100%',
                maxHeight: 50
            }
        }
    });
});
define("@scom/dapp/footer.tsx", ["require", "exports", "@ijstech/components", "@scom/dapp/footer.css.ts", "@scom/dapp/assets.ts"], function (require, exports, components_7, footer_css_1, assets_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    ;
    let Footer = class Footer extends components_7.Module {
        init() {
            super.init();
            this.updateLogo = this.updateLogo.bind(this);
            this.updateLogo();
            const version = this.getAttribute("version", true, "");
            this.lblVersion.caption = version ? "Version: " + version : version;
            this.lblVersion.visible = !!version;
            const copyright = this.getAttribute('copyrightInfo', true, "");
            this.lblCopyright.caption = version ? copyright + " |" : copyright;
            ;
            this.lblCopyright.visible = !!copyright;
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener('resize', this.updateLogo);
        }
        disconnectCallback() {
            super.disconnectCallback();
            window.removeEventListener('resize', this.updateLogo);
        }
        updateLogo() {
            const url = assets_3.assets.logo.footer;
            if (this.imgLogo.url !== url)
                this.imgLogo.url = url;
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '1rem', bottom: '1rem', right: '2rem', left: '2rem' }, background: { color: components_7.Styles.Theme.ThemeVars.background.main } },
                this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", width: "100%" },
                    this.$render("i-vstack", { gap: "0.5rem", width: "100%" },
                        this.$render("i-hstack", { padding: { bottom: '0.5rem' }, border: { bottom: { width: 1, style: 'solid', color: Theme.divider } }, verticalAlignment: "center", gap: 8 },
                            this.$render("i-image", { id: "imgLogo", class: footer_css_1.logoStyle }),
                            this.$render("i-label", { id: "lblPoweredBy", caption: 'Powered by Secure Compute', font: { bold: true } })),
                        this.$render("i-hstack", { gap: 4, verticalAlignment: "center", wrap: "wrap" },
                            this.$render("i-label", { id: "lblCopyright", font: { color: Theme.text.secondary, size: '0.875em' } }),
                            this.$render("i-label", { id: "lblVersion", font: { color: Theme.text.secondary, size: '0.875em' } }))))));
        }
    };
    Footer = __decorate([
        components_7.customElements('main-footer')
    ], Footer);
    exports.Footer = Footer;
});
define("@scom/dapp", ["require", "exports", "@ijstech/components", "@scom/dapp/index.css.ts", "@scom/dapp/network.ts", "@scom/dapp/wallet.ts", "@scom/dapp/header.tsx", "@scom/dapp/footer.tsx", "@scom/dapp/pathToRegexp.ts", "@scom/dapp/assets.ts"], function (require, exports, components_8, index_css_1, network_3, wallet_3, header_1, footer_1, pathToRegexp_2, assets_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = exports.Header = void 0;
    Object.defineProperty(exports, "Header", { enumerable: true, get: function () { return header_1.Header; } });
    Object.defineProperty(exports, "Footer", { enumerable: true, get: function () { return footer_1.Footer; } });
    components_8.Styles.Theme.applyTheme(components_8.Styles.Theme.darkTheme);
    ;
    ;
    ;
    let MainLauncher = class MainLauncher extends components_8.Module {
        constructor(parent, options) {
            var _a, _b;
            super(parent, options);
            this.mergeTheme = (target, theme) => {
                for (const key of Object.keys(theme)) {
                    if (theme[key] instanceof Object) {
                        Object.assign(theme[key], this.mergeTheme(target[key], theme[key]));
                    }
                }
                Object.assign(target || {}, theme);
                return target;
            };
            this.classList.add(index_css_1.default);
            this._options = options;
            let defaultRoute = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.find(route => route.default);
            if (defaultRoute && !location.hash) {
                const toPath = pathToRegexp_2.compile(defaultRoute.url, { encode: encodeURIComponent });
                location.hash = toPath();
            }
            else {
                this.handleHashChange();
            }
        }
        ;
        async init() {
            window.onhashchange = this.handleHashChange.bind(this);
            this.menuItems = this.options.menus || [];
            assets_4.assets.breakpoints = this.options.breakpoints;
            network_3.updateNetworks(this.options);
            wallet_3.updateWallets(this.options);
            this.updateThemes(this.options.themes);
            super.init();
        }
        ;
        hideCurrentModule() {
            if (this.currentModule) {
                this.currentModule.style.display = 'none';
                this.currentModule.onHide();
            }
        }
        async getModuleByPath(path) {
            let menu;
            let params;
            let list = [...this._options.routes || [], ...this._options.menus || []];
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.url == path) {
                    menu = item;
                    break;
                }
                else {
                    if (!item.regex)
                        item.regex = pathToRegexp_2.match(item.url, { decode: decodeURIComponent });
                    let _match = item.regex(path);
                    if (_match !== false) {
                        menu = item;
                        params = "params" in menu ? Object.assign(Object.assign({}, menu.params), _match.params) : _match.params;
                        break;
                    }
                    ;
                }
                ;
            }
            ;
            if (menu) {
                let menuObj = menu;
                if (!menuObj.moduleObject) {
                    menuObj.moduleObject = await components_8.application.loadModule(menu.module, this._options);
                    if (menuObj.moduleObject)
                        menuObj.moduleObject.onLoad();
                }
                return {
                    module: menuObj.moduleObject,
                    params: params
                };
            }
        }
        ;
        async handleHashChange() {
            let path = location.hash.split("?")[0];
            if (path.startsWith('#/'))
                path = path.substring(1);
            let module = await this.getModuleByPath(path);
            if ((module === null || module === void 0 ? void 0 : module.module) != this.currentModule)
                this.hideCurrentModule();
            this.currentModule = module === null || module === void 0 ? void 0 : module.module;
            if (module) {
                if (this.pnlMain.contains(module.module))
                    module.module.style.display = 'initial';
                else
                    this.pnlMain.append(module.module);
                module.module.onShow(module.params);
            }
            ;
        }
        ;
        updateThemes(themes) {
            if (!themes)
                return;
            if (themes.dark) {
                this.mergeTheme(components_8.Styles.Theme.darkTheme, themes.dark);
            }
            if (themes.light) {
                this.mergeTheme(components_8.Styles.Theme.defaultTheme, themes.light);
            }
            const theme = themes.default === 'light' ? components_8.Styles.Theme.defaultTheme : components_8.Styles.Theme.darkTheme;
            components_8.Styles.Theme.applyTheme(theme);
        }
        async render() {
            return this.$render("i-vstack", { height: "inherit" },
                this.$render("main-header", { id: "headerElm", menuItems: this.menuItems, height: "auto", width: "100%" }),
                this.$render("i-panel", { id: "pnlMain", stack: { grow: "1", shrink: "0" } }),
                this.$render("main-footer", { id: "footerElm", stack: { shrink: '0' }, class: 'footer', height: "auto", width: "100%", copyrightInfo: this._options.copyrightInfo, version: this._options.version }));
        }
        ;
    };
    MainLauncher = __decorate([
        components_8.customModule
    ], MainLauncher);
    exports.default = MainLauncher;
    ;
});
