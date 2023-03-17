import {
  application
} from '@ijstech/components';
import { walletList } from './walletList';
import {IWallet, Wallet, WalletPlugin } from '@ijstech/eth-wallet';


export const enum EventId {
  ConnectWallet = 'connectWallet',
  IsWalletConnected = 'isWalletConnected',
  chainChanged = 'chainChanged',
  IsWalletDisconnected = "IsWalletDisconnected"
};

export function isWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export async function connectWallet(walletPlugin: WalletPlugin, eventHandlers?: { [key: string]: Function }):Promise<IWallet> {
  // let walletProvider = localStorage.getItem('walletProvider') || '';
  let wallet = Wallet.getClientInstance();
  const walletOptions = '';//getWalletOptions();
  let providerOptions = walletOptions[walletPlugin];
  if (!wallet.chainId) {
    // wallet.chainId = getDefaultChainId();
  }
  await wallet.connect(walletPlugin, {
    onAccountChanged: async (account: string) => {
      let connected = !!account;
      if (eventHandlers && eventHandlers.accountsChanged) {
        let { requireLogin, isLoggedIn } = await eventHandlers.accountsChanged(account);
        if (requireLogin && !isLoggedIn) connected = false;
      }
      if (connected) {
        localStorage.setItem('walletProvider', Wallet.getClientInstance()?.clientSideProvider?.walletPlugin || '');
        document.cookie = `scom__wallet=${Wallet.getClientInstance()?.clientSideProvider?.walletPlugin || ''}`;
      }
      application.EventBus.dispatch(EventId.IsWalletConnected, connected);
    },
    onChainChanged: (chainIdHex: string) => {
      const chainId = Number(chainIdHex);

      if (eventHandlers && eventHandlers.chainChanged) {
        eventHandlers.chainChanged(chainId);
      }
      application.EventBus.dispatch(EventId.chainChanged, chainId);
    }
  }, providerOptions)
  return wallet;
}

export async function switchNetwork(chainId: number) {
  if (!isWalletConnected()) {
    application.EventBus.dispatch(EventId.chainChanged, chainId);
    return;
  }
  const wallet = Wallet.getClientInstance();
  if (wallet?.clientSideProvider?.walletPlugin === WalletPlugin.MetaMask) {
    await wallet.switchNetwork(chainId);
  }
}

export async function logoutWallet() {
  const wallet = Wallet.getClientInstance();
  await wallet.disconnect();
  localStorage.setItem('walletProvider', '');
  application.EventBus.dispatch(EventId.IsWalletDisconnected, false);
}

export const hasWallet = function () {
  let hasWallet = false;
  for (let wallet of walletList) {
    if (Wallet.isInstalled(wallet.name)) {
      hasWallet = true;
      break;
    } 
  }
  return hasWallet;
}

export const hasMetaMask = function () {
  return Wallet.isInstalled(WalletPlugin.MetaMask);
}

export const truncateAddress = (address: string) => {
  if (address === undefined || address === null) return '';
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

export const getSupportedWallets = () => {
  return walletList.filter(wallet => state.wallets.includes(wallet.name));
}

const state = {
  wallets: []
}

export const updateWallets = (options: any) => {
  if (options.wallets) {
    state.wallets = options.wallets
  }
}