import {
  application
} from '@ijstech/components';
import {IClientProviderOptions, IClientSideProvider, IClientSideProviderEvents, IWallet, MetaMaskProvider, Wallet, Web3ModalProvider } from '@ijstech/eth-wallet';
import { EventId } from './constants';
import { getInfuraId, getSiteSupportedNetworks } from './network';

export enum WalletPlugin {
  MetaMask = 'metamask',
  WalletConnect = 'walletconnect',
  // Coin98 = 'coin98',
  // TrustWallet = 'trustwallet',
  // BinanceChainWallet = 'binancechainwallet',
  // ONTOWallet = 'onto',
  // BitKeepWallet = 'bitkeepwallet',
  // FrontierWallet = 'frontierwallet',
}

const state = {
  wallets: [],
  showThemeButton: false,
  walletPluginMap: {} as Record<WalletPlugin, IClientSideProvider>
}

export type WalletPluginItemType = {
  provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => IClientSideProvider;
}

export type WalletPluginConfigType = Record<WalletPlugin, WalletPluginItemType>;

export const WalletPluginConfig: WalletPluginConfigType = {
  [WalletPlugin.MetaMask]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new MetaMaskProvider(wallet, events, options);
    }
  },
  // [WalletPlugin.Coin98]: {
  //   provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
  //     return new Coin98Provider(wallet, events, options);
  //   }
  // },
  // [WalletPlugin.TrustWallet]: {
  //   provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
  //     return new TrustWalletProvider(wallet, events, options);
  //   }
  // },
  // [WalletPlugin.BinanceChainWallet]: {
  //   provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
  //     return new BinanceChainWalletProvider(wallet, events, options);
  //   }
  // },
  // [WalletPlugin.ONTOWallet]: {
  //   provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
  //     return new ONTOWalletProvider(wallet, events, options);
  //   }
  // },
  // [WalletPlugin.BitKeepWallet]: {
  //   provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
  //     return new BitKeepWalletProvider(wallet, events, options);
  //   }
  // },
  // [WalletPlugin.FrontierWallet]: {
  //   provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
  //     return new FrontierWalletProvider(wallet, events, options);
  //   },
  // },
  [WalletPlugin.WalletConnect]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new Web3ModalProvider(wallet, events, options);
    }
  }
}

export function initWalletPlugins(eventHandlers?: { [key: string]: Function }) {
  let wallet: any = Wallet.getClientInstance();
  const events = {
    onAccountChanged: async (account: string) => {
      let connected = !!account;
      if (eventHandlers && eventHandlers.accountsChanged) {
        let { requireLogin, isLoggedIn } = await eventHandlers.accountsChanged(account);
        if (requireLogin && !isLoggedIn) connected = false;
      }
      if (connected) {
        localStorage.setItem('walletProvider', Wallet.getClientInstance()?.clientSideProvider?.name || '');
        document.cookie = `scom__wallet=${Wallet.getClientInstance()?.clientSideProvider?.name || ''}`;
      }
      application.EventBus.dispatch(EventId.IsWalletConnected, connected);
    },
    onChainChanged: async (chainIdHex: string) => {
      const chainId = Number(chainIdHex);

      if (eventHandlers && eventHandlers.chainChanged) {
        eventHandlers.chainChanged(chainId);
      }
      application.EventBus.dispatch(EventId.chainChanged, chainId);
    }
  }
  let networkList = getSiteSupportedNetworks();
  const rpcs: { [chainId: number]: string } = {}
  for (const network of networkList) {
    let rpc = network.rpc
    if (rpc) rpcs[network.chainId] = rpc;
  }

  const supportedPluginNames = Object.keys(WalletPluginConfig).filter(pluginName => state.wallets.includes(pluginName))
  for (let pluginName of supportedPluginNames) {
    let providerOptions;
    if (pluginName == WalletPlugin.WalletConnect) {
      providerOptions = {
        name: pluginName,
        infuraId: getInfuraId(),
        bridge: "https://bridge.walletconnect.org",
        rpc: rpcs,
        useDefaultProvider: true
      }
    }
    else {
      providerOptions = {
        name: pluginName,
        infuraId: getInfuraId(),
        rpc: rpcs,
        useDefaultProvider: true
      }
    }
    let provider = WalletPluginConfig[pluginName as WalletPlugin].provider(wallet, events, providerOptions);
    setWalletPluginProvider(pluginName as WalletPlugin, provider);
  }
}

export async function connectWallet(walletPlugin: WalletPlugin, eventHandlers?: { [key: string]: Function }):Promise<IWallet> {
  // let walletProvider = localStorage.getItem('walletProvider') || '';
  let wallet = Wallet.getClientInstance();
  if (!wallet.chainId) {
    // wallet.chainId = getDefaultChainId();
  }
  let provider = getWalletPluginProvider(walletPlugin);
  if (provider?.installed()) {
    await wallet.connect(provider);
  }
  return wallet;
}

export async function logoutWallet() {
  const wallet = Wallet.getClientInstance();
  await wallet.disconnect();
  localStorage.setItem('walletProvider', '');
  application.EventBus.dispatch(EventId.IsWalletDisconnected, false);
}

export const truncateAddress = (address: string) => {
  if (address === undefined || address === null) return '';
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

export const getSupportedWalletProviders = () => {
  const walletPluginMap = getWalletPluginMap();
  return Object.keys(walletPluginMap).filter(pluginName => state.wallets.includes(pluginName)).map(pluginName => walletPluginMap[pluginName as WalletPlugin]);
}

export function isWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export const hasWallet = function () {
  let hasWallet = false;
  const walletPluginMap = getWalletPluginMap();
  for (let pluginName in walletPluginMap) {
    const provider = walletPluginMap[pluginName];
    if (provider.installed()) {
      hasWallet = true;
      break;
    } 
  }
  return hasWallet;
}

export const hasMetaMask = function () {
  const provider = getWalletPluginProvider(WalletPlugin.MetaMask);
  return provider.installed();
}

export async function switchNetwork(chainId: number) {
  if (!isWalletConnected()) {
    application.EventBus.dispatch(EventId.chainChanged, chainId);
    return;
  }
  const wallet = Wallet.getClientInstance();
  if (wallet?.clientSideProvider?.name === WalletPlugin.MetaMask) {
    await wallet.switchNetwork(chainId);
  }
}

export const updateWallets = (options: any) => {
  if (options.wallets) {
    state.wallets = options.wallets
  }
}

export const toggleThemeButton = (options: any) => {
  state.showThemeButton = options?.showThemeButton ?? false
}

export const hasThemeButton = () => {
  return state.showThemeButton
}

export const setWalletPluginProvider = (walletPlugin: WalletPlugin, wallet: IClientSideProvider) => {
  state.walletPluginMap[walletPlugin] = wallet;
}

export const getWalletPluginMap = () => {
  return state.walletPluginMap;
}

export const getWalletPluginProvider = (walletPlugin: WalletPlugin) => {
  return state.walletPluginMap[walletPlugin];
}