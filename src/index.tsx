import { Module, Styles, Container, customModule, application, Panel } from '@ijstech/components';
import styleClass from './index.css';
import { updateNetworks } from './network';
import { updateWallets } from './wallet';
export { Header } from './header';
export { Footer } from './footer';
import {match, MatchFunction, compile} from './pathToRegexp'
import { assets } from './assets';
Styles.Theme.applyTheme(Styles.Theme.darkTheme);
interface IMenu{
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
interface ISCConfig{
	env: string;
	moduleDir?: string;
	modules: {[name: string]: {path: string, dependencies: string[]}};
	dependencies?: {[name: string]: string};
	menus: IMenu[];
	routes: IRoute[];
	networks?: INetwork[] | "*";
	copyrightInfo: string;
	version?: string;
	wallet?: string[];
	themes?: ITheme;
	breakpoints?: IBreakpoints;
};
interface INetwork {
	name?: string,
	chainId: number,
	img?: string,
	rpc?: string,
	symbol?: string,
	env?: string,
	explorerName?: string,
	explorerTxUrl?: string,
	explorerAddressUrl?: string,
	isDisabled?: boolean,
};
interface IRoute {
	url: string;
	module: string;
	default?: boolean;
	regex?: MatchFunction;
}
interface ITheme {
	default: string;
	dark?: Styles.Theme.ITheme;
	light?: Styles.Theme.ITheme;
}
interface IBreakpoints {
	mobile: number;
	tablet: number;
	desktop: number;
}
@customModule
export default class MainLauncher extends Module {
	private pnlMain: Panel;
	private menuItems: any[];
	private _options: ISCConfig;
	private currentModule: Module;

	constructor(parent?: Container, options?: any) {
		super(parent, options);
		this.classList.add(styleClass);
		this._options = options;
		let defaultRoute: IRoute | undefined = this._options?.routes?.find(route => route.default);
		if (defaultRoute && !location.hash) {
      const toPath = compile(defaultRoute.url, { encode: encodeURIComponent });
			location.hash = toPath();
		} else {
			this.handleHashChange()
		}
	};
	async init(){		
		window.onhashchange = this.handleHashChange.bind(this);
		this.menuItems = this.options.menus || [];
		assets.breakpoints = this.options.breakpoints;
		updateNetworks(this.options);
		updateWallets(this.options);
		this.updateThemes(this.options.themes)
		super.init();
	};
	hideCurrentModule(){
		if (this.currentModule) {
			this.currentModule.style.display = 'none';
			this.currentModule.onHide();
		}
	}
	async getModuleByPath(path: string): Promise<{
		module: Module,
		params?: any
	}>{
		let menu: IMenu | IRoute;
		let params: any;
		let list: Array<IMenu | IRoute> = [ ...this._options.routes || [], ...this._options.menus || []];
		for (let i = 0; i < list.length; i ++){
			let item = list[i];
			if (item.url == path){
				menu = item;
				break;
			}
			else { 
				if (!item.regex)
					item.regex = match(item.url, { decode: decodeURIComponent })
					
				let _match = item.regex(path);
				if (_match !== false){
					menu = item;
					params = "params" in menu ? Object.assign({ ...menu.params }, _match.params) : _match.params;
					break;
				};
			};
		};
		if (menu){
			let menuObj: any = menu;
			if (!menuObj.moduleObject) {
				menuObj.moduleObject = await application.loadModule(menu.module, this._options);
				if (menuObj.moduleObject) menuObj.moduleObject.onLoad();
			}
			return {
				module: menuObj.moduleObject,
				params: params
			};
		}
	};
	async handleHashChange(){
		let path = location.hash.split("?")[0];
		if (path.startsWith('#/'))
			path = path.substring(1);		
		let module = await this.getModuleByPath(path);
		if (module?.module != this.currentModule)
			this.hideCurrentModule();
		this.currentModule = module?.module;
		if (module){
			if (this.pnlMain.contains(module.module))
				module.module.style.display = 'initial';
			else
				this.pnlMain.append(module.module);
			module.module.onShow(module.params);
		};
	};
	mergeTheme = (target: Styles.Theme.ITheme, theme: Styles.Theme.ITheme) => {
		for (const key of Object.keys(theme)) {
			if (theme[key] instanceof Object) {
				Object.assign(theme[key], this.mergeTheme(target[key], theme[key]))
			}
		}
		Object.assign(target || {}, theme)
		return target
	}
	updateThemes(themes?: ITheme) {
		if (!themes) return;
		if (themes.dark) {
			this.mergeTheme(Styles.Theme.darkTheme, themes.dark);
		}
		if (themes.light) {
			this.mergeTheme(Styles.Theme.defaultTheme, themes.light);
		}
		const theme = themes.default === 'light' ? Styles.Theme.defaultTheme : Styles.Theme.darkTheme;
		Styles.Theme.applyTheme(theme);
	}
	async render() {
		return <i-vstack height="inherit">
			<main-header id="headerElm" menuItems={this.menuItems} height="auto" width="100%"></main-header>
			<i-panel id="pnlMain" stack={{ grow: "1", shrink: "0" }} ></i-panel>
			<main-footer
				id="footerElm"
				stack={{ shrink: '0' }}
				class='footer'
				height="auto"
				width="100%"
				copyrightInfo={this._options.copyrightInfo}
				version={this._options.version}
			></main-footer>
		</i-vstack>
	};
};