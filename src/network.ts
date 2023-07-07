import { Erc20, Wallet, ISendTxEventsOptions, INetwork, IClientWalletConfig, IRpcWalletConfig } from '@ijstech/eth-wallet';
import { formatNumber } from './helper';

export { formatNumber };
import { IExtendedNetwork } from './interface';
import getNetworkList from '@scom/scom-network-list';
import {getMulticallInfoList, IMulticallInfo} from '@scom/scom-multicall';
import { application } from '@ijstech/components';

export interface ITokenObject {
  address?: string;
  name: string;
  decimals: number;
  symbol: string;
  status?: boolean | null;
  logoURI?: string;
  isCommon?: boolean | null;
  balance?: string | number;
  isNative?: boolean | null;
};

export const updateNetworks = (options: any) => {
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
  if (options.requireLogin) {
    setRequireLogin(options.requireLogin);
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
  Wallet.getClientInstance().initClientWallet(clientWalletConfig);

  const rpcWalletConfig: IRpcWalletConfig = {
    networks,
    infuraId: state.infuraId,
    multicalls
  }
  const instanceId = Wallet.getClientInstance().initRpcWallet(rpcWalletConfig);
  state.instanceId = instanceId;
  application.store = state;
};
export function registerSendTxEvents(sendTxEventHandlers: ISendTxEventsOptions) {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
    transactionHash: (error: Error, receipt?: string) => {
      if (sendTxEventHandlers.transactionHash) {
        sendTxEventHandlers.transactionHash(error, receipt);
      }
    },
    confirmation: (receipt: any) => {
      if (sendTxEventHandlers.confirmation) {
        sendTxEventHandlers.confirmation(receipt);
      }
    },
  })
};
export function getChainId() {
  return Wallet.getInstance().chainId;
};
export function getWallet() {
  return Wallet.getInstance();
};
export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
};
export function getErc20(address: string) {
  const wallet = getWallet();
  return new Erc20(wallet, address);
};
const state = {
  networkMap: {} as { [key: number]: IExtendedNetwork },
  defaultChainId: 0,
  infuraId: "",
  env: "",
  defaultNetworkFromWallet: false,
  requireLogin: false,
  instanceId: "",
  multicalls: [] as IMulticallInfo[],
  isLoggedIn: (address: string) => getIsLoggedIn(address)
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

export const viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerTxUrl) {
    let url = `${network.explorerTxUrl}${txHash}`;
    window.open(url);
  }
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.explorerAddressUrl) {
    let url = `${network.explorerAddressUrl}${address}`;
    window.open(url);
  }
}

export const getNetworkType = (chainId: number) => {
  let network = getNetworkInfo(chainId);
  return network?.explorerName ?? 'Unknown';
}

const setDefaultChainId = (chainId: number) => {
  state.defaultChainId = chainId;
}

export const getDefaultChainId = () => {
  return state.defaultChainId;
}

export const getSiteSupportedNetworks = () => {
  let networkFullList = Object.values(state.networkMap);
  let list = networkFullList.filter(network =>
    !network.isDisabled && isValidEnv(network.env)
  );
  return list
}

export const isValidEnv = (env: string) => {
  const _env = state.env === 'testnet' || state.env === 'mainnet' ? state.env : "";
  return !_env || !env || env === _env;
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

const setEnv = (env: string) => {
  state.env = env;
}

export const getEnv = () => {
  return state.env;
}

export const isDefaultNetworkFromWallet = () => {
  return state.defaultNetworkFromWallet;
}

const setRequireLogin = (value: boolean) => {
  state.requireLogin = value
}

export const getRequireLogin = () => {
  return state.requireLogin;
}

export const getIsLoggedIn = (address: string) => {
  const loggedInAccount = getLoggedInAccount();
  return loggedInAccount === address;
}

export const getLoggedInAccount = () => {
  const loggedInAccount = localStorage.getItem('loggedInAccount');
  return loggedInAccount;
}