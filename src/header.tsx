import {
  customElements,
  Module,
  Control,
  ControlElement,
  Menu,
  Styles,
  Button,
  Modal,
  observable,
  Label,
  application,
  IEventBus,
  Panel,
  HStack,
  GridLayout,
  Container,
  IMenuItem,
  Image,
  Switch
} from '@ijstech/components';
import { Constants, Wallet, IClientWallet} from "@ijstech/eth-wallet";
import styleClass from './header.css';
import Assets, { assets } from './assets';
import {
  formatNumber, 
  isValidEnv, 
  isDefaultNetworkFromWallet, 
  getRequireLogin,
  getNetworkInfo,
  getSiteSupportedNetworks,
  getWalletProvider,
  getDefaultChainId,
  viewOnExplorerByAddress,
  getIsLoggedIn
} from './network';
import { getSupportedWalletProviders, switchNetwork, truncateAddress, hasWallet, isWalletConnected, hasMetaMask, hasThemeButton, initWalletPlugins, WalletPlugin, getWalletPluginProvider, logoutWallet, connectWallet } from './wallet';
import { compile } from './pathToRegexp'
import { checkLoginSession, login, logout } from './utils';
import { Alert } from './alert';
import { EventId } from './constants';
import { IMenu, IExtendedNetwork } from './interface';

const Theme = Styles.Theme.ThemeVars;

interface ILoginResult {
  success: boolean;
  error?: string;
  expireAt?: number;
}

export interface HeaderElement extends ControlElement {
  menuItems?: IMenu[];
  customStyles?: any;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["main-header"]: HeaderElement;
    }
  }
};

@customElements('main-header')
export class Header extends Module {
  private hsMobileMenu: HStack;
  private hsDesktopMenu: HStack;
  private mdMobileMenu: Modal;
  private menuMobile: Menu;
  private menuDesktop: Menu;
  private pnlNetwork: Panel;
  private btnNetwork: Button;
  private hsBalance: HStack;
  private lblBalance: Label;
  private pnlWalletDetail: Panel;
  private btnWalletDetail: Button;
  private mdWalletDetail: Modal;
  private btnConnectWallet: Button;
  private mdNetwork: Modal;
  private mdConnect: Modal;
  private mdAccount: Modal;
  private lblNetworkDesc: Label;
  private lblWalletAddress: Label;
  private hsViewAccount: HStack;
  private gridWalletList: GridLayout;
  private gridNetworkGroup: GridLayout;
  private mdMainAlert: Alert;
  private switchTheme: Switch;
  private _hideNetworkButton: boolean;
  private _hideWalletBalance: boolean;

  private $eventBus: IEventBus;
  private selectedNetwork: IExtendedNetwork | undefined;
  private _menuItems: IMenu[];
  private networkMapper: Map<number, HStack>;
  private walletMapper: Map<string, HStack>;
  private currActiveNetworkId: number;
  private currActiveWallet: string;
  private imgDesktopLogo: Image;
  private imgMobileLogo: Image;
  private supportedNetworks: IExtendedNetwork[] = [];
  private isLoginRequestSent: Boolean;
  private wallet: IClientWallet;
  private keepAliveInterval: any;

