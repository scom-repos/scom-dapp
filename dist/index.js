var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("assets", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_1.application.currentModuleDir;
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
            },
            wallet: {
                metamask: fullPath('img/wallet/metamask.png'),
                trustwallet: fullPath('img/wallet/trustwallet.svg'),
                binanceChainWallet: fullPath('img/wallet/binance-chain-wallet.svg'),
            }
        },
        fullPath
    };
});
define("index.css", ["require", "exports", "@ijstech/components", "assets"], function (require, exports, components_2, assets_1) {
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
    components_2.Styles.Theme.darkTheme.text.primary = '#939393';
    components_2.Styles.Theme.darkTheme.text.secondary = '#fff';
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
define("helper", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
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
define("walletList", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
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
define("wallet", ["require", "exports", "@ijstech/components", "walletList", "@ijstech/eth-wallet"], function (require, exports, components_3, walletList_1, eth_wallet_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.truncateAddress = exports.hasMetaMask = exports.hasWallet = exports.logoutWallet = exports.switchNetwork = exports.connectWallet = exports.isWalletConnected = void 0;
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
});
define("network", ["require", "exports", "@ijstech/eth-wallet", "helper", "wallet", "walletList"], function (require, exports, eth_wallet_4, helper_1, wallet_1, walletList_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInfuraId = exports.getSiteSupportedNetworks = exports.getDefaultChainId = exports.getNetworkType = exports.viewOnExplorerByAddress = exports.viewOnExplorerByTxHash = exports.getSupportedNetworkIds = exports.getNetworkList = exports.getNetworkInfo = exports.getErc20 = exports.getWalletProvider = exports.getWallet = exports.getChainId = exports.registerSendTxEvents = exports.updateNetworks = exports.NativeTokenByChainId = exports.formatNumber = exports.formatDate = exports.walletList = exports.logoutWallet = exports.connectWallet = exports.switchNetwork = exports.truncateAddress = exports.hasMetaMask = exports.hasWallet = exports.isWalletConnected = void 0;
    Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return helper_1.formatDate; } });
    Object.defineProperty(exports, "formatNumber", { enumerable: true, get: function () { return helper_1.formatNumber; } });
    Object.defineProperty(exports, "isWalletConnected", { enumerable: true, get: function () { return wallet_1.isWalletConnected; } });
    Object.defineProperty(exports, "hasWallet", { enumerable: true, get: function () { return wallet_1.hasWallet; } });
    Object.defineProperty(exports, "hasMetaMask", { enumerable: true, get: function () { return wallet_1.hasMetaMask; } });
    Object.defineProperty(exports, "truncateAddress", { enumerable: true, get: function () { return wallet_1.truncateAddress; } });
    Object.defineProperty(exports, "switchNetwork", { enumerable: true, get: function () { return wallet_1.switchNetwork; } });
    Object.defineProperty(exports, "connectWallet", { enumerable: true, get: function () { return wallet_1.connectWallet; } });
    Object.defineProperty(exports, "logoutWallet", { enumerable: true, get: function () { return wallet_1.logoutWallet; } });
    Object.defineProperty(exports, "walletList", { enumerable: true, get: function () { return walletList_2.walletList; } });
    ;
    exports.NativeTokenByChainId = {
        5: { address: undefined, decimals: 18, symbol: "ETH", name: 'ETH' },
    };
    const updateNetworks = (options) => {
        if (options.networks) {
            setNetworkList(options.networks, options.infuraId);
        }
        if (options.defaultChainId) {
            setDefaultChainId(options.defaultChainId);
        }
        if (options.infuraId) {
            setInfuraId(options.infuraId);
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
        supportedNetworkId: [],
        infuraId: "",
    };
    const setNetworkList = (networkList, infuraId) => {
        state.networkMap = {};
        state.supportedNetworkId = [];
        for (let network of networkList) {
            if (infuraId && network.rpc) {
                network.rpc = network.rpc.replace(/{InfuraId}/g, infuraId);
            }
            state.networkMap[network.chainId] = network;
            state.supportedNetworkId.push(network.chainId);
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
    const getSupportedNetworkIds = () => {
        return state.supportedNetworkId;
    };
    exports.getSupportedNetworkIds = getSupportedNetworkIds;
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
        let list = networkFullList.filter(network => !exports.getNetworkInfo(network.chainId).isDisabled);
        return list;
    };
    exports.getSiteSupportedNetworks = getSiteSupportedNetworks;
    const setInfuraId = (infuraId) => {
        state.infuraId = infuraId;
    };
    const getInfuraId = () => {
        return state.infuraId;
    };
    exports.getInfuraId = getInfuraId;
});
define("header.css", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    exports.default = components_4.Styles.style({
        backgroundColor: Theme.background.default,
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
            }
        }
    });
});
define("header", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "network", "header.css", "assets", "network"], function (require, exports, components_5, eth_wallet_5, network_1, header_css_1, assets_2, network_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Header = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    ;
    let Header = class Header extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
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
            };
            this.updateConnectedStatus = (isConnected) => {
                if (isConnected) {
                    this.lblBalance.caption = `${this.walletInfo.balance} ${this.symbol}`;
                    this.btnWalletDetail.caption = this.shortlyAddress;
                    this.lblWalletAddress.caption = this.shortlyAddress;
                    const networkType = network_2.getNetworkType(eth_wallet_5.Wallet.getInstance().chainId);
                    this.lblViewAccount.caption = `View on ${networkType}`;
                    this.hsViewAccount.visible = networkType !== 'Unknown';
                }
                else {
                    this.hsViewAccount.visible = false;
                }
                if (this.selectedNetwork) {
                    this.btnNetwork.icon = this.$render("i-icon", { width: 26, height: 26, image: { url: assets_2.default.img.network[this.selectedNetwork.img] || components_5.application.assets(this.selectedNetwork.img) } });
                    this.btnNetwork.caption = this.selectedNetwork.name;
                }
                else {
                    this.btnNetwork.icon = undefined;
                    this.btnNetwork.caption = "Unsupported Network";
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
                network_2.walletList.forEach((wallet) => {
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
            var _a, _b, _c, _d;
            let symbol = '';
            if (((_a = this.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId) && network_2.NativeTokenByChainId[(_b = this.selectedNetwork) === null || _b === void 0 ? void 0 : _b.chainId]) {
                symbol = (_d = network_2.NativeTokenByChainId[(_c = this.selectedNetwork) === null || _c === void 0 ? void 0 : _c.chainId]) === null || _d === void 0 ? void 0 : _d.symbol;
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
            this.logo = this.getAttribute("logo", true, "");
            super.init();
            this._menuItems = this.getAttribute("menuItems", true, []);
            this.renderMobileMenu();
            this.renderDesktopMenu();
            this.controlMenuDisplay();
            this.renderWalletList();
            this.renderNetworks();
            this.updateConnectedStatus(network_1.isWalletConnected());
            this.initData();
            if (this.logo) {
                let logo = components_5.application.assets(this.logo);
                this.imgDesktopLogo.url = logo;
                this.imgMobileLogo.url = logo;
            }
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
            if (window.innerWidth < 760) {
                this.hsMobileMenu.visible = true;
                this.hsDesktopMenu.visible = false;
            }
            else {
                this.hsMobileMenu.visible = false;
                this.hsDesktopMenu.visible = true;
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
            if (!chainId)
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
            const networksList = network_2.getNetworkList();
            this.gridNetworkGroup.append(...networksList.map((network) => {
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
        _getMenuData(list, mode, validMenuItemsFn) {
            const menuItems = [];
            list.filter(validMenuItemsFn).forEach((item, key) => {
                const linkTarget = item.isToExternal ? '_blank' : '_self';
                const _menuItem = {
                    title: item.caption,
                    link: { href: '/#' + item.url, target: linkTarget },
                };
                if (mode === 'mobile') {
                    _menuItem.font = { color: Theme.colors.primary.main };
                    if (item.img)
                        _menuItem.icon = { width: 24, height: 24, image: { width: 24, height: 24, url: components_5.application.assets(item.img) } };
                }
                if (item.subItems && item.subItems.length) {
                    _menuItem.items = this._getMenuData(item.subItems, mode, validMenuItemsFn);
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
                validMenuItemsFn = (item) => !item.isDisabled && (!item.supportedChainIds || item.supportedChainIds.includes(chainId));
            }
            else {
                validMenuItemsFn = (item) => !item.isDisabled;
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
            return (this.$render("i-panel", { padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } },
                this.$render("i-hstack", { width: "100%", position: "relative", horizontalAlignment: 'space-between', wrap: 'wrap' },
                    this.$render("i-hstack", { id: "hsMobileMenu", verticalAlignment: "center", width: 100, visible: false },
                        this.$render("i-icon", { id: "hamburger", class: 'pointer', name: "bars", width: "20px", height: "20px", display: "inline-block", margin: { right: 5 }, fill: Theme.text.secondary, onClick: this.toggleMenu }),
                        this.$render("i-modal", { id: "mdMobileMenu", height: "auto", minWidth: "250px", showBackdrop: false, popupPlacement: "bottomLeft", background: { color: Theme.background.modal } },
                            this.$render("i-menu", { id: "menuMobile", mode: "inline" })),
                        this.$render("i-image", { height: "100%", url: "", id: "imgMobileLogo", margin: { left: '0.5rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { id: "hsDesktopMenu", wrap: "nowrap", verticalAlignment: "center", maxWidth: "calc(100% - 640px)", width: "100%" },
                        this.$render("i-image", { stack: { shrink: '0' }, height: "100%", url: "", id: "imgDesktopLogo", margin: { left: '0.5rem', right: '1.25rem' } }),
                        this.$render("i-menu", { id: "menuDesktop", width: "100%", border: { left: { color: '#192046', width: '1px', style: 'solid' } } })),
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end' },
                        this.$render("i-panel", null,
                            this.$render("i-button", { id: "btnNetwork", class: "btn-network", margin: { right: '1rem' }, padding: { top: '0.375rem', bottom: '0.375rem', left: '0.75rem', right: '0.75rem' }, background: { color: '#101026' }, border: { width: '1px', style: 'solid', color: '#101026', radius: 5 }, font: { color: Theme.text.secondary }, onClick: this.openNetworkModal, caption: "Unsupported Network" })),
                        this.$render("i-hstack", { id: "hsBalance", visible: false, horizontalAlignment: "center", verticalAlignment: "center", background: { color: "#192046" }, lineHeight: "25px", border: { radius: 6 }, padding: { top: 6, bottom: 6, left: 10, right: 10 } },
                            this.$render("i-label", { id: "lblBalance", font: { color: Theme.text.secondary } })),
                        this.$render("i-panel", { id: "pnlWalletDetail", visible: false },
                            this.$render("i-button", { id: "btnWalletDetail", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, margin: { left: '0.5rem' }, border: { radius: 5 }, font: { color: Theme.text.secondary }, background: { color: Theme.colors.error.light }, onClick: this.openWalletDetailModal }),
                            this.$render("i-modal", { id: "mdWalletDetail", height: "auto", maxWidth: 200, minWidth: 200, showBackdrop: false, popupPlacement: "bottomRight", background: { color: "#252a48" } },
                                this.$render("i-vstack", { gap: 15, padding: { top: 10, left: 10, right: 10, bottom: 10 } },
                                    this.$render("i-button", { caption: "Account", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.text.secondary }, background: { color: "transparent linear-gradient(90deg, #8C5AFF 0%, #442391 100%) 0% 0% no-repeat padding-box" }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openAccountModal }),
                                    this.$render("i-button", { caption: "Switch wallet", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.text.secondary }, background: { color: "transparent linear-gradient(90deg, #8C5AFF 0%, #442391 100%) 0% 0% no-repeat padding-box" }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openConnectModal }),
                                    this.$render("i-button", { caption: "Logout", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.text.secondary }, background: { color: "transparent linear-gradient(90deg, #8C5AFF 0%, #442391 100%) 0% 0% no-repeat padding-box" }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.logout })))),
                        this.$render("i-button", { id: "btnConnectWallet", caption: "Connect Wallet", border: { radius: 5 }, font: { color: Theme.text.secondary }, padding: { top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' }, margin: { left: '0.5rem' }, onClick: this.openConnectModal }))),
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
                            this.$render("i-button", { caption: 'Logout', font: { color: Theme.text.secondary }, background: { color: Theme.colors.error.light }, padding: { top: 6, bottom: 6, left: 10, right: 10 }, border: { radius: 5 }, onClick: this.logout })),
                        this.$render("i-label", { id: "lblWalletAddress", font: { size: '1.25rem', bold: true, color: Theme.colors.primary.main }, lineHeight: 1.5 }),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "2.5rem" },
                            this.$render("i-hstack", { class: "pointer", verticalAlignment: "center", tooltip: { content: `The address has been copied`, trigger: 'click' }, gap: "0.5rem", onClick: this.copyWalletAddress },
                                this.$render("i-icon", { name: "copy", width: "16px", height: "16px", fill: Theme.text.primary }),
                                this.$render("i-label", { caption: "Copy Address", font: { size: "0.875rem", bold: true } })),
                            this.$render("i-hstack", { id: "hsViewAccount", class: "pointer", verticalAlignment: "center", onClick: this.viewOnExplorerByAddress.bind(this) },
                                this.$render("i-icon", { name: "external-link-alt", width: "16", height: "16", fill: Theme.text.primary, display: "inline-block" }),
                                this.$render("i-label", { id: "lblViewAccount", caption: "View on Etherscan", margin: { left: "0.5rem" }, font: { size: "0.875rem", bold: true } })))))));
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
define("footer", ["require", "exports", "@ijstech/components"], function (require, exports, components_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    ;
    let Footer = class Footer extends components_6.Module {
        init() {
            super.init();
            const logo = this.getAttribute('logo', true, "");
            if (logo) {
                this.imgLogo.url = components_6.application.assets(logo);
            }
            ;
            const copyright = this.getAttribute('copyrightInfo', true, "");
            this.lblCopyright.caption = copyright;
            this.lblCopyright.visible = !!copyright;
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '1.75rem', bottom: '1.75rem', left: '1rem', right: '1rem' } },
                this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", width: "100%", height: 60 },
                    this.$render("i-vstack", { gap: "1rem", height: "100%" },
                        this.$render("i-image", { stack: { shrink: '0' }, height: "100%", url: "", id: "imgLogo", margin: { left: '0.5rem', right: '1.25rem' } }),
                        this.$render("i-label", { id: "lblCopyright", font: { color: Theme.text.primary, size: '0.875em' } })))));
        }
    };
    Footer = __decorate([
        components_6.customElements('main-footer')
    ], Footer);
    exports.Footer = Footer;
});
/*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)
  *  Licensed under the MIT License.
  *  https://github.com/pillarjs/path-to-regexp/blob/1cbb9f3d9c3bff97298ec45b1bb2b0beb879babf/LICENSE
  *--------------------------------------------------------------------------------------------*/
define("pathToRegexp", ["require", "exports"], function (require, exports) {
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
define("@scom/dapp", ["require", "exports", "@ijstech/components", "index.css", "network", "header", "footer", "pathToRegexp"], function (require, exports, components_7, index_css_1, network_3, header_1, footer_1, pathToRegexp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = exports.Header = void 0;
    Object.defineProperty(exports, "Header", { enumerable: true, get: function () { return header_1.Header; } });
    Object.defineProperty(exports, "Footer", { enumerable: true, get: function () { return footer_1.Footer; } });
    components_7.Styles.Theme.applyTheme(components_7.Styles.Theme.darkTheme);
    ;
    ;
    ;
    let MainLauncher = class MainLauncher extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
            this.classList.add(index_css_1.default);
            this._options = options;
        }
        ;
        async init() {
            window.onhashchange = this.handleHashChange.bind(this);
            this.menuItems = this.options.menus || [];
            this.logo = this.options.logo || "";
            network_3.updateNetworks(this.options);
            super.init();
            this.handleHashChange();
        }
        ;
        hideCurrentModule() {
            if (this.currentModule)
                this.currentModule.style.display = 'none';
        }
        async getModuleByPath(path) {
            let menu;
            let params;
            for (let i = 0; i < this._options.menus.length; i++) {
                let item = this._options.menus[i];
                if (item.url == path) {
                    menu = item;
                    break;
                }
                else {
                    if (!item.regex)
                        item.regex = pathToRegexp_1.match(item.url);
                    else {
                        let match = item.regex(path);
                        if (match !== false) {
                            menu = item;
                            params = match.params;
                            break;
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;
            if (menu) {
                let menuObj = menu;
                if (!menuObj.moduleObject)
                    menuObj.moduleObject = await components_7.application.loadModule(menu.module, this._options);
                return menuObj.moduleObject;
            }
            ;
        }
        ;
        async handleHashChange() {
            let path = location.hash.split("?")[0];
            if (path.startsWith('#/'))
                path = path.substring(1);
            let module = await this.getModuleByPath(path);
            if (module != this.currentModule)
                this.hideCurrentModule();
            this.currentModule = module;
            if (module) {
                if (this.pnlMain.contains(module))
                    module.style.display = 'initial';
                else
                    this.pnlMain.append(module);
            }
            ;
        }
        ;
        async render() {
            return this.$render("i-vstack", { height: "inherit" },
                this.$render("main-header", { logo: this.options.logo, id: "headerElm", menuItems: this.menuItems, height: "auto", width: "100%" }),
                this.$render("i-panel", { id: "pnlMain", stack: { grow: "1", shrink: "0" } }),
                this.$render("main-footer", { id: "footerElm", background: { color: components_7.Styles.Theme.ThemeVars.background.main }, padding: { top: '2rem', bottom: '2rem', right: '2rem', left: '2rem' }, stack: { shrink: '0' }, class: 'footer', height: "auto", width: "100%", logo: this.options.logo, copyrightInfo: this._options.copyrightInfo }));
        }
        ;
    };
    MainLauncher = __decorate([
        components_7.customModule
    ], MainLauncher);
    exports.default = MainLauncher;
    ;
});
