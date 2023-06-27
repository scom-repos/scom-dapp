import {
  application
} from '@ijstech/components';
import {IClientProviderOptions, IClientSideProvider, IClientSideProviderEvents,  MetaMaskProvider, Wallet, Web3ModalProvider } from '@ijstech/eth-wallet';
import { EventId } from './constants';
import { getInfuraId, getSiteSupportedNetworks } from './network';
import { IWallet } from '@ijstech/eth-wallet';

export enum WalletPlugin {
  MetaMask = 'metamask',
  WalletConnect = 'walletconnect',
}

export interface IWalletPlugin {
  name: string;
  packageName?: string;
  provider: IClientSideProvider;
}

const state = {
  wallets: [] as IWalletPlugin[],
  showThemeButton: false,
  walletPluginMap: {} as Record<string, IWalletPlugin>
}

async function getWalletPluginConfigProvider(
  wallet: Wallet, 
  pluginName: string, 
  packageName?: string,
  events?: IClientSideProviderEvents, 
  options?: IClientProviderOptions
) {
  switch (pluginName) {
    case WalletPlugin.MetaMask:
      return new MetaMaskProvider(wallet, events, options);
    case WalletPlugin.WalletConnect:
      return new Web3ModalProvider(wallet, events, options);
    default: {
      if (packageName) {
        const provider: any = await application.loadPackage(packageName, '*');
        return new provider(wallet, events, options);
      }
    }
  }
} 

export async function initWalletPlugins() {
  let wallet: any = Wallet.getClientInstance();
  const events = {
  }

  let networkList = getSiteSupportedNetworks();
  const rpcs: { [chainId: number]: string } = {}
  for (const network of networkList) {
    let rpc = network.rpcUrls[0];
    if (rpc) rpcs[network.chainId] = rpc;
  }

  for (let walletPlugin of state.wallets) {
    let pluginName = walletPlugin.name;
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
    let provider = await getWalletPluginConfigProvider(wallet, pluginName, walletPlugin.packageName, events, providerOptions);
    setWalletPluginProvider(pluginName, {
      name: pluginName,
      packageName: walletPlugin.packageName,
      provider
    });
  }
}

export async function connectWallet(walletPlugin: string):Promise<IWallet> {
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

export const getSupportedWalletProviders = (): IClientSideProvider[] => {
  const walletPluginMap = getWalletPluginMap();
  return state.wallets.map(v => walletPluginMap[v.name].provider);
}

export function isWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export const hasWallet = function () {
  let hasWallet = false;
  const walletPluginMap = getWalletPluginMap();
  for (let pluginName in walletPluginMap) {
    const provider = walletPluginMap[pluginName].provider;
    if (provider.installed()) {
      hasWallet = true;
      break;
    } 
  }
  return hasWallet;
}

export const hasMetaMask = function () {
  const provider = getWalletPluginProvider(WalletPlugin.MetaMask);
  return provider?.installed();
}

export async function switchNetwork(chainId: number) {
  const wallet = Wallet.getClientInstance();
  await wallet.switchNetwork(chainId);
  if (!isWalletConnected()) {
    application.EventBus.dispatch(EventId.chainChanged, chainId);
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

export const setWalletPluginProvider = (name: string, wallet: IWalletPlugin) => {
  state.walletPluginMap[name] = wallet;
}

export const getWalletPluginMap = () => {
  return state.walletPluginMap;
}

export const getWalletPluginProvider = (name: string) => {
  return state.walletPluginMap[name]?.provider||null;
}