  @observable()
  private walletInfo = {
    address: '',
    balance: '',
    networkId: 0
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  get symbol() {
    let symbol = '';
    if (this.selectedNetwork?.chainId && this.selectedNetwork?.symbol) {
      symbol = this.selectedNetwork?.symbol;
    }
    return symbol;
  }

  get shortlyAddress() {
    const address = this.walletInfo.address;
    if (!address) return 'No address selected';
    return truncateAddress(address);
  }

  get hideNetworkButton(): boolean {
    return this._hideNetworkButton;
  }
  
  set hideNetworkButton(value: boolean) {
    this._hideNetworkButton = value;
    if (value) this.pnlNetwork.visible = false;
  }

  get hideWalletBalance(): boolean {
    return this._hideWalletBalance;
  }

  set hideWalletBalance(value: boolean) {
    this._hideWalletBalance = value;
    if (value) this.hsBalance.visible = false;
  }

  async doActionOnWalletConnected(connected: boolean) {
    let wallet = Wallet.getInstance();
    if (connected) {
      this.walletInfo.address = wallet.address;
      this.walletInfo.balance = formatNumber((await wallet.balance).toFixed(), 2);
      this.walletInfo.networkId = wallet.chainId;
    }
    this.selectedNetwork = getNetworkInfo(wallet.chainId);
    this.updateConnectedStatus(connected);
    this.updateList(connected);
    this.renderMobileMenu();
    this.renderDesktopMenu();
  }

  registerEvent() {
    this.$eventBus.register(this, EventId.ConnectWallet, this.openConnectModal)
    this.$eventBus.register(this, EventId.IsWalletDisconnected, async (connected: boolean) => {
      const requireLogin = getRequireLogin();
      if (requireLogin) return;
      this.doActionOnWalletConnected(connected);
    })
    this.$eventBus.register(this, EventId.IsAccountLoggedIn, async (loggedIn: boolean) => {
      const requireLogin = getRequireLogin();
      if (!requireLogin) return;
      this.doActionOnWalletConnected(loggedIn);
    })
  }

  async init() {
    this.classList.add(styleClass);
    this.selectedNetwork = getNetworkInfo(getDefaultChainId());
    super.init();
    try {
      const customStyleAttr = this.getAttribute('customStyles', true);
      const customStyle = Styles.style(customStyleAttr)
      customStyle && this.classList.add(customStyle)
    } catch {}
    this._menuItems = this.getAttribute("menuItems", true, []);
    this.renderMobileMenu();
    this.renderDesktopMenu();
    this.controlMenuDisplay();
    this.renderNetworks();
    this.initData();
    const themeType = document.body.style.getPropertyValue('--theme')
    this.switchTheme.checked = themeType === 'light';
    const requireLogin = getRequireLogin();
    if (requireLogin) {
      this.btnConnectWallet.caption = 'Login';
    }
    else {
      this.btnConnectWallet.caption = 'Connect Wallet';
    }
    await this.initWallet();
    this.updateConnectedStatus(isWalletConnected());
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.controlMenuDisplay.bind(this));
  }

  disconnectCallback(): void {
    super.disconnectCallback();
    window.removeEventListener('resize', this.controlMenuDisplay.bind(this));
  }

  controlMenuDisplay() {
    const url = assets.logo.header;
    if (window.innerWidth < 760) {
      this.hsMobileMenu.visible = true;
      this.hsDesktopMenu.visible = false;
      if (this.imgMobileLogo.url !== url)
        this.imgMobileLogo.url = url;
    }
    else {
      this.hsMobileMenu.visible = false;
      this.hsDesktopMenu.visible = true;
      if (this.imgDesktopLogo.url !== url)
        this.imgDesktopLogo.url = url;
    }
  }

  onChainChanged = async (chainIdHex: string) => {
    const chainId = Number(chainIdHex);
    this.walletInfo.networkId = chainId;
    this.selectedNetwork = getNetworkInfo(chainId);
    let wallet = Wallet.getClientInstance();
    const isConnected = wallet.isConnected;
    this.walletInfo.balance = isConnected ? formatNumber((await wallet.balance).toFixed(), 2) : '0';
    this.updateConnectedStatus(isConnected);
    this.updateList(isConnected);
    this.renderMobileMenu();
    this.renderDesktopMenu();
  };

  updateConnectedStatus = (isConnected: boolean) => {
    if (isConnected) {
      this.lblBalance.caption = `${this.walletInfo.balance} ${this.symbol}`;
      this.btnWalletDetail.caption = this.shortlyAddress;
      this.lblWalletAddress.caption = this.shortlyAddress;
      const networkInfo = getNetworkInfo(Wallet.getInstance().chainId);
      this.hsViewAccount.visible = !!networkInfo?.explorerAddressUrl;
    } else {
      this.hsViewAccount.visible = false;
    }
    const isSupportedNetwork = this.selectedNetwork && this.supportedNetworks.findIndex(network => network === this.selectedNetwork) !== -1;
    if (isSupportedNetwork) {
      const img = this.selectedNetwork?.image ? this.selectedNetwork.image : undefined;
      this.btnNetwork.icon = img ? <i-icon width={26} height={26} image={{ url: img }} ></i-icon> : undefined;
      this.btnNetwork.caption = this.selectedNetwork?.chainName??"";
    } else {
      this.btnNetwork.icon = undefined;
      this.btnNetwork.caption = isDefaultNetworkFromWallet() ? "Unknown Network" : "Unsupported Network";
    }
    this.btnConnectWallet.visible = !isConnected;
    this.hsBalance.visible = !this._hideWalletBalance && isConnected;
    this.pnlWalletDetail.visible = isConnected;
  }

