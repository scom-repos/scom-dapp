import { Module, Styles, Container, customModule, application, Panel, IEventBus } from '@ijstech/components';
import {} from '@ijstech/eth-contract';
import styleClass from './index.css';
import { updateConfig } from './site';
import { updateWalletConfig } from './wallet';
export { Header } from './header';
export { Footer } from './footer';
export { Alert } from './alert';
import { match, MatchFunction, compile } from './pathToRegexp'
import { assets } from './assets';
import { Header } from './header';
import { Footer } from './footer';
import { IBreakpoints, IFooter, IHeader, IMenu, IExtendedNetwork } from './interface';
import { EventId } from './constants';
// import { DarkTheme } from './theme';
// Styles.Theme.applyTheme(DarkTheme);

interface ISCConfig {
	env: string;
	moduleDir?: string;
	modules: { [name: string]: { path: string, dependencies: string[], params?: any } };
	dependencies?: { [name: string]: string };
	menus: IMenu[];
	routes: IRoute[];
	networks?: IExtendedNetwork[] | "*";
	copyrightInfo: string;
	version?: string;
	wallet?: string[];
	themes?: ITheme;
	breakpoints?: IBreakpoints;
	header?: IHeader;
	footer?: IFooter;
	requireLogin?: boolean;
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
@customModule
export default class MainLauncher extends Module {
	private pnlMain: Panel;
	private menuItems: any[];
	private _options: ISCConfig;
	private currentModule: Module;
	private headerElm: Header;
	private footerElm: Footer;
	private pnlScrollable: Panel;
	private customHeaderStyles: any;
	private customFooterStyles: any;
	private hasFooterLogo: boolean;
	private $eventBus: IEventBus;

	constructor(parent?: Container, options?: any) {
		super(parent, options);
		this.classList.add(styleClass);
		this._options = options;
		let defaultRoute: IRoute | undefined = this._options?.routes?.find(route => route.default);
		if (defaultRoute && (!location.hash || location.hash === '#/')) {
			const toPath = compile(defaultRoute.url, { encode: encodeURIComponent });
			location.hash = toPath();
		} else {
			this.handleHashChange()
		}
		this.$eventBus = application.EventBus;
		this.registerEvent();
	};
	async init() {
		if (this.options?.type !== 'widget') {
			window.onhashchange = this.handleHashChange.bind(this);
		}

		this.menuItems = this.options.menus || [];
		assets.breakpoints = this.options.breakpoints;
		updateConfig(this.options);
		updateWalletConfig(this.options);
		if (this.options.themes) this.updateThemes(this.options.themes)
		this.customHeaderStyles = this._options?.header?.customStyles ?? {};
		this.customFooterStyles = this._options?.footer?.customStyles ?? {};
		this.hasFooterLogo = this._options?.footer?.hasLogo ?? true;
		super.init();
		this.updateLayout();
	};
	registerEvent() {
		this.$eventBus.register(this, EventId.setHeaderVisibility, (visible: boolean) => {
			this.headerElm.visible = visible;
		});
		this.$eventBus.register(this, EventId.setFooterVisibility, (visible: boolean) => {
			this.footerElm.visible = visible;
		});
		this.$eventBus.register(this, EventId.scrollToTop, this.scrollToTop);
	}
	hideCurrentModule() {
		if (this.currentModule) {
			this.currentModule.style.display = 'none';
			this.currentModule.onHide();
		}
	}
	async getModuleByPath(path: string): Promise<{
		module: Module,
		params?: any
	}> {
		let menu: IMenu | IRoute;
		let params: any;
		let list: Array<IMenu | IRoute> = [...this._options.routes || [], ...this._options.menus || []];
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			if (item.url == path) {
				menu = item;
				if ("params" in menu)
					params = menu.params;
				break;
			}
			else {
				if (!item.regex)
					item.regex = match(item.url, { decode: decodeURIComponent })

				let _match = item.regex(path);
				if (_match !== false) {
					menu = item;
					params = "params" in menu ? Object.assign({ ...menu.params }, _match.params) : _match.params;
					break;
				};
			};
		};
		if (menu) {
			let menuObj: any = menu;
			if (!menuObj.moduleObject) {
				menuObj.moduleObject = await application.loadModule(menu.module, this._options);
				if (menuObj.moduleObject) menuObj.moduleObject.onLoad();
			}
			let moduleParams = this._options.modules[menu.module].params;
			return {
				module: menuObj.moduleObject,
				params: Object.assign({ ...moduleParams }, { ...params })
			};
		}
	};
	async handleHashChange() {
		let path = location.hash.split("?")[0];
		if (path.startsWith('#/'))
			path = path.substring(1);
		let module = await this.getModuleByPath(path);
		if (module?.module != this.currentModule)
			this.hideCurrentModule();
		this.currentModule = module?.module;
		if (module) {
			if (this.pnlMain.contains(module.module))
				module.module.style.display = 'initial';
			else
				this.pnlMain.append(module.module);
			module.module.onShow(module.params);
			this.scrollToTop();
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
    document.body.style.setProperty('--theme', themes.default)
	}
	updateLayout() {
		const header = this._options.header || {};
		const footer = this._options.footer || {};
		this.headerElm.visible = header.visible ?? true;
		this.footerElm.visible = footer.visible ?? true;
		if (header.fixed && footer.fixed) {
			this.pnlMain.overflow.y = 'auto';
		} else {
			if (header.fixed) {
				this.pnlScrollable.append(this.pnlMain);
				this.pnlScrollable.append(this.footerElm);
				this.pnlScrollable.visible = true;
			} else if (footer.fixed) {
				this.pnlScrollable.append(this.headerElm);
				this.pnlScrollable.append(this.pnlMain);
				this.pnlScrollable.visible = true;
			}
		}
		this.headerElm.hideNetworkButton = header.hideNetworkButton;
		this.headerElm.hideWalletBalance = header.hideWalletBalance;
	}
	private scrollToTop() {
	  document.body.scrollTop = 0;
	  document.documentElement.scrollTop = 0;
	  this.pnlScrollable.scrollTop = 0;
	}

	async render() {
		return (
			<i-vstack height="inherit">
				<main-header
					id="headerElm"
					menuItems={this.menuItems}
					height="auto" width="100%"
					customStyles={this.customHeaderStyles}
				></main-header>
				<i-vstack id="pnlScrollable" visible={false} stack={{ grow: "1" }} overflow={{ y: 'auto' }}></i-vstack>
				<i-panel id="pnlMain" stack={{ grow: "1" }} ></i-panel>
				<main-footer
					id="footerElm"
					stack={{ shrink: '0' }}
					class='footer'
					height="auto"
					width="100%"
					copyrightInfo={this._options.copyrightInfo}
					version={this._options.version}
					hasLogo={this.hasFooterLogo}
					customStyles={this.customFooterStyles}
				></main-footer>
			</i-vstack>
		)
	};
};