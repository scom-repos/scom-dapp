import { Erc20, Wallet, ISendTxEventsOptions, BigNumber } from '@ijstech/eth-wallet';
import { formatDate, formatNumber} from './helper';
import {INetwork, EventId} from './wallet';
export {isWalletConnected, hasWallet, hasMetaMask, truncateAddress, switchNetwork, connectWallet, logoutWallet} from './wallet';
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
const networks: INetwork[] = [
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
export const updateNetworks = (options: any) => {
  if (options.env) {
    setEnv(options.env);
  }
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
  infuraId: "",
  env: ""
}
const setNetworkList = (networkList: INetwork[], infuraId?: string) => {
  state.networkMap = {};
  networks.forEach(network => {
    const rpc = infuraId && network.rpc ? network.rpc.replace(/{InfuraId}/g, infuraId) : network.rpc;
    state.networkMap[network.chainId] = { ...network, isDisabled: true, rpc };
  })
  for (let network of networkList) {
    if (infuraId && network.rpc) {
      network.rpc = network.rpc.replace(/{InfuraId}/g, infuraId);
    }
    Object.assign(state.networkMap[network.chainId], { isDisabled: false, ...network });
  }
}

export const getNetworkInfo = (chainId: number) => {
  return state.networkMap[chainId];
}

export const getNetworkList = ()  => {
  return Object.values(state.networkMap);
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