  updateDot(connected: boolean, type: 'network' | 'wallet') {
    const wallet = Wallet.getClientInstance();
    if (type === 'network') {
      if (this.currActiveNetworkId !== undefined && this.currActiveNetworkId !== null && this.networkMapper.has(this.currActiveNetworkId)) {
        this.networkMapper.get(this.currActiveNetworkId).classList.remove('is-actived');
      }
      if (connected && this.networkMapper.has(wallet.chainId)) {
        this.networkMapper.get(wallet.chainId).classList.add('is-actived');
      }
      this.currActiveNetworkId = wallet.chainId;
    } else {
      if (this.currActiveWallet && this.walletMapper.has(this.currActiveWallet)) {
        this.walletMapper.get(this.currActiveWallet).classList.remove('is-actived');
      }
      if (connected && this.walletMapper.has(wallet.clientSideProvider?.name)) {
        this.walletMapper.get(wallet.clientSideProvider?.name).classList.add('is-actived');
      }
      this.currActiveWallet = wallet.clientSideProvider?.name;
    }
  }

  updateList(isConnected: boolean) {
    if (isConnected && getWalletProvider() !== WalletPlugin.MetaMask) {
      this.lblNetworkDesc.caption = "We support the following networks, please switch network in the connected wallet.";
    } else {
      this.lblNetworkDesc.caption = "We support the following networks, please click to connect.";
    }
    this.updateDot(isConnected, 'wallet');
    this.updateDot(isConnected, 'network');
  }

  openConnectModal = () => {
    this.initWallet();
    this.mdConnect.title = "Connect wallet"
    this.mdConnect.visible = true;
  }

  openNetworkModal = () => {
    if (isDefaultNetworkFromWallet()) return;
    this.mdNetwork.visible = true;
  }

  openWalletDetailModal = () => {
    this.mdWalletDetail.visible = true;
  }

  openAccountModal = (target: Control, event: Event) => {
    event.stopPropagation();
    this.mdWalletDetail.visible = false;
    this.mdAccount.visible = true;
  }

  openSwitchModal = (target: Control, event: Event) => {
    event.stopPropagation();
    this.mdWalletDetail.visible = false;
    this.mdConnect.title = "Switch wallet";
    this.mdConnect.visible = true;
  }

  login = async (): Promise<ILoginResult> => {
    let errMsg = '';
    let isLoggedIn = false;
    let expireAt = 0;
    if (!this.isLoginRequestSent) {
      try {
        this.isLoginRequestSent = true;
        const loginAPIResult = await login();
        if (loginAPIResult.error || !loginAPIResult.success) {
          errMsg = loginAPIResult.error?.message || 'Login failed';
        } else {
          isLoggedIn = true;
          expireAt = loginAPIResult.expireAt;
        }
      } catch (err) {
        errMsg = 'Login failed';
      }
      this.isLoginRequestSent = false;
    }
    return { 
      success: isLoggedIn,
      error: errMsg,
      expireAt
    }
  }

  logout = async (target: Control, event: Event) => {
    if (event) event.stopPropagation();
    this.mdWalletDetail.visible = false;
    if (getRequireLogin())  {
      await logout();
      localStorage.removeItem('loggedInAccount');
      application.EventBus.dispatch(EventId.IsAccountLoggedIn, false);
    }
    await logoutWallet();
    this.mdAccount.visible = false;
  }

  viewOnExplorerByAddress() {
    viewOnExplorerByAddress(Wallet.getInstance().chainId, this.walletInfo.address)
  }

  async switchNetwork(chainId: number) {
    if (!chainId || isDefaultNetworkFromWallet()) return;
    await switchNetwork(chainId);
    this.mdNetwork.visible = false;
  }

  openLink(link: any) {
    return window.open(link, '_blank');
  };

