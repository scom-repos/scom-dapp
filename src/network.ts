import { Erc20, Wallet, ISendTxEventsOptions, BigNumber } from '@ijstech/eth-wallet';
import { formatDate, formatNumber} from './helper';
import {INetwork, EventId} from './wallet';
export {isWalletConnected, hasWallet, hasMetaMask, truncateAddress, switchNetwork, connectWallet, logoutWallet} from './wallet';
import { walletList } from './walletList';
export { walletList};
export {INetwork, EventId, formatDate, formatNumber};

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
export const NativeTokenByChainId: { [key: number]: ITokenObject } = {
  5: {address:undefined,decimals:18,symbol:"ETH", name: 'ETH'},
};
export const updateNetworks = (options: any) => {
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId)
  }
  if (options.defaultChainId) {
    setDefaultChainId(options.defaultChainId)
  }
  if (options.infuraId) {
    setInfuraId(options.infuraId)
  }		
};
export function registerSendTxEvents(sendTxEventHandlers: ISendTxEventsOptions) {
    const wallet = Wallet.getInstance();
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
  networkMap: {} as { [key: number]: INetwork },
  defaultChainId: 0,
  supportedNetworkId: [] as number[],
  infuraId: "",
}
const setNetworkList = (networkList: INetwork[], infuraId?: string) => {
  state.networkMap = {};
  state.supportedNetworkId = [];
  for (let network of networkList) {
    if (infuraId && network.rpc) {
      network.rpc = network.rpc.replace(/{InfuraId}/g, infuraId);
    }
    state.networkMap[network.chainId] = network;
    state.supportedNetworkId.push(network.chainId);
  }
}

export const getNetworkInfo = (chainId: number) => {
  return state.networkMap[chainId];
}

export const getNetworkList = ()  => {
  return Object.values(state.networkMap);
}

export const getSupportedNetworkIds = () => {
  return state.supportedNetworkId;
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
  return network?.explorerName??'Unknown';
}

const setDefaultChainId = (chainId: number) => {
  state.defaultChainId = chainId;
}

export const getDefaultChainId = () => {
  return state.defaultChainId;
}

export const getSiteSupportedNetworks = ()  => {
  let networkFullList = Object.values(state.networkMap);
  let list = networkFullList.filter(network => !getNetworkInfo(network.chainId).isDisabled);
  return list
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}
