/// <amd-module name="@scom/scom-dapp/pathToRegexp.ts" />
declare module "@scom/scom-dapp/pathToRegexp.ts" {
    export interface ParseOptions {
        /**
         * Set the default delimiter for repeat parameters. (default: `'/'`)
         */
        delimiter?: string;
        /**
         * List of characters to automatically consider prefixes when parsing.
         */
        prefixes?: string;
    }
    /**
     * Parse a string for the raw tokens.
     */
    export function parse(str: string, options?: ParseOptions): Token[];
    export interface TokensToFunctionOptions {
        /**
         * When `true` the regexp will be case sensitive. (default: `false`)
         */
        sensitive?: boolean;
        /**
         * Function for encoding input strings for output.
         */
        encode?: (value: string, token: Key) => string;
        /**
         * When `false` the function can produce an invalid (unmatched) path. (default: `true`)
         */
        validate?: boolean;
    }
    /**
     * Compile a string to a template function for the path.
     */
    export function compile<P extends object = object>(str: string, options?: ParseOptions & TokensToFunctionOptions): PathFunction<P>;
    export type PathFunction<P extends object = object> = (data?: P) => string;
    /**
     * Expose a method for transforming tokens into the path function.
     */
    export function tokensToFunction<P extends object = object>(tokens: Token[], options?: TokensToFunctionOptions): PathFunction<P>;
    export interface RegexpToFunctionOptions {
        /**
         * Function for decoding strings for params.
         */
        decode?: (value: string, token: Key) => string;
    }
    /**
     * A match result contains data about the path match.
     */
    export interface MatchResult<P extends object = object> {
        path: string;
        index: number;
        params: P;
    }
    /**
     * A match is either `false` (no match) or a match result.
     */
    export type Match<P extends object = object> = false | MatchResult<P>;
    /**
     * The match function takes a string and returns whether it matched the path.
     */
    export type MatchFunction<P extends object = object> = (path: string) => Match<P>;
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    export function match<P extends object = object>(str: Path, options?: ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions): MatchFunction<P>;
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    export function regexpToFunction<P extends object = object>(re: RegExp, keys: Key[], options?: RegexpToFunctionOptions): MatchFunction<P>;
    /**
     * Metadata about a key.
     */
    export interface Key {
        name: string | number;
        prefix: string;
        suffix: string;
        pattern: string;
        modifier: string;
    }
    /**
     * A token is a string (nothing special) or key metadata (capture group).
     */
    export type Token = string | Key;
    export interface TokensToRegexpOptions {
        /**
         * When `true` the regexp will be case sensitive. (default: `false`)
         */
        sensitive?: boolean;
        /**
         * When `true` the regexp won't allow an optional trailing delimiter to match. (default: `false`)
         */
        strict?: boolean;
        /**
         * When `true` the regexp will match to the end of the string. (default: `true`)
         */
        end?: boolean;
        /**
         * When `true` the regexp will match from the beginning of the string. (default: `true`)
         */
        start?: boolean;
        /**
         * Sets the final character for non-ending optimistic matches. (default: `/`)
         */
        delimiter?: string;
        /**
         * List of characters that can also be "end" characters.
         */
        endsWith?: string;
        /**
         * Encode path tokens for use in the `RegExp`.
         */
        encode?: (value: string) => string;
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    export function tokensToRegexp(tokens: Token[], keys?: Key[], options?: TokensToRegexpOptions): RegExp;
    /**
     * Supported `path-to-regexp` input types.
     */
    export type Path = string | RegExp | Array<string | RegExp>;
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    export function pathToRegexp(path: Path, keys?: Key[], options?: TokensToRegexpOptions & ParseOptions): RegExp;
}
/// <amd-module name="@scom/scom-dapp/interface.ts" />
declare module "@scom/scom-dapp/interface.ts" {
    import { MatchFunction } from "@scom/scom-dapp/pathToRegexp.ts";
    import { INetwork } from '@ijstech/eth-wallet';
    export interface IBreakpoints {
        mobile: number;
        tablet: number;
        desktop: number;
    }
    export interface IMenu {
        caption: string;
        url: string;
        module: string;
        params?: any;
        env?: string;
        networks?: number[];
        isToExternal?: boolean;
        img?: string;
        isDisabled?: boolean;
        menus?: IMenu[];
        regex?: MatchFunction;
        isLoginRequired?: boolean;
    }
    export interface IExtendedNetwork extends INetwork {
        symbol?: string;
        env?: string;
        explorerName?: string;
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
        isDisabled?: boolean;
    }
    export interface IHeaderFooter {
        visible?: boolean;
        fixed?: boolean;
        hasLogo?: boolean;
        customStyles?: any;
    }
    export interface IHeader extends IHeaderFooter {
        hideNetworkButton?: boolean;
        hideWalletBalance?: boolean;
    }
    export interface IFooter extends IHeaderFooter {
    }
    export interface IOAuthProvider {
        enabled: boolean;
        clientId: string;
    }
}
/// <amd-module name="@scom/scom-dapp/assets.ts" />
declare module "@scom/scom-dapp/assets.ts" {
    import { IBreakpoints } from "@scom/scom-dapp/interface.ts";
    type viewportType = "desktop" | "tablet" | "mobile";
    interface ILogo {
        header: string;
        footer: string;
    }
    class Assets {
        private static _instance;
        private _breakpoints;
        static get instance(): Assets;
        get logo(): ILogo;
        set breakpoints(value: IBreakpoints);
        get breakpoints(): IBreakpoints;
        get viewport(): viewportType;
        private _getLogoPath;
        private _getLogo;
    }
    export const assets: Assets;
    function fullPath(path: string): string;
    const _default: {
        fonts: {
            poppins: {
                bold: string;
                italic: string;
                light: string;
                medium: string;
                regular: string;
                thin: string;
            };
        };
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-dapp/index.css.ts" />
declare module "@scom/scom-dapp/index.css.ts" {
    const _default_1: string;
    export default _default_1;
}
/// <amd-module name="@scom/scom-dapp/site.ts" />
declare module "@scom/scom-dapp/site.ts" {
    import { IOAuthProvider } from "@scom/scom-dapp/interface.ts";
    export const updateConfig: (options: any) => void;
    export const getOAuthProvider: (provider: string) => IOAuthProvider;
    export const hasThemeButton: () => boolean;
    export const isValidEnv: (env: string) => boolean;
    export const getEnv: () => string;
    export const getRequireLogin: () => boolean;
    export const getIsLoggedIn: (address: string) => boolean;
    export const getLoggedInAccount: () => string;
}
/// <amd-module name="@scom/scom-dapp/constants.ts" />
declare module "@scom/scom-dapp/constants.ts" {
    export const enum EventId {
        ConnectWallet = "connectWallet",
        IsWalletConnected = "isWalletConnected",
        IsAccountLoggedIn = "isAccountLoggedIn",
        chainChanged = "chainChanged",
        IsWalletDisconnected = "IsWalletDisconnected",
        themeChanged = "themeChanged",
        setHeaderVisibility = "setHeaderVisibility",
        setFooterVisibility = "setFooterVisibility",
        scrollToTop = "scrollToTop"
    }
    export const enum LoginSessionType {
        Wallet = 1,
        Email = 2,
        Nostr = 3
    }
}
/// <amd-module name="@scom/scom-dapp/wallet.ts" />
declare module "@scom/scom-dapp/wallet.ts" {
    import { IClientSideProvider, IConnectWalletEventPayload } from '@ijstech/eth-wallet';
    import { IWallet } from '@ijstech/eth-wallet';
    import { IExtendedNetwork } from "@scom/scom-dapp/interface.ts";
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
        MetaMask = "metamask",
        WalletConnect = "walletconnect",
        Email = "email",
        Google = "google"
    }
    export interface IWalletPlugin {
        name: string;
        displayName?: string;
        image?: string;
        packageName?: string;
        provider: IClientSideProvider;
    }
    export function initWalletPlugins(): Promise<void>;
    export function connectWallet(walletPluginName: string, eventPayload?: IConnectWalletEventPayload): Promise<IWallet>;
    export function logoutWallet(): Promise<void>;
    export const getSupportedWalletProviders: () => IClientSideProvider[];
    export const getSiteSupportedNetworks: () => IExtendedNetwork[];
    export function getWalletProvider(): string;
    export function isWalletConnected(): boolean;
    export const hasWallet: () => boolean;
    export const hasMetaMask: () => boolean;
    export function switchNetwork(chainId: number): Promise<void>;
    export const updateWalletConfig: (options: any) => void;
    export const isDefaultNetworkFromWallet: () => boolean;
    export const getNetworkInfo: (chainId: number) => IExtendedNetwork | undefined;
    export const getDefaultChainId: () => number;
    export const getInfuraId: () => string;
    export const setWalletPluginProvider: (name: string, wallet: IWalletPlugin) => void;
    export const getWalletPluginProvider: (name: string) => IClientSideProvider;
    export const setWalletConnectConfig: (data: IWalletConnectConfig) => void;
    export const getWalletConnectConfig: () => IWalletConnectConfig;
    export const viewOnExplorerByAddress: (chainId: number, address: string) => void;
}
/// <amd-module name="@scom/scom-dapp/header.css.ts" />
declare module "@scom/scom-dapp/header.css.ts" {
    const _default_2: string;
    export default _default_2;
}
/// <amd-module name="@scom/scom-dapp/API.ts" />
declare module "@scom/scom-dapp/API.ts" {
    import { LoginSessionType } from "@scom/scom-dapp/constants.ts";
    function checkLoginSession(): Promise<any>;
    function requestLoginSession(sessionType: LoginSessionType): Promise<any>;
    function apiLogin(sessionNonce: string): Promise<any>;
    function apiLogout(): Promise<any>;
    function sendAuthCode(email: string): Promise<any>;
    function verifyAuthCode(verifyAuthCodeArgs: any): Promise<any>;
    export { requestLoginSession, checkLoginSession, apiLogin, apiLogout, sendAuthCode, verifyAuthCode };
}
/// <amd-module name="@scom/scom-dapp/alert.css.ts" />
declare module "@scom/scom-dapp/alert.css.ts" {
    export const modalStyle: string;
}
/// <amd-module name="@scom/scom-dapp/alert.tsx" />
declare module "@scom/scom-dapp/alert.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['main-alert']: ControlElement;
            }
        }
    }
    export interface IAlertMessage {
        status: 'warning' | 'success' | 'error' | 'loading';
        title?: string;
        content?: string;
        link?: {
            caption: string;
            href: string;
        };
        onClose?: any;
    }
    export class Alert extends Module {
        private mdAlert;
        private pnlMain;
        private _message;
        get message(): IAlertMessage;
        set message(value: IAlertMessage);
        private get iconName();
        private get color();
        closeModal: () => void;
        showModal: () => void;
        private renderUI;
        private renderContent;
        private renderLink;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-dapp/selectNetwork.tsx" />
declare module "@scom/scom-dapp/selectNetwork.tsx" {
    import { Module } from '@ijstech/components';
    export class SelectNetwork extends Module {
        private gridNetworkGroup;
        private networkMapper;
        private networkActiveIndicatorMap;
        private currActiveNetworkId;
        onNetworkSelected(): Promise<void>;
        switchNetwork(chainId: number): Promise<void>;
        isNetworkActive(chainId: number): boolean;
        renderNetworks(): void;
        setActiveNetworkIndicator(connected: boolean): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-dapp/connectWallet.tsx" />
declare module "@scom/scom-dapp/connectWallet.tsx" {
    import { Module } from '@ijstech/components';
    export class ConnectWallet extends Module {
        private pnlWalletPlugins;
        private pnlOAuthPlugins;
        private walletMapper;
        private currActiveWallet;
        private inputEmailAddress;
        private btnSubmitEmail;
        private lbConfirmEmailRecipient;
        private pnlAuthCodeDigits;
        private pnlLogin;
        private pnlConfirmEmail;
        private pnlEmail;
        private digitInputs;
        private loginSessionNonce;
        private loginSessionExpireAt;
        onWalletSelected(): Promise<void>;
        isWalletActive(walletPlugin: any): boolean;
        openLink(link: any): Window;
        handleSignInWithGoogle(response: any): Promise<void>;
        connectToProviderFunc: (walletPlugin: string) => Promise<void>;
        private onDigitInputKeyUp;
        private renderAuthCodeDigits;
        onSubmitEmail(): Promise<void>;
        handleEmailLogin(): Promise<void>;
        initWallet: () => Promise<void>;
        setActiveWalletIndicator(connected: boolean): void;
        private onTogglePanel;
        private onEmailInputChanged;
        private onInputFocused;
        private onInputBlured;
        show(): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-dapp/header.tsx" />
declare module "@scom/scom-dapp/header.tsx" {
    import { Module, Control, ControlElement, Container, IMenuItem } from '@ijstech/components';
    import { IMenu } from "@scom/scom-dapp/interface.ts";
    interface ILoginResult {
        success: boolean;
        error?: string;
        expireAt?: number;
    }
    export interface HeaderElement extends ControlElement {
        menuItems?: IMenu[];
        customStyles?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["main-header"]: HeaderElement;
            }
        }
    }
    export class Header extends Module {
        private hsMobileMenu;
        private hsDesktopMenu;
        private mdMobileMenu;
        private menuMobile;
        private menuDesktop;
        private pnlNetwork;
        private btnNetwork;
        private hsBalance;
        private lblBalance;
        private pnlWalletDetail;
        private btnWalletDetail;
        private mdWalletDetail;
        private btnConnectWallet;
        private mdAccount;
        private lblWalletAddress;
        private hsViewAccount;
        private mdMainAlert;
        private switchTheme;
        private _hideNetworkButton;
        private _hideWalletBalance;
        private $eventBus;
        private selectedNetwork;
        private _menuItems;
        private imgDesktopLogo;
        private imgMobileLogo;
        private isLoginRequestSent;
        private wallet;
        private keepAliveInterval;
        private selectNetworkModule;
        private connectWalletModule;
        private walletInfo;
        constructor(parent?: Container, options?: any);
        get symbol(): string;
        get hideNetworkButton(): boolean;
        set hideNetworkButton(value: boolean);
        get hideWalletBalance(): boolean;
        set hideWalletBalance(value: boolean);
        doActionOnWalletConnected(connected: boolean): Promise<void>;
        registerEvent(): void;
        init(): Promise<void>;
        connectedCallback(): void;
        disconnectedCallback(): void;
        controlMenuDisplay(): void;
        handleChainChanged: (chainId: number) => Promise<void>;
        updateConnectedStatus: (isConnected: boolean) => void;
        updateList(isConnected: boolean): void;
        openConnectModal: () => void;
        openNetworkModal: () => Promise<void>;
        openWalletDetailModal: () => void;
        openAccountModal: (target: Control, event: Event) => void;
        login: (sessionNonce: string) => Promise<ILoginResult>;
        handleLogoutClick: (target: Control, event: Event) => Promise<void>;
        viewOnExplorerByAddress(): void;
        openLink(link: any): Window;
        copyWalletAddress: () => void;
        isWalletActive(walletPlugin: any): boolean;
        isNetworkActive(chainId: number): boolean;
        keepSessionAlive(expireAt: number): void;
        initWallet: () => Promise<void>;
        getMenuPath(url: string, params: any): string;
        _getMenuData(list: IMenu[], mode: string, validMenuItemsFn: (item: IMenu) => boolean): IMenuItem[];
        getMenuData(list: IMenu[], mode: string): any;
        renderMobileMenu(): void;
        renderDesktopMenu(): void;
        toggleMenu(): void;
        onThemeChanged(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-dapp/footer.css.ts" />
declare module "@scom/scom-dapp/footer.css.ts" {
    export const logoStyle: string;
}
/// <amd-module name="@scom/scom-dapp/footer.tsx" />
declare module "@scom/scom-dapp/footer.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    export interface FooterElement extends ControlElement {
        logo?: string;
        copyrightInfo?: string;
        version?: string;
        hasLogo?: boolean;
        customStyles?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["main-footer"]: FooterElement;
            }
        }
    }
    export class Footer extends Module {
        private imgLogo;
        private lblCopyright;
        private lblVersion;
        init(): void;
        connectedCallback(): void;
        disconnectedCallback(): void;
        updateLogo(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-dapp" />
declare module "@scom/scom-dapp" {
    import { Module, Styles, Container } from '@ijstech/components';
    export { Header } from "@scom/scom-dapp/header.tsx";
    export { Footer } from "@scom/scom-dapp/footer.tsx";
    export { Alert } from "@scom/scom-dapp/alert.tsx";
    interface ITheme {
        default: string;
        dark?: Styles.Theme.ITheme;
        light?: Styles.Theme.ITheme;
    }
    export default class MainLauncher extends Module {
        private pnlMain;
        private menuItems;
        private _options;
        private currentModule;
        private headerElm;
        private footerElm;
        private pnlScrollable;
        private customHeaderStyles;
        private customFooterStyles;
        private hasFooterLogo;
        private $eventBus;
        constructor(parent?: Container, options?: any);
        init(): Promise<void>;
        registerEvent(): void;
        hideCurrentModule(): void;
        getModuleByPath(path: string): Promise<{
            module: Module;
            params?: any;
        }>;
        handleHashChange(): Promise<void>;
        mergeTheme: (target: Styles.Theme.ITheme, theme: Styles.Theme.ITheme) => Styles.Theme.ITheme;
        updateThemes(themes?: ITheme): void;
        updateLayout(): void;
        private scrollToTop;
        render(): Promise<any>;
    }
}