  connectToProviderFunc = async (walletPlugin: string) => {
    const provider = getWalletPluginProvider(walletPlugin);
    if (provider?.installed()) {
      await connectWallet(walletPlugin, true);
    }
    else {
      let homepage = provider.homepage;
      this.openLink(homepage);
    }
    this.mdConnect.visible = false;
  }

  copyWalletAddress = () => {
    application.copyToClipboard(this.walletInfo.address || "");
  }

  isWalletActive(walletPlugin) {
    const provider = getWalletPluginProvider(walletPlugin);
    return provider ? provider.installed() && Wallet.getClientInstance().clientSideProvider?.name === walletPlugin : false;
  }

  isNetworkActive(chainId: number) {
    return Wallet.getInstance().chainId === chainId;
  }

  keepSessionAlive(account: string, expireAt: number) {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    if (expireAt) {
      const interval = Math.floor((expireAt - Date.now()) / 2);
      this.keepAliveInterval = setInterval(async () => {
        await checkLoginSession(account);
      }, interval);
    }
  }

  initWallet = async () => {
    if (this.wallet)
      return;
      
    const onAccountChanged = async (payload: Record<string, any>) => {
      const { userTriggeredConnect, account } = payload;
      let connected = !!account;
      if (connected) {
        let requireLogin = getRequireLogin();
        if (requireLogin) {
          if (userTriggeredConnect) {
            let loginResult = await this.login();
            if (loginResult.success) {
              this.keepSessionAlive(account, loginResult.expireAt);
              localStorage.setItem('loggedInAccount', account);  
            }
            else {
              this.mdMainAlert.message = {
                status: 'error',
                content: loginResult.error
              };
              this.mdMainAlert.showModal();
            }
            application.EventBus.dispatch(EventId.IsAccountLoggedIn, loginResult.success);
          }
          else {
            const { success, error, expireAt } = await checkLoginSession(account);
            if (success) {
              this.keepSessionAlive(account, expireAt);
              localStorage.setItem('loggedInAccount', account);
              application.EventBus.dispatch(EventId.IsAccountLoggedIn, true);
            }
            else {
              localStorage.removeItem('loggedInAccount');
              application.EventBus.dispatch(EventId.IsAccountLoggedIn, false);
            }
          }
        }
        localStorage.setItem('walletProvider', Wallet.getClientInstance()?.clientSideProvider?.name || '');
      }
    }
    
    let wallet = Wallet.getClientInstance();
    this.wallet = wallet;
    wallet.registerWalletEvent(this, Constants.ClientWalletEvent.AccountsChanged, onAccountChanged);
    wallet.registerWalletEvent(this, Constants.ClientWalletEvent.ChainChanged, this.onChainChanged);
    await initWalletPlugins();
    this.gridWalletList.clearInnerHTML();
    this.walletMapper = new Map();
    const walletList  = getSupportedWalletProviders();
    walletList.forEach((wallet) => {
      const isActive = this.isWalletActive(wallet.name);
      if (isActive) this.currActiveWallet = wallet.name;
      const hsWallet = (
        <i-hstack
          class={isActive ? 'is-actived list-item' : 'list-item'}
          verticalAlignment='center'
          gap={12}
          background={{ color: Theme.colors.secondary.light }}
          border={{ radius: 10 }} position="relative"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          horizontalAlignment="space-between"
          onClick={() => this.connectToProviderFunc(wallet.name)}
        >
          <i-label
            caption={wallet.displayName}
            margin={{ left: '1rem' }}
            wordBreak="break-word"
            font={{ size: '.875rem', bold: true, color: Theme.colors.primary.dark }}
          />
          <i-image width={34} height="auto" url={wallet.image} />
        </i-hstack>
      );
      this.walletMapper.set(wallet.name, hsWallet);
      this.gridWalletList.append(hsWallet);
    })
  }

