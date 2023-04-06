/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <amd-module name="@scom/dapp/pathToRegexp.ts" />
declare module "@scom/dapp/pathToRegexp.ts" {
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
/// <amd-module name="@scom/dapp/interface.ts" />
declare module "@scom/dapp/interface.ts" {
    import { MatchFunction } from "@scom/dapp/pathToRegexp.ts";
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
    }
    export interface INetwork {
        chainId: number;
        name?: string;
        img?: string;
        rpc?: string;
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
}
/// <amd-module name="@scom/dapp/assets.ts" />
declare module "@scom/dapp/assets.ts" {
    import { IBreakpoints } from "@scom/dapp/interface.ts";
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
        img: {
            network: {
                bsc: string;
                eth: string;
                amio: string;
                avax: string;
                ftm: string;
                polygon: string;
            };
        };
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/dapp/index.css.ts" />
declare module "@scom/dapp/index.css.ts" {
    const _default_1: string;
    export default _default_1;
}
/// <amd-module name="@scom/dapp/helper.ts" />
declare module "@scom/dapp/helper.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const limitDecimals: (value: any, decimals: number) => any;
    export function getAPI(url: string, paramsObj?: any): Promise<any>;
    export const toWeiInv: (n: string, unit?: number) => BigNumber;
    export const abbreviateNum: (value: number) => string;
    export const getParamsFromUrl: () => URLSearchParams;
}
/// <amd-module name="@scom/dapp/network.ts" />
declare module "@scom/dapp/network.ts" {
    import { Erc20, ISendTxEventsOptions } from '@ijstech/eth-wallet';
    import { formatNumber } from "@scom/dapp/helper.ts";
    import { INetwork } from "@scom/dapp/interface.ts";
    export { formatNumber };
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
    }
    export const updateNetworks: (options: any) => void;
    export function registerSendTxEvents(sendTxEventHandlers: ISendTxEventsOptions): void;
    export function getChainId(): number;
    export function getWallet(): import("wallet").IWallet;
    export function getWalletProvider(): string;
    export function getErc20(address: string): Erc20;
    export const getNetworkInfo: (chainId: number) => INetwork | undefined;
    export const getNetworkList: () => INetwork[];
    export const viewOnExplorerByTxHash: (chainId: number, txHash: string) => void;
    export const viewOnExplorerByAddress: (chainId: number, address: string) => void;
    export const getNetworkType: (chainId: number) => string;
    export const getDefaultChainId: () => number;
    export const getSiteSupportedNetworks: () => INetwork[];
    export const isValidEnv: (env: string) => boolean;
    export const getInfuraId: () => string;
    export const getEnv: () => string;
    export const isDefaultNetworkFromWallet: () => boolean;
    export const getRequireLogin: () => boolean;
}
/// <amd-module name="@scom/dapp/constants.ts" />
declare module "@scom/dapp/constants.ts" {
    export const enum EventId {
        ConnectWallet = "connectWallet",
        IsWalletConnected = "isWalletConnected",
        chainChanged = "chainChanged",
        IsWalletDisconnected = "IsWalletDisconnected",
        themeChanged = "themeChanged"
    }
}
/// <amd-module name="@scom/dapp/wallet.ts" />
declare module "@scom/dapp/wallet.ts" {
    import { IClientSideProvider, IWallet } from '@ijstech/eth-wallet';
    export enum WalletPlugin {
        MetaMask = "metamask",
        WalletConnect = "walletconnect"
    }
    export interface IWalletPlugin {
        name: string;
        packageName?: string;
        provider: IClientSideProvider;
    }
    export function initWalletPlugins(eventHandlers?: {
        [key: string]: Function;
    }): Promise<void>;
    export function connectWallet(walletPlugin: string, eventHandlers?: {
        [key: string]: Function;
    }): Promise<IWallet>;
    export function logoutWallet(): Promise<void>;
    export const truncateAddress: (address: string) => string;
    export const getSupportedWalletProviders: () => IClientSideProvider[];
    export function isWalletConnected(): boolean;
    export const hasWallet: () => boolean;
    export const hasMetaMask: () => boolean;
    export function switchNetwork(chainId: number): Promise<void>;
    export const updateWallets: (options: any) => void;
    export const toggleThemeButton: (options: any) => void;
    export const hasThemeButton: () => boolean;
    export const setWalletPluginProvider: (name: string, wallet: IWalletPlugin) => void;
    export const getWalletPluginMap: () => Record<string, IWalletPlugin>;
    export const getWalletPluginProvider: (name: string) => IClientSideProvider;
}
/// <amd-module name="@scom/dapp/header.css.ts" />
declare module "@scom/dapp/header.css.ts" {
    const _default_2: string;
    export default _default_2;
}
/// <amd-module name="@scom/dapp/utils.ts" />
declare module "@scom/dapp/utils.ts" {
    function login(): Promise<any>;
    function logout(): Promise<any>;
    export { login, logout };
}
/// <amd-module name="@scom/dapp/alert.css.ts" />
declare module "@scom/dapp/alert.css.ts" {
    export const modalStyle: string;
}
/// <amd-module name="@scom/dapp/alert.tsx" />
declare module "@scom/dapp/alert.tsx" {
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
/// <amd-module name="@scom/dapp/header.tsx" />
declare module "@scom/dapp/header.tsx" {
    import { Module, Control, ControlElement, Container, IMenuItem } from '@ijstech/components';
    import { IMenu } from "@scom/dapp/interface.ts";
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
        private mdNetwork;
        private mdConnect;
        private mdAccount;
        private lblNetworkDesc;
        private lblWalletAddress;
        private hsViewAccount;
        private gridWalletList;
        private gridNetworkGroup;
        private mdMainAlert;
        private switchTheme;
        private _hideNetworkButton;
        private _hideWalletBalance;
        private $eventBus;
        private selectedNetwork;
        private _menuItems;
        private networkMapper;
        private walletMapper;
        private currActiveNetworkId;
        private currActiveWallet;
        private imgDesktopLogo;
        private imgMobileLogo;
        private supportedNetworks;
        private isLoginRequestSent;
        private walletInfo;
        constructor(parent?: Container, options?: any);
        get symbol(): string;
        get shortlyAddress(): string;
        get hideNetworkButton(): boolean;
        set hideNetworkButton(value: boolean);
        get hideWalletBalance(): boolean;
        set hideWalletBalance(value: boolean);
        registerEvent(): void;
        init(): Promise<void>;
        connectedCallback(): void;
        disconnectCallback(): void;
        controlMenuDisplay(): void;
        onChainChanged: (chainId: number) => Promise<void>;
        updateConnectedStatus: (isConnected: boolean) => void;
        updateDot(connected: boolean, type: 'network' | 'wallet'): void;
        updateList(isConnected: boolean): void;
        openConnectModal: () => void;
        openNetworkModal: () => void;
        openWalletDetailModal: () => void;
        openAccountModal: (target: Control, event: Event) => void;
        openSwitchModal: (target: Control, event: Event) => void;
        login: () => Promise<{
            requireLogin: boolean;
            isLoggedIn: boolean;
        }>;
        logout: (target: Control, event: Event) => Promise<void>;
        viewOnExplorerByAddress(): void;
        switchNetwork(chainId: number): Promise<void>;
        openLink(link: any): Window;
        connectToProviderFunc: (walletPlugin: string) => Promise<void>;
        copyWalletAddress: () => void;
        isWalletActive(walletPlugin: any): boolean;
        isNetworkActive(chainId: number): boolean;
        renderWalletList: () => Promise<void>;
        renderNetworks(): void;
        initData(): Promise<void>;
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
/// <amd-module name="@scom/dapp/footer.css.ts" />
declare module "@scom/dapp/footer.css.ts" {
    export const logoStyle: string;
}
/// <amd-module name="@scom/dapp/footer.tsx" />
declare module "@scom/dapp/footer.tsx" {
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
        disconnectCallback(): void;
        updateLogo(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/dapp" />
declare module "@scom/dapp" {
    import { Module, Styles, Container } from '@ijstech/components';
    export { Header } from "@scom/dapp/header.tsx";
    export { Footer } from "@scom/dapp/footer.tsx";
    export { Alert } from "@scom/dapp/alert.tsx";
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
        constructor(parent?: Container, options?: any);
        init(): Promise<void>;
        hideCurrentModule(): void;
        getModuleByPath(path: string): Promise<{
            module: Module;
            params?: any;
        }>;
        handleHashChange(): Promise<void>;
        mergeTheme: (target: Styles.Theme.ITheme, theme: Styles.Theme.ITheme) => Styles.Theme.ITheme;
        updateThemes(themes?: ITheme): void;
        updateLayout(): void;
        render(): Promise<any>;
    }
}
