import { MatchFunction } from "./pathToRegexp";

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
};

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
};

export interface IHeaderFooter {
	visible?: boolean,
	fixed?: boolean}

export interface IHeader extends IHeaderFooter {
	hideNetworkButton?: boolean;
	hideWalletBalance?: boolean;
}

export interface IFooter extends IHeaderFooter {
}