  renderNetworks() {
    this.gridNetworkGroup.clearInnerHTML();
    this.networkMapper = new Map();
    this.supportedNetworks = getSiteSupportedNetworks();
    this.gridNetworkGroup.append(...this.supportedNetworks.map((network) => {
      const img = network.image ? <i-image url={network.image} width={34} height={34} /> : [];
      const isActive = this.isNetworkActive(network.chainId);
      if (isActive) this.currActiveNetworkId = network.chainId;
      const hsNetwork = (
        <i-hstack
          onClick={() => this.switchNetwork(network.chainId)}
          background={{ color: Theme.colors.secondary.light }}
          border={{ radius: 10 }}
          position="relative"
          class={isActive ? 'is-actived list-item' : 'list-item'}
          padding={{ top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' }}
        >
          <i-hstack margin={{ left: '1rem' }} verticalAlignment="center" gap={12}>
            {img}
            <i-label caption={network.chainName} wordBreak="break-word" font={{ size: '.875rem', bold: true, color: Theme.colors.primary.dark }} />
          </i-hstack>
        </i-hstack>
      );
      this.networkMapper.set(network.chainId, hsNetwork);
      return hsNetwork;
    }));
  }

  async initData() {
		let selectedProvider = localStorage.getItem('walletProvider');
		if (!selectedProvider && hasMetaMask()) {
			selectedProvider = WalletPlugin.MetaMask;
		}
		if (!Wallet.getClientInstance().chainId) {
			Wallet.getClientInstance().chainId = getDefaultChainId();
		}

    await connectWallet(selectedProvider, false);
  }

  getMenuPath(url: string, params: any) {
    try {
      const toPath = compile(url, { encode: encodeURIComponent });
      return toPath(params);
    } catch (err) { }
    return "";
  }

  _getMenuData(list: IMenu[], mode: string, validMenuItemsFn: (item: IMenu) => boolean): IMenuItem[] {
    const menuItems: IMenuItem[] = [];
    list.filter(validMenuItemsFn).forEach((item: IMenu, key: number) => {
      const linkTarget = item.isToExternal ? '_blank' : '_self';
      const path = this.getMenuPath(item.url, item.params);
      const _menuItem: IMenuItem = {
        title: item.caption,
        link: { href: '/#' + path, target: linkTarget },
      };
      if (mode === 'mobile') {
        _menuItem.font = { color: Theme.colors.primary.main };
        if (item.img)
          _menuItem.icon = { width: 24, height: 24, image: { width: 24, height: 24, url: application.assets(item.img) } }
      }
      if (item.menus && item.menus.length) {
        _menuItem.items = this._getMenuData(item.menus, mode, validMenuItemsFn);
      }
      menuItems.push(_menuItem);
    })
    return menuItems;
  }

  getMenuData(list: IMenu[], mode: string): any {
    let wallet = Wallet.getClientInstance();
    let isLoggedIn = (item: IMenu) => !item.isLoginRequired || getIsLoggedIn(wallet.address);
    let chainId = this.selectedNetwork?.chainId || wallet.chainId;
    let validMenuItemsFn: (item: IMenu) => boolean;
    if (chainId) {
      validMenuItemsFn = (item: IMenu) => isLoggedIn(item) && !item.isDisabled && (!item.networks || item.networks.includes(chainId)) && isValidEnv(item.env);
    }
    else {
      validMenuItemsFn = (item: IMenu) => isLoggedIn(item) && !item.isDisabled && isValidEnv(item.env);
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

  onThemeChanged() {
    const themeValues = this.switchTheme.checked ? Styles.Theme.defaultTheme : Styles.Theme.darkTheme;
    Styles.Theme.applyTheme(themeValues)
    const themeType = this.switchTheme.checked ? 'light' : 'dark';
    document.body.style.setProperty('--theme', themeType)
    application.EventBus.dispatch(EventId.themeChanged, themeType);
    this.controlMenuDisplay();
  }

  render() {
    return (
      <i-hstack
        height={60} position="relative"
        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
        background={{ color: Theme.background.paper }}
        verticalAlignment="center"
      >
          <i-grid-layout width='100%' position="relative" verticalAlignment='center' templateColumns={["1fr", "auto"]}>
            <i-hstack
              id="hsMobileMenu"
              verticalAlignment="center"
              width="max-content"
              visible={false}
            >
              <i-icon
                id="hamburger"
                class='pointer'
                name="bars"
                width="20px"
                height="20px"
                display="inline-block"
                margin={{ right: 5 }}
                fill={Theme.text.primary}
                onClick={this.toggleMenu}
              />
              <i-modal
                id="mdMobileMenu"
                height="auto"
                minWidth="250px"
                showBackdrop={false}
                popupPlacement="bottomLeft"
                background={{ color: Theme.background.modal }}
              >
                <i-menu id="menuMobile" mode="inline"></i-menu>
              </i-modal>
              <i-image
                id="imgMobileLogo"
                class="header-logo"
                height={40}
                margin={{ right: '0.5rem' }}
              />

            </i-hstack>
            <i-hstack id="hsDesktopMenu" wrap="nowrap" verticalAlignment="center" width="100%" overflow="hidden">
              <i-image
                id="imgDesktopLogo"
                class="header-logo"
                height={40}
                margin={{ right: '1.25rem' }}
              />
              <i-menu id="menuDesktop" width="100%" border={{ left: { color: Theme.divider, width: '1px', style: 'solid' } }}></i-menu>
            </i-hstack>
            <i-hstack verticalAlignment='center' horizontalAlignment='end'>
              <i-panel margin={{right: '0.5rem'}}>
                <i-switch
                  id="switchTheme"
                  checkedText='☼'
                  uncheckedText='☾'
                  checkedThumbColor={"transparent"}
                  uncheckedThumbColor={"transparent"}
                  class="custom-switch"
                  visible={hasThemeButton()}
                  onChanged={this.onThemeChanged.bind(this)}
                ></i-switch>
              </i-panel>
              <i-panel id="pnlNetwork">
                <i-button
                  id="btnNetwork"
                  height={38}
                  class="btn-network"
                  margin={{ right: '0.5rem' }}
                  padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                  border={{ radius: 5 }}
                  font={{ color: Theme.colors.primary.contrastText }}
                  onClick={this.openNetworkModal}
                  caption={"Unsupported Network"}
                ></i-button>
              </i-panel>
              <i-hstack
                id="hsBalance"
                height={38}
                visible={false}
                horizontalAlignment="center"
                verticalAlignment="center"
                background={{ color: Theme.colors.primary.main }}
                border={{ radius: 5 }}
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
              >
                <i-label id="lblBalance" font={{ color: Theme.colors.primary.contrastText }}></i-label>
              </i-hstack>
              <i-panel id="pnlWalletDetail" visible={false}>
                <i-button
                  id="btnWalletDetail"
                  height={38}
                  padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                  margin={{ left: '0.5rem' }}
                  border={{ radius: 5 }}
                  font={{ color: Theme.colors.error.contrastText }}
                  background={{ color: Theme.colors.error.light }}
                  onClick={this.openWalletDetailModal}
                ></i-button>
                <i-modal
                  id="mdWalletDetail"
                  class="wallet-modal"
                  height="auto"
                  maxWidth={200}
                  showBackdrop={false}
                  popupPlacement="bottomRight"
                >
                  <i-vstack gap={15} padding={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                    <i-button
                      caption="Account"
                      width="100%"
                      height="auto"
                      border={{ radius: 5 }}
                      font={{ color: Theme.colors.primary.contrastText }}
                      background={{ color: Theme.colors.error.light }}
                      padding={{ top: '0.5rem', bottom: '0.5rem' }}
                      onClick={this.openAccountModal}
                    ></i-button>
                    <i-button
                      caption="Switch wallet"
                      width="100%"
                      height="auto"
                      border={{ radius: 5 }}
                      font={{ color: Theme.colors.primary.contrastText }}
                      background={{ color: Theme.colors.error.light }}
                      padding={{ top: '0.5rem', bottom: '0.5rem' }}
                      onClick={this.openSwitchModal}
                    ></i-button>
                    <i-button
                      caption="Logout"
                      width="100%"
                      height="auto"
                      border={{ radius: 5 }}
                      font={{ color: Theme.colors.primary.contrastText }}
                      background={{ color: Theme.colors.error.light }}
                      padding={{ top: '0.5rem', bottom: '0.5rem' }}
                      onClick={this.logout}
                    ></i-button>
                  </i-vstack>
                </i-modal>
              </i-panel>
              <i-button
                id="btnConnectWallet"
                height={38}
                caption="Connect Wallet"
                border={{ radius: 5 }}
                font={{ color: Theme.colors.error.contrastText }}
                background={{ color: Theme.colors.error.light }}
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                onClick={this.openConnectModal}
              ></i-button>
            </i-hstack>
          </i-grid-layout>
        <i-modal
          id='mdNetwork'
          title='Supported Network'
          class='os-modal'
          width={440}
          closeIcon={{ name: 'times' }}
          border={{ radius: 10 }}
        >
          <i-vstack
            height='100%' lineHeight={1.5}
            padding={{ left: '1rem', right: '1rem', bottom: '2rem' }}
          >
            <i-label
              id='lblNetworkDesc'
              margin={{ top: '1rem' }}
              font={{ size: '.875rem' }}
              wordBreak="break-word"
              caption='We support the following networks, please click to connect.'
            ></i-label>
            <i-hstack
              margin={{ left: '-1.25rem', right: '-1.25rem' }}
              height='100%'
            >
              <i-grid-layout
                id='gridNetworkGroup'
                font={{ color: '#f05e61' }}
                height="calc(100% - 160px)"
                width="100%"
                overflow={{ y: 'auto' }}
                margin={{ top: '1.5rem' }}
                padding={{ left: '1.25rem', right: '1.25rem' }}
                columnsPerRow={1}
                templateRows={['max-content']}
                class='list-view'
                gap={{ row: '0.5rem' }}
              ></i-grid-layout>
            </i-hstack>
          </i-vstack>
        </i-modal>
        <i-modal
          id='mdConnect'
          title='Connect Wallet'
          class='os-modal'
          width={440}
          closeIcon={{ name: 'times' }}
          border={{ radius: 10 }}
        >
          <i-vstack padding={{ left: '1rem', right: '1rem', bottom: '2rem' }} lineHeight={1.5}>
            <i-label
              font={{ size: '.875rem' }}
              caption='Recommended wallet for Chrome'
              margin={{ top: '1rem' }}
              wordBreak="break-word"
            ></i-label>
            <i-panel>
              <i-grid-layout
                id='gridWalletList'
                class='list-view'
                margin={{ top: '0.5rem' }}
                columnsPerRow={1}
                templateRows={['max-content']}
                gap={{ row: 8 }}
              >
              </i-grid-layout>
            </i-panel>
          </i-vstack>
        </i-modal>
        <i-modal
          id='mdAccount'
          title='Account'
          class='os-modal'
          width={440}
          height={200}
          closeIcon={{ name: 'times' }}
          border={{ radius: 10 }}
        >
          <i-vstack width="100%" padding={{ top: "1.75rem", bottom: "1rem", left: "2.75rem", right: "2.75rem" }} gap={5}>
            <i-hstack horizontalAlignment="space-between" verticalAlignment='center'>
              <i-label font={{ size: '0.875rem' }} caption='Connected with' />
              <i-button
                caption='Logout'
                font={{ color: Theme.colors.error.contrastText }}
                background={{ color: Theme.colors.error.light }}
                padding={{ top: 6, bottom: 6, left: 10, right: 10 }}
                border={{ radius: 5 }}
                onClick={this.logout}
              />
            </i-hstack>
            <i-label id="lblWalletAddress" font={{ size: '1.25rem', bold: true, color: Theme.colors.primary.main }} lineHeight={1.5} />
            <i-hstack verticalAlignment="center" gap="2.5rem">
              <i-hstack
                class="pointer"
                verticalAlignment="center"
                tooltip={{ content: `The address has been copied`, trigger: 'click' }}
                gap="0.5rem"
                onClick={this.copyWalletAddress}
              >
                <i-icon
                  name="copy"
                  width="16px"
                  height="16px"
                  fill={Theme.text.secondary}
                ></i-icon>
                <i-label caption="Copy Address" font={{ size: "0.875rem", bold: true }} />
              </i-hstack>
              <i-hstack id="hsViewAccount" class="pointer" verticalAlignment="center" onClick={this.viewOnExplorerByAddress.bind(this)}>
                <i-icon name="external-link-alt" width="16" height="16" fill={Theme.text.secondary} display="inline-block" />
                <i-label caption="View on Explorer" margin={{ left: "0.5rem" }} font={{ size: "0.875rem", bold: true }} />
              </i-hstack>
            </i-hstack>
          </i-vstack>
        </i-modal>
        <main-alert id="mdMainAlert"></main-alert>
        <i-hstack
          position='absolute'
          width="100%" bottom="0px" left="0px"
          class="custom-bd"
        ></i-hstack>
      </i-hstack>
    )
  }
}