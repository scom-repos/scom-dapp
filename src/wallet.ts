import {
  application
} from '@ijstech/components';
import {IClientProviderOptions, IClientSideProvider,  IConnectWalletEventPayload,  MetaMaskProvider, Wallet, Web3ModalProvider } from '@ijstech/eth-wallet';
import { EventId } from './constants';
import { IWallet, IClientWalletConfig, IRpcWalletConfig, INetwork } from '@ijstech/eth-wallet';
import { IExtendedNetwork } from './interface';
import {getMulticallInfoList, IMulticallInfo} from '@scom/scom-multicall';
import getNetworkList from '@scom/scom-network-list';
import { isValidEnv } from './site';


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
  Email = 'email',
  Google = 'google',
}

export interface IWalletPlugin {
  name: string;
  displayName?: string;
  image?: string;
  packageName?: string;
  provider: IClientSideProvider;
}

const state = {
  infuraId: "",
  defaultChainId: 0,
  multicalls: [] as IMulticallInfo[],
  networkMap: {} as { [key: number]: IExtendedNetwork },
  instanceId: "",
  defaultNetworkFromWallet: false,
  wallets: [] as IWalletPlugin[],
  walletPluginMap: {} as Record<string, IWalletPlugin>,
  walletConnectConfig: null as IWalletConnectConfig
}

async function getWalletPluginConfigProvider(
  wallet: Wallet, 
  pluginName: string, 
  packageName?: string,
  options?: IClientProviderOptions
) {
  switch (pluginName) {
    case WalletPlugin.MetaMask:
      return new MetaMaskProvider(wallet, {}, options);
    case WalletPlugin.WalletConnect:
      return new Web3ModalProvider(wallet, {}, options);      
    default: {
      if (packageName) {
        const provider: any = await application.loadPackage(packageName, '*');
        return new provider(wallet, {}, options);
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
  let provider = await getWalletPluginConfigProvider(wallet, pluginName, walletPlugin.packageName, providerOptions);
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

export async function connectWallet(walletPluginName: string, eventPayload?: IConnectWalletEventPayload):Promise<IWallet> {
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
    await wallet.connect(provider, eventPayload);
  }
  return wallet;
}

export async function logoutWallet() {
  const wallet = Wallet.getClientInstance();
  await wallet.disconnect();
  localStorage.setItem('walletProvider', '');
  // application.EventBus.dispatch(EventId.IsWalletDisconnected);
}

export const getSupportedWalletProviders = (): IClientSideProvider[] => {
  const walletPluginMap = getWalletPluginMap();
  return state.wallets.map(v => walletPluginMap[v.name].provider);
}

export const getSiteSupportedNetworks = () => {
  let networkFullList = Object.values(state.networkMap);
  let list = networkFullList.filter(network =>
    !network.isDisabled && isValidEnv(network.env)
  );
  return list
}

export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
};

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
  if (options.infuraId) {
    setInfuraId(options.infuraId);
  }
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId);
  }
  if (options.defaultChainId) {
    setDefaultChainId(options.defaultChainId);
  }
  if (options.wallets) {
    state.wallets = options.wallets
  }
  if (options.walletConnect) {
    state.walletConnectConfig = options.walletConnect
  }
  const networks = Object.values(state.networkMap);
  const multicalls = getMulticallInfoList();
  state.multicalls = multicalls;
  const clientWalletConfig: IClientWalletConfig = {
    defaultChainId: state.defaultChainId,
    networks,
    infuraId: state.infuraId,
    multicalls
  }
  const clientWallet = Wallet.getClientInstance();
  clientWallet.initClientWallet(clientWalletConfig);

  const rpcWalletConfig: IRpcWalletConfig = {
    networks,
    defaultChainId: clientWallet.chainId,
    infuraId: state.infuraId,
    multicalls
  }
  const instanceId = clientWallet.initRpcWallet(rpcWalletConfig);
  state.instanceId = instanceId;
  application.store = {
    ...application.store,
    ...state
  }
}

export const isDefaultNetworkFromWallet = () => {
  return state.defaultNetworkFromWallet;
}

const setNetworkList = (networkOptionsList: IExtendedNetwork[] | "*", infuraId?: string) => {
  state.networkMap = {};
  const defaultNetworkList: INetwork[] = getNetworkList();
  const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
    acc[cur.chainId] = cur;
    return acc;
  }, {});
  state.defaultNetworkFromWallet = networkOptionsList === "*";
  if (state.defaultNetworkFromWallet) {
    const networksMap = defaultNetworkMap;
    for (const chainId in networksMap) {
      const networkInfo = networksMap[chainId];
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      if (state.infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
          networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
        }
      }
      state.networkMap[networkInfo.chainId] =  {
        ...networkInfo,
        symbol: networkInfo.nativeCurrency?.symbol || "",
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
      }
    }
  }
  else if (Array.isArray(networkOptionsList)) {
    const networksMap = defaultNetworkMap;
    let networkOptionsMap = networkOptionsList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {} as Record<number, IExtendedNetwork>);
    for (let chainId in networksMap) {
      const networkOptions = networkOptionsMap[chainId];
      const networkInfo = networksMap[chainId];
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
          networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
        }
      }
      state.networkMap[networkInfo.chainId] = {
        ...networkInfo,
        ...networkOptions,
        symbol: networkInfo.nativeCurrency?.symbol || "",
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : "",
        isDisabled: !!networkOptions ? false : true
      }
    }
  }
}

export const getNetworkInfo = (chainId: number): IExtendedNetwork | undefined => {
  return state.networkMap[chainId];
}

const setDefaultChainId = (chainId: number) => {
  state.defaultChainId = chainId;
}

export const getDefaultChainId = () => {
  return state.defaultChainId;
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

export const setWalletPluginProvider = (name: string, wallet: IWalletPlugin) => {
  state.walletPluginMap[name] = wallet;
}

const getWalletPluginMap = () => {
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

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerAddressUrl) {
    let url = `${network.explorerAddressUrl}${address}`;
    window.open(url);
  }
}