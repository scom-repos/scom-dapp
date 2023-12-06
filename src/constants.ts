export const enum EventId {
  ConnectWallet = 'connectWallet',
  IsWalletConnected = 'isWalletConnected',
  IsAccountLoggedIn = 'isAccountLoggedIn',
  chainChanged = 'chainChanged',
  IsWalletDisconnected = "IsWalletDisconnected",
  themeChanged = "themeChanged",
  setHeaderVisibility = 'setHeaderVisibility',
  setFooterVisibility = 'setFooterVisibility',
  scrollToTop = 'scrollToTop'
};

export const enum LoginSessionType {
  Wallet = 1,
  Email = 2,
  Nostr = 3
}