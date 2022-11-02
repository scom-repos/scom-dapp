import { Module, Styles, Container, customModule, application, Panel } from '@ijstech/components';
import styleClass from './index.css';
import { updateNetworks } from './network';
export { Header } from './header';
export { Footer } from './footer';
import {match, MatchFunction} from './pathToRegexp'
Styles.Theme.applyTheme(Styles.Theme.darkTheme);
interface IMenu{
	caption: string;
	url: string;
	module: string;
	params?: any;
	menus?: IMenu[];
	regex?: MatchFunction;
};
interface ISCConfig{
	env: string;
	logo?: string;
	moduleDir?: string;
	modules: {[name: string]: {path: string, dependencies: string[]}};
	dependencies?: {[name: string]: string};
	menus: IMenu[];
	networks?: INetwork[];
	copyrightInfo: string;
};
interface INetwork {
	name: string,
	chainId: number,
	img: string,
	rpc: string,
	env: string,
	explorer: string
};
@customModule
export default class MainLauncher extends Module {
	private pnlMain: Panel;
	private menuItems: any[];
	private logo: string;
	private _options: ISCConfig;
	private currentModule: Module;

	constructor(parent?: Container, options?: any) {
		super(parent, options);
		this.classList.add(styleClass);
		this._options = options;
	};
	async init(){		
		window.onhashchange = this.handleHashChange.bind(this);
		this.menuItems = this.options.menus || [];
		this.logo = this.options.logo || "";
		updateNetworks(this.options);
		super.init();
		this.handleHashChange()
	};
	hideCurrentModule(){
		if (this.currentModule)
			this.currentModule.style.display = 'none';
	}
	async getModuleByPath(path: string): Promise<Module>{
		let menu: IMenu;
		let params: any;
		for (let i = 0; i < this._options.menus.length; i ++){
			let item = this._options.menus[i];
			if (item.url == path){
				menu = item;
				break;
			}
			else { 
				if (!item.regex)
					item.regex = match(item.url)
				else{
					let match = item.regex(path);
					if (match !== false){
						menu = item;
						params = match.params;
						break;
					};
				};
			};
		};
		if (menu){
			let menuObj: any = menu;
			if (!menuObj.moduleObject)
				menuObj.moduleObject = await application.loadModule(menu.module, this._options)
			return menuObj.moduleObject;
		};
	};
	async handleHashChange(){
		let path = location.hash.split("?")[0];
		if (path.startsWith('#/'))
			path = path.substring(1);		
		let module = await this.getModuleByPath(path);
		if (module != this.currentModule)
			this.hideCurrentModule();
		this.currentModule = module;
		if (module){
			if (this.pnlMain.contains(module))
				module.style.display = 'initial';
			else
				this.pnlMain.append(module);
		};
	};
	async render() {
		return <i-vstack height="inherit">
			<main-header logo={this.options.logo} id="headerElm" menuItems={this.menuItems} height="auto" width="100%"></main-header>
			<i-panel id="pnlMain" stack={{ grow: "1", shrink: "0" }} ></i-panel>
			<main-footer
				id="footerElm"
				background={{ color: Styles.Theme.ThemeVars.background.main }}
				padding={{ top: '2rem', bottom: '2rem', right: '2rem', left: '2rem' }}
				stack={{ shrink: '0' }}
				class='footer'
				height="auto"
				width="100%"
				logo={this.options.logo}
				copyrightInfo={this._options.copyrightInfo}
			></main-footer>
		</i-vstack>
	};
};