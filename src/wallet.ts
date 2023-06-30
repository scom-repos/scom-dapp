import {
  application
} from '@ijstech/components';
import {IClientProviderOptions, IClientSideProvider, IClientSideProviderEvents,  MetaMaskProvider, Wallet, Web3ModalProvider } from '@ijstech/eth-wallet';
import { EventId } from './constants';
import { getDefaultChainId, getInfuraId, getSiteSupportedNetworks } from './network';
import { IWallet } from '@ijstech/eth-wallet';
import { IExtendedNetwork } from './interface';

export interface IWalletConnectMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export interface IWalletConnectConfig {
  projectId: string;
  metadata: IWalletConnectMetadata;
}

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
  walletPluginMap: {} as Record<string, IWalletPlugin>,
  walletConnectConfig: null as IWalletConnectConfig
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

async function initWalletPlugin(walletPlugin: IWalletPlugin, networkList: IExtendedNetwork[], rpcs: { [chainId: number]: string }) {
  let wallet: any = Wallet.getClientInstance();
  let pluginName = walletPlugin.name;
  let providerOptions;
  if (pluginName == WalletPlugin.WalletConnect) {
    await application.loadPackage('@ijstech/eth-wallet-web3modal', '*');
    let walletConnectConfig = getWalletConnectConfig();
    let mainChainId = getDefaultChainId();
    let optionalChains = networkList.map((network) => network.chainId).filter((chainId) => chainId !== mainChainId);
    providerOptions = {
      ...walletConnectConfig,
      name: pluginName,
      infuraId: getInfuraId(),
      chains: [mainChainId],
      optionalChains: optionalChains,
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
  let provider = await getWalletPluginConfigProvider(wallet, pluginName, walletPlugin.packageName, {}, providerOptions);
  setWalletPluginProvider(pluginName, {
    name: pluginName,
    packageName: walletPlugin.packageName,
    provider
  });
  return provider;
}

export async function initWalletPlugins() {
  let networkList = getSiteSupportedNetworks();
  const rpcs: { [chainId: number]: string } = {}
  for (const network of networkList) {
    let rpc = network.rpcUrls[0];
    if (rpc) rpcs[network.chainId] = rpc;
  }

  for (let walletPlugin of state.wallets) {
    await initWalletPlugin(walletPlugin, networkList, rpcs);
  }
}

export async function connectWallet(walletPluginName: string):Promise<IWallet> {
  // let walletProvider = localStorage.getItem('walletProvider') || '';
  let wallet = Wallet.getClientInstance();
  if (!wallet.chainId) {
    // wallet.chainId = getDefaultChainId();
  }
  let provider = getWalletPluginProvider(walletPluginName);
  if (!provider) {
    let networkList = getSiteSupportedNetworks();
    const rpcs: { [chainId: number]: string } = {}
    for (const network of networkList) {
      let rpc = network.rpcUrls[0];
      if (rpc) rpcs[network.chainId] = rpc;
    }
    let walletPlugin = state.wallets.find(v => v.name == walletPluginName);
    if (walletPlugin) {
      provider = await initWalletPlugin(walletPlugin, networkList, rpcs);
    }
  }
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

export const updateWalletConfig = (options: any) => {
  if (options.wallets) {
    state.wallets = options.wallets
  }
  if (options.walletConnect) {
    state.walletConnectConfig = options.walletConnect
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

export const setWalletConnectConfig = (data: IWalletConnectConfig) => {
  state.walletConnectConfig = data;
}

export const getWalletConnectConfig = () => {
  return state.walletConnectConfig;
}