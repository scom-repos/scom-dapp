import { MatchFunction } from "./pathToRegexp";
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
};

export interface IExtendedNetwork extends INetwork {
	symbol?: string;
	env?: string;
	explorerName?: string;
	explorerTxUrl?: string;
	explorerAddressUrl?: string;
	isDisabled?: boolean;
};

export interface IHeaderFooter {
	visible?: boolean,
	fixed?: boolean,
	hasLogo?: boolean,
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