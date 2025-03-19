var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<amd-module name='@scom/scom-dapp/pathToRegexp.ts'/> 
/*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)
  *  Licensed under the MIT License.
  *  https://github.com/pillarjs/path-to-regexp/blob/1cbb9f3d9c3bff97298ec45b1bb2b0beb879babf/LICENSE
  *--------------------------------------------------------------------------------------------*/
define("@scom/scom-dapp/pathToRegexp.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pathToRegexp = exports.tokensToRegexp = exports.regexpToFunction = exports.match = exports.tokensToFunction = exports.compile = exports.parse = void 0;
    /**
     * Tokenize input string.
     */
    function lexer(str) {
        const tokens = [];
        let i = 0;
        while (i < str.length) {
            const char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                let name = "";
                let j = i + 1;
                while (j < str.length) {
                    const code = str.charCodeAt(j);
                    if (
                    // `0-9`
                    (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name)
                    throw new TypeError(`Missing parameter name at ${i}`);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                let count = 1;
                let pattern = "";
                let j = i + 1;
                if (str[j] === "?") {
                    throw new TypeError(`Pattern cannot start with "?" at ${j}`);
                }
                while (j < str.length) {
                    if (str[j] === "\\") {
                        pattern += str[j++] + str[j++];
                        continue;
                    }
                    if (str[j] === ")") {
                        count--;
                        if (count === 0) {
                            j++;
                            break;
                        }
                    }
                    else if (str[j] === "(") {
                        count++;
                        if (str[j + 1] !== "?") {
                            throw new TypeError(`Capturing groups are not allowed at ${j}`);
                        }
                    }
                    pattern += str[j++];
                }
                if (count)
                    throw new TypeError(`Unbalanced pattern at ${i}`);
                if (!pattern)
                    throw new TypeError(`Missing pattern at ${i}`);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }
    /**
     * Parse a string for the raw tokens.
     */
    function parse(str, options = {}) {
        const tokens = lexer(str);
        const { prefixes = "./" } = options;
        const defaultPattern = `[^${escapeString(options.delimiter || "/#?")}]+?`;
        const result = [];
        let key = 0;
        let i = 0;
        let path = "";
        const tryConsume = (type) => {
            if (i < tokens.length && tokens[i].type === type)
                return tokens[i++].value;
        };
        const mustConsume = (type) => {
            const value = tryConsume(type);
            if (value !== undefined)
                return value;
            const { type: nextType, index } = tokens[i];
            throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
        };
        const consumeText = () => {
            let result = "";
            let value;
            while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            const char = tryConsume("CHAR");
            const name = tryConsume("NAME");
            const pattern = tryConsume("PATTERN");
            if (name || pattern) {
                let prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || "",
                });
                continue;
            }
            const value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            const open = tryConsume("OPEN");
            if (open) {
                const prefix = consumeText();
                const name = tryConsume("NAME") || "";
                const pattern = tryConsume("PATTERN") || "";
                const suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: name || (pattern ? key++ : ""),
                    pattern: name && !pattern ? defaultPattern : pattern,
                    prefix,
                    suffix,
                    modifier: tryConsume("MODIFIER") || "",
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }
    exports.parse = parse;
    /**
     * Compile a string to a template function for the path.
     */
    function compile(str, options) {
        return tokensToFunction(parse(str, options), options);
    }
    exports.compile = compile;
    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens, options = {}) {
        const reFlags = flags(options);
        const { encode = (x) => x, validate = true } = options;
        // Compile all the tokens into regexps.
        const matches = tokens.map((token) => {
            if (typeof token === "object") {
                return new RegExp(`^(?:${token.pattern})$`, reFlags);
            }
        });
        return (data) => {
            let path = "";
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (typeof token === "string") {
                    path += token;
                    continue;
                }
                const value = data ? data[token.name] : undefined;
                const optional = token.modifier === "?" || token.modifier === "*";
                const repeat = token.modifier === "*" || token.modifier === "+";
                if (Array.isArray(value)) {
                    if (!repeat) {
                        throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
                    }
                    if (value.length === 0) {
                        if (optional)
                            continue;
                        throw new TypeError(`Expected "${token.name}" to not be empty`);
                    }
                    for (let j = 0; j < value.length; j++) {
                        const segment = encode(value[j], token);
                        if (validate && !matches[i].test(segment)) {
                            throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                        }
                        path += token.prefix + segment + token.suffix;
                    }
                    continue;
                }
                if (typeof value === "string" || typeof value === "number") {
                    const segment = encode(String(value), token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                    }
                    path += token.prefix + segment + token.suffix;
                    continue;
                }
                if (optional)
                    continue;
                const typeOfMessage = repeat ? "an array" : "a string";
                throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
            }
            return path;
        };
    }
    exports.tokensToFunction = tokensToFunction;
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    function match(str, options) {
        const keys = [];
        const re = pathToRegexp(str, keys, options);
        return regexpToFunction(re, keys, options);
    }
    exports.match = match;
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    function regexpToFunction(re, keys, options = {}) {
        const { decode = (x) => x } = options;
        return function (pathname) {
            const m = re.exec(pathname);
            if (!m)
                return false;
            const { 0: path, index } = m;
            const params = Object.create(null);
            for (let i = 1; i < m.length; i++) {
                if (m[i] === undefined)
                    continue;
                const key = keys[i - 1];
                if (key.modifier === "*" || key.modifier === "+") {
                    params[key.name] = m[i].split(key.prefix + key.suffix).map((value) => {
                        return decode(value, key);
                    });
                }
                else {
                    params[key.name] = decode(m[i], key);
                }
            }
            return { path, index, params };
        };
    }
    exports.regexpToFunction = regexpToFunction;
    /**
     * Escape a regular expression string.
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    /**
     * Get the flags for a regexp from the options.
     */
    function flags(options) {
        return options && options.sensitive ? "" : "i";
    }
    /**
     * Pull out keys from a regexp.
     */
    function regexpToRegexp(path, keys) {
        if (!keys)
            return path;
        const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
        let index = 0;
        let execResult = groupsRegex.exec(path.source);
        while (execResult) {
            keys.push({
                // Use parenthesized substring match if available, index otherwise
                name: execResult[1] || index++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: "",
            });
            execResult = groupsRegex.exec(path.source);
        }
        return path;
    }
    /**
     * Transform an array into a regexp.
     */
    function arrayToRegexp(paths, keys, options) {
        const parts = paths.map((path) => pathToRegexp(path, keys, options).source);
        return new RegExp(`(?:${parts.join("|")})`, flags(options));
    }
    /**
     * Create a path regexp from string input.
     */
    function stringToRegexp(path, keys, options) {
        return tokensToRegexp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    function tokensToRegexp(tokens, keys, options = {}) {
        const { strict = false, start = true, end = true, encode = (x) => x, delimiter = "/#?", endsWith = "", } = options;
        const endsWithRe = `[${escapeString(endsWith)}]|$`;
        const delimiterRe = `[${escapeString(delimiter)}]`;
        let route = start ? "^" : "";
        // Iterate over the tokens and create our regexp string.
        for (const token of tokens) {
            if (typeof token === "string") {
                route += escapeString(encode(token));
            }
            else {
                const prefix = escapeString(encode(token.prefix));
                const suffix = escapeString(encode(token.suffix));
                if (token.pattern) {
                    if (keys)
                        keys.push(token);
                    if (prefix || suffix) {
                        if (token.modifier === "+" || token.modifier === "*") {
                            const mod = token.modifier === "*" ? "?" : "";
                            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
                        }
                        else {
                            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
                        }
                    }
                    else {
                        if (token.modifier === "+" || token.modifier === "*") {
                            route += `((?:${token.pattern})${token.modifier})`;
                        }
                        else {
                            route += `(${token.pattern})${token.modifier}`;
                        }
                    }
                }
                else {
                    route += `(?:${prefix}${suffix})${token.modifier}`;
                }
            }
        }
        if (end) {
            if (!strict)
                route += `${delimiterRe}?`;
            route += !options.endsWith ? "$" : `(?=${endsWithRe})`;
        }
        else {
            const endToken = tokens[tokens.length - 1];
            const isEndDelimited = typeof endToken === "string"
                ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1
                : endToken === undefined;
            if (!strict) {
                route += `(?:${delimiterRe}(?=${endsWithRe}))?`;
            }
            if (!isEndDelimited) {
                route += `(?=${delimiterRe}|${endsWithRe})`;
            }
        }
        return new RegExp(route, flags(options));
    }
    exports.tokensToRegexp = tokensToRegexp;
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp)
            return regexpToRegexp(path, keys);
        if (Array.isArray(path))
            return arrayToRegexp(path, keys, options);
        return stringToRegexp(path, keys, options);
    }
    exports.pathToRegexp = pathToRegexp;
});
define("@scom/scom-dapp/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    ;
});
define("@scom/scom-dapp/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assets = void 0;
    const moduleDir = components_1.application.currentModuleDir;
    class Assets {
        static get instance() {
            if (!this._instance)
                this._instance = new this();
            return this._instance;
        }
        get logo() {
            const themeType = document.body.style.getPropertyValue('--theme');
            let currentTheme = components_1.Styles.Theme.currentTheme;
            let theme = themeType || (currentTheme === components_1.Styles.Theme.defaultTheme ? "light" : "dark");
            let _logo = this._getLogo(this.viewport, theme);
            return _logo;
        }
        set breakpoints(value) {
            this._breakpoints = value;
        }
        get breakpoints() {
            return this._breakpoints;
        }
        get viewport() {
            if (window.innerWidth > this._breakpoints?.tablet)
                return "desktop";
            else if (window.innerWidth > this._breakpoints?.mobile)
                return "tablet";
            else
                return "mobile";
        }
        _getLogoPath(viewport, theme, type) {
            let asset = components_1.application.assets(`logo/${type}`) || components_1.application.assets(`logo`);
            let path;
            if (typeof asset === 'object') {
                if (typeof asset[viewport] === 'object') {
                    path = asset[viewport][theme];
                }
                else if (typeof asset[viewport] === 'string') {
                    path = asset[viewport];
                }
                else if (asset[theme]) {
                    path = asset[theme];
                }
            }
            else if (typeof asset === 'string') {
                path = asset;
            }
            return path;
        }
        _getLogo(viewport, theme) {
            const header = this._getLogoPath(viewport, theme, "header");
            const footer = this._getLogoPath(viewport, theme, "footer");
            return { header, footer };
        }
    }
    exports.assets = Assets.instance;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fonts: {
            poppins: {
                bold: fullPath('fonts/poppins/PoppinsBold.ttf'),
                italic: fullPath('fonts/poppins/PoppinsItalic.ttf'),
                light: fullPath('fonts/poppins/PoppinsLight.ttf'),
                medium: fullPath('fonts/poppins/PoppinsMedium.ttf'),
                regular: fullPath('fonts/poppins/PoppinsRegular.ttf'),
                thin: fullPath('fonts/poppins/PoppinsThin.ttf'),
            }
        },
        fullPath
    };
});
define("@scom/scom-dapp/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-dapp/assets.ts"], function (require, exports, components_2, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Styles.Theme.darkTheme.background.default = '#192F51';
    // Styles.Theme.darkTheme.background.paper = '#0090DA';
    // Styles.Theme.darkTheme.colors.primary.dark = '#192F51';
    // Styles.Theme.darkTheme.colors.primary.light = '#0090DA';
    // Styles.Theme.darkTheme.colors.primary.main = '#192F51';
    // Styles.Theme.darkTheme.colors.secondary.dark = '#939393';
    // Styles.Theme.darkTheme.colors.secondary.light = '#EBEBEB';
    // Styles.Theme.darkTheme.colors.secondary.main = '#B8B8B8';
    // Styles.Theme.darkTheme.text.primary = '#fff';
    // Styles.Theme.darkTheme.text.secondary = '#939393';
    // // Styles.Theme.darkTheme.typography.fontFamily = 'Poppins';
    // Styles.Theme.darkTheme.colors.warning.dark = '#f57c00';
    // Styles.Theme.darkTheme.colors.warning.light = '#F6C958';
    // Styles.Theme.darkTheme.colors.warning.main = '#ffa726';
    // Styles.Theme.darkTheme.colors.error.light = '#FD7C6B';
    // Styles.Theme.darkTheme.divider = '#EBEBEB';
    // // Styles.Theme.darkTheme.typography.fontSize = '16px';
    // Styles.Theme.darkTheme.background.modal = '#fff';
    exports.default = components_2.Styles.style({
        $nest: {
            '*': {
                boxSizing: 'border-box'
            },
            '@media screen and (min-width: 768px) and (max-width: 1280px)': {
                $nest: {
                    '.w-80': {
                        width: 'calc(100% - 64px)'
                    }
                }
            },
            '@media screen and (max-width: 767px)': {
                $nest: {
                    '.w-80': {
                        width: 'calc(100% - 32px)'
                    }
                }
            },
            '::-webkit-scrollbar-track': {
                borderRadius: '0.75rem',
                border: '1px solid transparent',
                background: 'unset'
            },
            '::-webkit-scrollbar': {
                width: '0.5rem',
                background: 'unset'
            },
            '::-webkit-scrollbar-thumb': {
                borderRadius: '0.75rem',
                background: 'var(--divider) 0% 0% no-repeat padding-box'
            },
            '::-webkit-scrollbar-thumb:hover': {
                background: 'var(--divider) 0% 0% no-repeat padding-box'
            }
        }
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.bold}") format("truetype")`,
        fontWeight: 'bold',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.italic}") format("truetype")`,
        fontWeight: '300',
        fontStyle: 'italic'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.regular}") format("truetype")`,
        fontWeight: 'normal',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.medium}") format("truetype")`,
        fontWeight: '600',
        fontStyle: 'normal'
    });
    components_2.Styles.fontFace({
        fontFamily: "Poppins",
        src: `url("${assets_1.default.fonts.poppins.thin}") format("truetype")`,
        fontWeight: '300',
        fontStyle: 'normal'
    });
});
define("@scom/scom-dapp/site.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLoggedInAccount = exports.getIsLoggedIn = exports.getRequireLogin = exports.getEnv = exports.isValidEnv = exports.hasThemeButton = exports.getOAuthProvider = exports.updateConfig = void 0;
    const updateConfig = (options) => {
        if (options.oauth) {
            state.oauth = options.oauth;
        }
        if (options.env) {
            setEnv(options.env);
        }
        if (options.requireLogin) {
            setRequireLogin(options.requireLogin);
        }
        state.showThemeButton = options?.showThemeButton ?? false;
        components_3.application.store = {
            ...components_3.application.store,
            ...state
        };
    };
    exports.updateConfig = updateConfig;
    const state = {
        oauth: {},
        showThemeButton: false,
        env: "",
        requireLogin: false,
        isLoggedIn: (address) => (0, exports.getIsLoggedIn)(address)
    };
    const getOAuthProvider = (provider) => {
        return state.oauth[provider];
    };
    exports.getOAuthProvider = getOAuthProvider;
    const hasThemeButton = () => {
        return state.showThemeButton;
    };
    exports.hasThemeButton = hasThemeButton;
    const isValidEnv = (env) => {
        const _env = state.env === 'testnet' || state.env === 'mainnet' ? state.env : "";
        return !_env || !env || env === _env;
    };
    exports.isValidEnv = isValidEnv;
    const setEnv = (env) => {
        state.env = env;
    };
    const getEnv = () => {
        return state.env;
    };
    exports.getEnv = getEnv;
    const setRequireLogin = (value) => {
        state.requireLogin = value;
    };
    const getRequireLogin = () => {
        return state.requireLogin;
    };
    exports.getRequireLogin = getRequireLogin;
    const getIsLoggedIn = (address) => {
        const loggedInAccount = (0, exports.getLoggedInAccount)();
        return loggedInAccount === address;
    };
    exports.getIsLoggedIn = getIsLoggedIn;
    const getLoggedInAccount = () => {
        const loggedInAccount = localStorage.getItem('loggedInAccount');
        return loggedInAccount;
    };
    exports.getLoggedInAccount = getLoggedInAccount;
});
define("@scom/scom-dapp/constants.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
});
define("@scom/scom-dapp/wallet.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-multicall", "@scom/scom-network-list", "@scom/scom-dapp/site.ts"], function (require, exports, components_4, eth_wallet_1, scom_multicall_1, scom_network_list_1, site_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.viewOnExplorerByAddress = exports.getWalletConnectConfig = exports.setWalletConnectConfig = exports.getWalletPluginProvider = exports.setWalletPluginProvider = exports.getInfuraId = exports.getDefaultChainId = exports.getNetworkInfo = exports.isDefaultNetworkFromWallet = exports.updateWalletConfig = exports.switchNetwork = exports.hasMetaMask = exports.hasWallet = exports.isWalletConnected = exports.getWalletProvider = exports.getSiteSupportedNetworks = exports.getSupportedWalletProviders = exports.logoutWallet = exports.connectWallet = exports.initWalletPlugins = exports.WalletPlugin = void 0;
    var WalletPlugin;
    (function (WalletPlugin) {
        WalletPlugin["MetaMask"] = "metamask";
        WalletPlugin["WalletConnect"] = "walletconnect";
        WalletPlugin["Email"] = "email";
        WalletPlugin["Google"] = "google";
    })(WalletPlugin = exports.WalletPlugin || (exports.WalletPlugin = {}));
    const state = {
        infuraId: "",
        defaultChainId: 0,
        multicalls: [],
        networkMap: {},
        instanceId: "",
        defaultNetworkFromWallet: false,
        wallets: [],
        walletPluginMap: {},
        walletConnectConfig: null
    };
    async function getWalletPluginConfigProvider(wallet, pluginName, packageName, options) {
        switch (pluginName) {
            case WalletPlugin.MetaMask:
                return new eth_wallet_1.MetaMaskProvider(wallet, {}, options);
            case WalletPlugin.WalletConnect:
                return new eth_wallet_1.Web3ModalProvider(wallet, {}, options);
            default: {
                if (packageName) {
                    const provider = await components_4.application.loadPackage(packageName, '*');
                    return new provider(wallet, {}, options);
                }
            }
        }
    }
    async function initWalletPlugin(walletPlugin, networkList, rpcs) {
        let wallet = eth_wallet_1.Wallet.getClientInstance();
        let pluginName = walletPlugin.name;
        let providerOptions;
        if (pluginName == WalletPlugin.WalletConnect) {
            await components_4.application.loadPackage('@ijstech/eth-wallet-web3modal', '*');
            let walletConnectConfig = (0, exports.getWalletConnectConfig)();
            let mainChainId = (0, exports.getDefaultChainId)();
            let optionalChains = networkList.map((network) => network.chainId).filter((chainId) => chainId !== mainChainId);
            providerOptions = {
                ...walletConnectConfig,
                name: pluginName,
                infuraId: (0, exports.getInfuraId)(),
                chains: [mainChainId],
                optionalChains: optionalChains,
                rpc: rpcs,
                useDefaultProvider: true
            };
        }
        else {
            providerOptions = {
                name: pluginName,
                infuraId: (0, exports.getInfuraId)(),
                rpc: rpcs,
                useDefaultProvider: true
            };
        }
        let provider = await getWalletPluginConfigProvider(wallet, pluginName, walletPlugin.packageName, providerOptions);
        (0, exports.setWalletPluginProvider)(pluginName, {
            name: pluginName,
            packageName: walletPlugin.packageName,
            provider
        });
        return provider;
    }
    async function initWalletPlugins() {
        let networkList = (0, exports.getSiteSupportedNetworks)();
        const rpcs = {};
        for (const network of networkList) {
            let rpc = network.rpcUrls[0];
            if (rpc)
                rpcs[network.chainId] = rpc;
        }
        for (let walletPlugin of state.wallets) {
            await initWalletPlugin(walletPlugin, networkList, rpcs);
        }
    }
    exports.initWalletPlugins = initWalletPlugins;
    async function connectWallet(walletPluginName, eventPayload) {
        // let walletProvider = localStorage.getItem('walletProvider') || '';
        let wallet = eth_wallet_1.Wallet.getClientInstance();
        if (!wallet.chainId) {
            // wallet.chainId = getDefaultChainId();
        }
        let provider = (0, exports.getWalletPluginProvider)(walletPluginName);
        if (!provider) {
            let networkList = (0, exports.getSiteSupportedNetworks)();
            const rpcs = {};
            for (const network of networkList) {
                let rpc = network.rpcUrls[0];
                if (rpc)
                    rpcs[network.chainId] = rpc;
            }
            let walletPlugin = state.wallets.find(v => v.name == walletPluginName);
            if (walletPlugin) {
                provider = await initWalletPlugin(walletPlugin, networkList, rpcs);
            }
        }
        if (provider?.installed()) {
            await wallet.connect(provider, eventPayload);
        }
        return wallet;
    }
    exports.connectWallet = connectWallet;
    async function logoutWallet() {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        await wallet.disconnect();
        localStorage.setItem('walletProvider', '');
        // application.EventBus.dispatch(EventId.IsWalletDisconnected);
    }
    exports.logoutWallet = logoutWallet;
    const getSupportedWalletProviders = () => {
        const walletPluginMap = getWalletPluginMap();
        return state.wallets.map(v => walletPluginMap[v.name].provider);
    };
    exports.getSupportedWalletProviders = getSupportedWalletProviders;
    const getSiteSupportedNetworks = () => {
        let networkFullList = Object.values(state.networkMap);
        let list = networkFullList.filter(network => !network.isDisabled && (0, site_1.isValidEnv)(network.env));
        return list;
    };
    exports.getSiteSupportedNetworks = getSiteSupportedNetworks;
    function getWalletProvider() {
        return localStorage.getItem('walletProvider') || '';
    }
    exports.getWalletProvider = getWalletProvider;
    ;
    function isWalletConnected() {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isWalletConnected = isWalletConnected;
    const hasWallet = function () {
        let hasWallet = false;
        const walletPluginMap = getWalletPluginMap();
        for (let pluginName in walletPluginMap) {
            const provider = walletPluginMap[pluginName].provider;
            if (provider.installed()) {
                hasWallet = true;
                break;
            }
        }
        return hasWallet;
    };
    exports.hasWallet = hasWallet;
    const hasMetaMask = function () {
        const provider = (0, exports.getWalletPluginProvider)(WalletPlugin.MetaMask);
        return provider?.installed();
    };
    exports.hasMetaMask = hasMetaMask;
    async function switchNetwork(chainId) {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        await wallet.switchNetwork(chainId);
        if (!isWalletConnected()) {
            components_4.application.EventBus.dispatch("chainChanged" /* EventId.chainChanged */, chainId);
        }
    }
    exports.switchNetwork = switchNetwork;
    const updateWalletConfig = (options) => {
        if (options.infuraId) {
            setInfuraId(options.infuraId);
        }
        if (options.networks) {
            setNetworkList(options.networks, options.infuraId);
        }
        if (options.defaultChainId) {
            setDefaultChainId(options.defaultChainId);
        }
        if (options.wallets) {
            state.wallets = options.wallets;
        }
        if (options.walletConnect) {
            state.walletConnectConfig = options.walletConnect;
        }
        const networks = Object.values(state.networkMap);
        const multicalls = (0, scom_multicall_1.getMulticallInfoList)();
        state.multicalls = multicalls;
        const clientWalletConfig = {
            defaultChainId: state.defaultChainId,
            networks,
            infuraId: state.infuraId,
            multicalls
        };
        const clientWallet = eth_wallet_1.Wallet.getClientInstance();
        clientWallet.initClientWallet(clientWalletConfig);
        const rpcWalletConfig = {
            networks,
            defaultChainId: clientWallet.chainId,
            infuraId: state.infuraId,
            multicalls
        };
        const instanceId = clientWallet.initRpcWallet(rpcWalletConfig);
        state.instanceId = instanceId;
        components_4.application.store = {
            ...components_4.application.store,
            ...state
        };
    };
    exports.updateWalletConfig = updateWalletConfig;
    const isDefaultNetworkFromWallet = () => {
        return state.defaultNetworkFromWallet;
    };
    exports.isDefaultNetworkFromWallet = isDefaultNetworkFromWallet;
    const setNetworkList = (networkOptionsList, infuraId) => {
        state.networkMap = {};
        const defaultNetworkList = (0, scom_network_list_1.default)();
        const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
            acc[cur.chainId] = cur;
            return acc;
        }, {});
        state.defaultNetworkFromWallet = networkOptionsList === "*";
        if (state.defaultNetworkFromWallet) {
            const networksMap = defaultNetworkMap;
            for (const chainId in networksMap) {
                const networkInfo = networksMap[chainId];
                const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
                if (state.infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                    for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                        networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
                    }
                }
                state.networkMap[networkInfo.chainId] = {
                    ...networkInfo,
                    symbol: networkInfo.nativeCurrency?.symbol || "",
                    explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                    explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
                };
            }
        }
        else if (Array.isArray(networkOptionsList)) {
            const networksMap = defaultNetworkMap;
            let networkOptionsMap = networkOptionsList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let chainId in networksMap) {
                const networkOptions = networkOptionsMap[chainId];
                const networkInfo = networksMap[chainId];
                const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
                if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                    for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                        networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
                    }
                }
                state.networkMap[networkInfo.chainId] = {
                    ...networkInfo,
                    ...networkOptions,
                    symbol: networkInfo.nativeCurrency?.symbol || "",
                    explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                    explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : "",
                    isDisabled: !!networkOptions ? false : true
                };
            }
        }
    };
    const getNetworkInfo = (chainId) => {
        return state.networkMap[chainId];
    };
    exports.getNetworkInfo = getNetworkInfo;
    const setDefaultChainId = (chainId) => {
        state.defaultChainId = chainId;
    };
    const getDefaultChainId = () => {
        return state.defaultChainId;
    };
    exports.getDefaultChainId = getDefaultChainId;
    const setInfuraId = (infuraId) => {
        state.infuraId = infuraId;
    };
    const getInfuraId = () => {
        return state.infuraId;
    };
    exports.getInfuraId = getInfuraId;
    const setWalletPluginProvider = (name, wallet) => {
        state.walletPluginMap[name] = wallet;
    };
    exports.setWalletPluginProvider = setWalletPluginProvider;
    const getWalletPluginMap = () => {
        return state.walletPluginMap;
    };
    const getWalletPluginProvider = (name) => {
        return state.walletPluginMap[name]?.provider || null;
    };
    exports.getWalletPluginProvider = getWalletPluginProvider;
    const setWalletConnectConfig = (data) => {
        state.walletConnectConfig = data;
    };
    exports.setWalletConnectConfig = setWalletConnectConfig;
    const getWalletConnectConfig = () => {
        return state.walletConnectConfig;
    };
    exports.getWalletConnectConfig = getWalletConnectConfig;
    const viewOnExplorerByAddress = (chainId, address) => {
        let network = (0, exports.getNetworkInfo)(chainId);
        if (network && network.explorerAddressUrl) {
            let url = `${network.explorerAddressUrl}${address}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByAddress = viewOnExplorerByAddress;
});
define("@scom/scom-dapp/header.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_5.Styles.Theme.ThemeVars;
    exports.default = components_5.Styles.style({
        zIndex: 2,
        $nest: {
            // '::-webkit-scrollbar-track': {
            //   borderRadius: '12px',
            //   border: '1px solid transparent',
            //   backgroundColor: 'unset'
            // },
            // '::-webkit-scrollbar': {
            //   width: '8px',
            //   backgroundColor: 'unset'
            // },
            // '::-webkit-scrollbar-thumb': {
            //   borderRadius: '12px',
            //   background: 'rgba(255, 255, 255, 0.2) 0% 0% no-repeat padding-box'
            // },
            '.os-modal': {
                boxSizing: 'border-box',
                $nest: {
                    '.i-modal_header': {
                        borderRadius: '10px 10px 0 0',
                        background: 'unset',
                        borderBottom: `2px solid ${Theme.divider}`,
                        padding: '1rem',
                        fontWeight: 700,
                        fontSize: '1rem'
                    }
                }
            },
            '.header-logo > img': {
                maxHeight: 'unset',
                maxWidth: 'unset'
            },
            '.wallet-modal > div': {
                boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px'
            },
            '.wallet-modal .modal': {
                minWidth: 200
            },
            '.custom-switch .wrapper': {
                borderRadius: 40,
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
                $nest: {
                    '.switch-base': {
                        background: Theme.background.gradient
                    },
                    '.track::before': {
                        fontSize: 18,
                        color: Theme.text.primary
                    },
                    '.track::after': {
                        transform: 'translateY(-50%) rotate(-30deg)',
                        fontSize: 18,
                        color: '#fff'
                    },
                    '.track': {
                        background: 'linear-gradient(0deg, #252A48, #252A48), #8994A3',
                        color: 'transparent'
                    },
                    '.switch-base.checked +.track': {
                        background: Theme.background.main
                    }
                }
            }
        }
    });
});
define("@scom/scom-dapp/API.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyAuthCode = exports.sendAuthCode = exports.apiLogout = exports.apiLogin = exports.checkLoginSession = exports.requestLoginSession = void 0;
    const API_BASE_URL = '/api/account/v0';
    function constructPersonalSignMessage(walletAddress, uuid) {
        let messageChunks = [
            'Welcome to SCOM Marketplace!',
            'Click to sign in and accept the SCOM Terms of Service.',
            'This request will not trigger a blockchain transaction or cost any gas fees.',
            `Wallet address:\n${walletAddress}`,
            `Nonce:\n${uuid}`
        ];
        return messageChunks.join('\n\n');
    }
    async function checkLoginSession() {
        let body = JSON.stringify({});
        let response = await fetch(API_BASE_URL + '/check-login-session', {
            body: body,
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        let result = await response.json();
        return result;
    }
    exports.checkLoginSession = checkLoginSession;
    ;
    async function requestLoginSession(sessionType) {
        let body = JSON.stringify({ type: sessionType });
        let response = await fetch(API_BASE_URL + '/request-login-session', {
            body: body,
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        let result = await response.json();
        return result;
    }
    exports.requestLoginSession = requestLoginSession;
    ;
    async function apiLogin(sessionNonce) {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        let msg = constructPersonalSignMessage(wallet.address, sessionNonce);
        await eth_wallet_2.Wallet.initWeb3();
        let signature = await wallet.signMessage(msg);
        let chainId = await wallet.getChainId();
        let body = JSON.stringify({
            chainId: chainId,
            uuid: sessionNonce,
            signature: signature,
            walletAddress: wallet.address
        });
        let response = await fetch(API_BASE_URL + '/login', {
            body: body,
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        let result = await response.json();
        return result;
    }
    exports.apiLogin = apiLogin;
    ;
    async function apiLogout() {
        let response = await fetch(API_BASE_URL + '/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        let result = await response.json();
        return result;
    }
    exports.apiLogout = apiLogout;
    async function sendAuthCode(email) {
        let response = await fetch(API_BASE_URL + '/send-auth-code', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            })
        });
        let result = await response.json();
        return result;
    }
    exports.sendAuthCode = sendAuthCode;
    async function verifyAuthCode(verifyAuthCodeArgs) {
        let response = await fetch(API_BASE_URL + '/verify-auth-code', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyAuthCodeArgs)
        });
        let result = await response.json();
        return result;
    }
    exports.verifyAuthCode = verifyAuthCode;
});
define("@scom/scom-dapp/alert.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.modalStyle = void 0;
    exports.modalStyle = components_6.Styles.style({
        $nest: {
            '.modal': {
                padding: 0,
                borderRadius: 4
            },
        }
    });
});
define("@scom/scom-dapp/alert.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-dapp/alert.css.ts"], function (require, exports, components_7, alert_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Alert = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    ;
    let Alert = class Alert extends components_7.Module {
        constructor() {
            super(...arguments);
            this.closeModal = () => {
                this.mdAlert.visible = false;
            };
            this.showModal = () => {
                this.renderUI();
                this.mdAlert.visible = true;
            };
        }
        get message() {
            return this._message;
        }
        set message(value) {
            this._message = value;
            this.mdAlert.onClose = this._message.onClose;
        }
        get iconName() {
            if (this.message.status === 'error')
                return 'times';
            else if (this.message.status === 'warning')
                return 'exclamation';
            else if (this.message.status === 'success')
                return 'check';
            else
                return 'spinner';
        }
        get color() {
            if (this.message.status === 'error')
                return Theme.colors.error.main;
            else if (this.message.status === 'warning')
                return Theme.colors.warning.main;
            else if (this.message.status === 'success')
                return Theme.colors.success.main;
            else
                return Theme.colors.primary.main;
        }
        renderUI() {
            this.pnlMain.clearInnerHTML();
            const content = this.renderContent();
            const link = this.renderLink();
            const border = this.message.status === 'loading' ? {} : { border: { width: 2, style: 'solid', color: this.color, radius: '50%' } };
            const paddingSize = this.message.status === 'loading' ? "0.25rem" : "0.6rem";
            this.pnlMain.appendChild(this.$render("i-vstack", { horizontalAlignment: "center", gap: "1.75rem" },
                this.$render("i-icon", { width: 55, height: 55, name: this.iconName, fill: this.color, padding: { top: paddingSize, bottom: paddingSize, left: paddingSize, right: paddingSize }, spin: this.message.status === 'loading', ...border }),
                content,
                link,
                this.$render("i-button", { padding: { top: "0.5rem", bottom: "0.5rem", left: "2rem", right: "2rem" }, caption: "Close", font: { color: Theme.colors.primary.contrastText }, onClick: this.closeModal.bind(this) })));
        }
        renderContent() {
            if (!this.message.title && !this.message.content)
                return [];
            const lblTitle = this.message.title ? this.$render("i-label", { caption: this.message.title, font: { size: '1.25rem', bold: true } }) : [];
            const lblContent = this.message.content ? this.$render("i-label", { caption: this.message.content, overflowWrap: 'anywhere' }) : [];
            return (this.$render("i-vstack", { class: "text-center", horizontalAlignment: "center", gap: "0.75rem", lineHeight: 1.5 },
                lblTitle,
                lblContent));
        }
        renderLink() {
            if (!this.message.link)
                return [];
            return (this.$render("i-label", { class: "text-center", caption: this.message.link.caption, font: { size: '0.875rem' }, link: { href: this.message.link.href, target: '_blank' }, overflowWrap: 'anywhere' }));
        }
        render() {
            return (this.$render("i-modal", { id: "mdAlert", class: alert_css_1.modalStyle, maxWidth: "400px" },
                this.$render("i-panel", { id: "pnlMain", width: "100%", padding: { top: "1.5rem", bottom: "1.5rem", left: "1.5rem", right: "1.5rem" } })));
        }
    };
    Alert = __decorate([
        (0, components_7.customElements)('main-alert')
    ], Alert);
    exports.Alert = Alert;
    ;
});
define("@scom/scom-dapp/selectNetwork.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-dapp/wallet.ts"], function (require, exports, components_8, eth_wallet_3, wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectNetwork = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let SelectNetwork = class SelectNetwork extends components_8.Module {
        async onNetworkSelected() { }
        async switchNetwork(chainId) {
            if (!chainId || (0, wallet_1.isDefaultNetworkFromWallet)())
                return;
            await (0, wallet_1.switchNetwork)(chainId);
            this.onNetworkSelected();
        }
        isNetworkActive(chainId) {
            return eth_wallet_3.Wallet.getInstance().chainId === chainId;
        }
        renderNetworks() {
            this.gridNetworkGroup.clearInnerHTML();
            this.networkMapper = new Map();
            this.networkActiveIndicatorMap = new Map();
            const supportedNetworks = (0, wallet_1.getSiteSupportedNetworks)();
            this.gridNetworkGroup.append(...supportedNetworks.map((network) => {
                const img = network.image ? this.$render("i-image", { url: network.image, width: 34, height: 34 }) : [];
                const isActive = this.isNetworkActive(network.chainId);
                if (isActive)
                    this.currActiveNetworkId = network.chainId;
                const activeIndicator = (this.$render("i-panel", { visible: isActive, position: 'absolute', border: { radius: '50%' }, background: { color: '#20bf55' }, width: "10px", height: "10px" }));
                this.networkActiveIndicatorMap.set(network.chainId, activeIndicator);
                const hsNetwork = (this.$render("i-hstack", { onClick: () => this.switchNetwork(network.chainId), background: { color: Theme.colors.secondary.light }, border: { radius: 10 }, opacity: isActive ? 1 : 0.5, hover: { opacity: 1 }, position: "relative", cursor: 'pointer', verticalAlignment: "center", padding: { top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' } },
                    activeIndicator,
                    this.$render("i-hstack", { margin: { left: '1rem' }, verticalAlignment: "center", gap: 12 },
                        img,
                        this.$render("i-label", { caption: network.chainName, wordBreak: "break-word", font: { size: '.875rem', bold: true, color: Theme.colors.primary.dark } }))));
                this.networkMapper.set(network.chainId, hsNetwork);
                return hsNetwork;
            }));
        }
        setActiveNetworkIndicator(connected) {
            const wallet = eth_wallet_3.Wallet.getClientInstance();
            if (this.currActiveNetworkId !== undefined && this.currActiveNetworkId !== null && this.networkMapper.has(this.currActiveNetworkId)) {
                const networkHStack = this.networkMapper.get(this.currActiveNetworkId);
                networkHStack.opacity = 0.5;
                this.networkActiveIndicatorMap.get(this.currActiveNetworkId).visible = false;
            }
            if (connected && this.networkMapper.has(wallet.chainId)) {
                const networkHStack = this.networkMapper.get(wallet.chainId);
                networkHStack.opacity = 1;
                this.networkActiveIndicatorMap.get(wallet.chainId).visible = true;
            }
            this.currActiveNetworkId = wallet.chainId;
        }
        async init() {
            super.init();
            this.renderNetworks();
            this.setActiveNetworkIndicator(eth_wallet_3.Wallet.getClientInstance().isConnected);
        }
        render() {
            return (this.$render("i-vstack", { height: '100%', lineHeight: 1.5, padding: { left: '1rem', right: '1rem', bottom: '2rem' } },
                this.$render("i-hstack", { margin: { left: '-1.25rem', right: '-1.25rem' }, height: '100%' },
                    this.$render("i-grid-layout", { id: 'gridNetworkGroup', font: { color: '#f05e61' }, height: "calc(100% - 160px)", width: "100%", overflow: { y: 'auto' }, margin: { top: '1.5rem' }, padding: { left: '1.25rem', right: '1.25rem' }, columnsPerRow: 1, templateRows: ['max-content'], class: 'list-view', gap: { row: '0.5rem' } }))));
        }
    };
    SelectNetwork = __decorate([
        (0, components_8.customElements)('scom-dapp--select-network')
    ], SelectNetwork);
    exports.SelectNetwork = SelectNetwork;
});
define("@scom/scom-dapp/connectWallet.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-dapp/API.ts", "@scom/scom-dapp/assets.ts", "@scom/scom-dapp/site.ts", "@scom/scom-dapp/wallet.ts"], function (require, exports, components_9, eth_wallet_4, API_1, assets_2, site_2, wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConnectWallet = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ConnectWallet = class ConnectWallet extends components_9.Module {
        constructor() {
            super(...arguments);
            this.connectToProviderFunc = async (walletPlugin) => {
                const provider = (0, wallet_2.getWalletPluginProvider)(walletPlugin);
                if (provider?.installed()) {
                    let loginSessionResult = await (0, API_1.requestLoginSession)(2 /* LoginSessionType.Email */);
                    if (!loginSessionResult.success) {
                        return;
                    }
                    this.loginSessionNonce = loginSessionResult.data.nonce;
                    this.loginSessionExpireAt = loginSessionResult.data.expireAt;
                    await (0, wallet_2.connectWallet)(walletPlugin, {
                        userTriggeredConnect: true,
                        sessionNonce: this.loginSessionNonce,
                        sessionExpireAt: this.loginSessionExpireAt,
                    });
                }
                else {
                    let homepage = provider.homepage;
                    this.openLink(homepage);
                }
                await this.onWalletSelected();
            };
            this.initWallet = async () => {
                await (0, wallet_2.initWalletPlugins)();
                this.walletMapper = new Map();
                const walletList = (0, wallet_2.getSupportedWalletProviders)();
                this.pnlWalletPlugins.clearInnerHTML();
                walletList.forEach((wallet) => {
                    if (wallet.name === wallet_2.WalletPlugin.Email) {
                        this.pnlEmail.visible = true;
                    }
                    else if (wallet.name === wallet_2.WalletPlugin.Google) {
                        const googleContainer = new components_9.HStack();
                        this.pnlOAuthPlugins.append(googleContainer);
                        google.accounts.id.initialize({
                            client_id: (0, site_2.getOAuthProvider)(wallet_2.WalletPlugin.Google).clientId,
                            context: 'signin',
                            ux_mode: 'popup',
                            callback: this.handleSignInWithGoogle.bind(this)
                        });
                        // google.accounts.id.prompt();
                        google.accounts.id.renderButton(googleContainer, {
                            type: 'icon',
                            shape: 'rectangular',
                            theme: 'outline',
                            size: 'large',
                            text: 'signin_with',
                            logo_alignment: 'left',
                        });
                    }
                    else {
                        const isActive = this.isWalletActive(wallet.name);
                        if (isActive)
                            this.currActiveWallet = wallet.name;
                        const imageUrl = wallet.image;
                        const hsWallet = (this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: '0.5rem', height: '2.75rem', border: { radius: '0.35rem', width: '1px', style: 'solid', color: Theme.colors.secondary.light }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, cursor: 'pointer', onClick: () => this.connectToProviderFunc(wallet.name) },
                            this.$render("i-button", { caption: wallet.displayName, icon: {
                                    width: '1.75rem',
                                    height: '1.75rem',
                                    image: {
                                        width: '1.75rem',
                                        height: '1.75rem',
                                        display: 'inline-block',
                                        url: imageUrl
                                    },
                                    margin: { right: '0.438rem' }
                                }, padding: { top: '0px', bottom: '0px', left: '0px', right: '0px' }, font: { weight: 500, size: '0.875rem' }, background: { color: 'transparent' }, boxShadow: 'none', width: '100%', height: '100%', grid: { horizontalAlignment: 'start' } }),
                            this.$render("i-label", { caption: 'Connect', font: { color: Theme.colors.primary.main } })));
                        this.walletMapper.set(wallet.name, hsWallet);
                        this.pnlWalletPlugins.append(hsWallet);
                    }
                });
            };
        }
        async onWalletSelected() { }
        isWalletActive(walletPlugin) {
            const provider = (0, wallet_2.getWalletPluginProvider)(walletPlugin);
            return provider ? provider.installed() && eth_wallet_4.Wallet.getClientInstance().clientSideProvider?.name === walletPlugin : false;
        }
        openLink(link) {
            return window.open(link, '_blank');
        }
        ;
        async handleSignInWithGoogle(response) {
            let idToken = response.credential;
            let payload = JSON.parse(atob(idToken.split('.')[1]));
            let email = payload.email;
            let loginSessionResult = await (0, API_1.requestLoginSession)(2 /* LoginSessionType.Email */);
            if (!loginSessionResult.success) {
                return;
            }
            this.loginSessionNonce = loginSessionResult.data.nonce;
            this.loginSessionExpireAt = loginSessionResult.data.expireAt;
            await (0, wallet_2.connectWallet)(wallet_2.WalletPlugin.Email, {
                sessionNonce: this.loginSessionNonce,
                sessionExpireAt: this.loginSessionExpireAt,
                userTriggeredConnect: true,
                verifyAuthCode: API_1.verifyAuthCode,
                verifyAuthCodeArgs: {
                    email: email,
                    authCode: idToken,
                    provider: 'google'
                }
            });
            await this.onWalletSelected();
            console.log(email);
        }
        onDigitInputKeyUp(target, event, index) {
            if (target.value.length === 1) {
                if (index === this.digitInputs.length - 1) {
                    this.handleEmailLogin();
                }
                else {
                    this.digitInputs[index + 1].focus();
                }
            }
            else if (event.key === 'Backspace' && target.value === '' && index !== 0) {
                this.digitInputs[index - 1].focus();
            }
        }
        renderAuthCodeDigits() {
            this.digitInputs = [];
            this.pnlAuthCodeDigits.clearInnerHTML();
            for (let i = 0; i < 6; i++) {
                const digitInput = (this.$render("i-input", { inputType: 'number', maxLength: 1, height: '3.625rem', width: '2.875rem', border: { radius: '0.75rem', width: '1px', style: 'solid', color: Theme.colors.secondary.light }, padding: { left: '0.625rem', right: '0.625rem' }, font: { size: '1.125rem' }, onFocus: this.onInputFocused, onBlur: this.onInputBlured, onKeyUp: (target, event) => this.onDigitInputKeyUp(target, event, i) }));
                this.digitInputs.push(digitInput);
                this.pnlAuthCodeDigits.appendChild(digitInput);
            }
        }
        async onSubmitEmail() {
            let loginSessionResult = await (0, API_1.requestLoginSession)(2 /* LoginSessionType.Email */);
            if (!loginSessionResult.success) {
                return;
            }
            this.loginSessionNonce = loginSessionResult.data.nonce;
            this.loginSessionExpireAt = loginSessionResult.data.expireAt;
            await (0, API_1.sendAuthCode)(this.inputEmailAddress.value);
            this.lbConfirmEmailRecipient.caption = this.inputEmailAddress.value;
            this.renderAuthCodeDigits();
            this.pnlConfirmEmail.visible = true;
            this.pnlLogin.visible = false;
        }
        async handleEmailLogin() {
            let authCode = '';
            this.digitInputs.forEach((digitInput) => {
                authCode += digitInput.value;
            });
            if (authCode.length !== 6)
                return;
            await (0, wallet_2.connectWallet)(wallet_2.WalletPlugin.Email, {
                sessionNonce: this.loginSessionNonce,
                sessionExpireAt: this.loginSessionExpireAt,
                userTriggeredConnect: true,
                verifyAuthCode: API_1.verifyAuthCode,
                verifyAuthCodeArgs: {
                    email: this.inputEmailAddress.value,
                    authCode: authCode
                }
            });
            await this.onWalletSelected();
        }
        setActiveWalletIndicator(connected) {
            const wallet = eth_wallet_4.Wallet.getClientInstance();
            if (this.currActiveWallet && this.walletMapper.has(this.currActiveWallet)) {
                this.walletMapper.get(this.currActiveWallet).classList.remove('is-actived');
            }
            if (connected && this.walletMapper.has(wallet.clientSideProvider?.name)) {
                this.walletMapper.get(wallet.clientSideProvider?.name).classList.add('is-actived');
            }
            this.currActiveWallet = wallet.clientSideProvider?.name;
        }
        onTogglePanel(target) {
            const groups = this.querySelectorAll('.group');
            for (let group of groups) {
                group.visible = false;
            }
            const nextElm = target.nextSibling;
            if (nextElm)
                nextElm.visible = true;
        }
        onEmailInputChanged(target) {
            this.btnSubmitEmail.enabled = target.value;
            this.btnSubmitEmail.font = { color: this.btnSubmitEmail.enabled ? Theme.colors.primary.contrastText : Theme.text.disabled };
        }
        onInputFocused(target, isParent = false) {
            if (!target)
                return;
            target.border.color = Theme.colors.primary.light;
            target.border.width = '1px';
            target.border.style = 'solid';
            target.border.radius = isParent ? '0.375rem 0 0 0.375rem' : '0.75rem';
            target.boxShadow = `0 0 0 1px ${Theme.colors.primary.light})`;
        }
        onInputBlured(target, isParent = false) {
            if (!target)
                return;
            target.border.color = isParent ? 'transparent' : Theme.colors.secondary.light;
            target.boxShadow = `none`;
        }
        show() {
            this.pnlConfirmEmail.visible = false;
            this.pnlLogin.visible = true;
        }
        async init() {
            super.init();
            await this.initWallet();
        }
        render() {
            return (this.$render("i-vstack", { padding: { left: '1rem', right: '1rem', bottom: '2rem' }, lineHeight: 1.5 },
                this.$render("i-vstack", { id: "pnlLogin", height: '100%', stack: { grow: '1' } },
                    this.$render("i-vstack", { width: "100%", padding: { left: '0.75rem', right: '0.75rem', top: '0.75rem', bottom: '0.75rem' }, gap: "0.75rem", border: { radius: '0.75rem', width: '1px', style: 'solid', color: Theme.colors.primary.light }, margin: { bottom: '1rem' } },
                        this.$render("i-panel", { height: "100%", cursor: "pointer", onClick: this.onTogglePanel },
                            this.$render("i-label", { caption: 'Connect Wallet', font: { size: '0.875rem', weight: 500 }, lineHeight: 1.25 })),
                        this.$render("i-vstack", { gap: "0.75rem", class: "group" },
                            this.$render("i-vstack", { gap: '0.5rem', id: "pnlWalletPlugins" }))),
                    this.$render("i-vstack", { width: "100%", padding: { left: '0.75rem', right: '0.75rem', top: '0.75rem', bottom: '0.75rem' }, gap: "0.75rem", border: { radius: '0.75rem', width: '1px', style: 'solid', color: Theme.colors.primary.light } },
                        this.$render("i-panel", { cursor: "pointer", onClick: this.onTogglePanel },
                            this.$render("i-label", { caption: 'Email & Social', font: { size: '0.875rem', weight: 500 }, lineHeight: 1.25 })),
                        this.$render("i-vstack", { gap: "0.75rem", visible: false, class: "group" },
                            this.$render("i-vstack", { id: "pnlEmail", visible: false },
                                this.$render("i-hstack", { border: { radius: '0.375rem', width: '1px', style: 'solid', color: Theme.colors.secondary.light }, height: '2.75rem', width: '100%' },
                                    this.$render("i-hstack", { verticalAlignment: "center", gap: '1.25rem', width: '100%', stack: { grow: '1' }, padding: { left: '0.5rem' }, background: { color: Theme.input.background }, border: { radius: '0.375rem 0 0 0.375rem', width: '1px', style: 'solid', color: 'transparent' } },
                                        this.$render("i-icon", { name: "envelope", fill: Theme.text.secondary, width: '1.25rem', height: '1.25rem' }),
                                        this.$render("i-input", { id: "inputEmailAddress", border: { radius: '0.375rem 0 0.375rem 0' }, height: '100%', width: '100%', placeholder: 'your@email.com', onChanged: this.onEmailInputChanged, onFocus: (target) => this.onInputFocused(target.parent, true), onBlur: (target) => this.onInputBlured(target.parent, true) })),
                                    this.$render("i-button", { id: "btnSubmitEmail", caption: 'Submit', boxShadow: 'none', height: '100%', padding: { left: '0.9rem', right: '0.9rem' }, border: { radius: '0 0.375rem 0.375rem 0' }, enabled: false, stack: { basis: '4.688rem' }, onClick: this.onSubmitEmail })),
                                this.$render("i-label", { caption: `Get started without a wallet.`, font: { color: Theme.text.secondary, size: '0.813rem' } }),
                                this.$render("i-hstack", { width: '100%', gap: '0.5rem', verticalAlignment: "center", padding: { left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-panel", { width: '100%', height: 1, border: { top: { width: '1px', style: 'solid', color: Theme.colors.secondary.light } } }),
                                    this.$render("i-label", { caption: 'Or', font: { color: Theme.text.secondary, size: '0.813rem' } }),
                                    this.$render("i-panel", { width: '100%', height: 1, border: { top: { width: '1px', style: 'solid', color: Theme.colors.secondary.light } } }))),
                            this.$render("i-hstack", { id: "pnlOAuthPlugins", gap: '0.25rem', verticalAlignment: "center", height: '2.75rem' })))),
                this.$render("i-vstack", { id: "pnlConfirmEmail", justifyContent: "center", alignItems: 'center', gap: '1rem', height: '100%', width: '100%', visible: false },
                    this.$render("i-image", { url: `${assets_2.default.fullPath('img/envelop.svg')}`, width: '3rem', height: '3rem' }),
                    this.$render("i-label", { caption: 'Enter confirmation code', font: { size: '1.063rem', weight: 500 } }),
                    this.$render("i-hstack", { gap: '0.25rem', verticalAlignment: 'center', horizontalAlignment: 'center', margin: { bottom: '1.5rem' }, wrap: 'wrap' },
                        this.$render("i-label", { caption: 'Please check', font: { color: Theme.text.secondary, weight: 300 } }),
                        this.$render("i-label", { id: "lbConfirmEmailRecipient", font: { color: Theme.text.secondary, weight: 600 } }),
                        this.$render("i-label", { caption: 'for an email and enter your code below.', font: { color: Theme.text.secondary, weight: 300 } })),
                    this.$render("i-hstack", { id: "pnlAuthCodeDigits", width: '100%', margin: { top: '1.25rem' }, horizontalAlignment: "space-between", overflow: 'hidden' }),
                    this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", width: '100%' },
                        this.$render("i-label", { caption: `Didn't get an email?`, font: { color: Theme.text.secondary, size: '0.813rem' } }),
                        this.$render("i-label", { caption: `Resend Code`, font: { color: Theme.text.secondary, size: '0.813rem' }, link: { href: '' } })))));
        }
    };
    ConnectWallet = __decorate([
        (0, components_9.customElements)('scom-dapp--connect-wallet')
    ], ConnectWallet);
    exports.ConnectWallet = ConnectWallet;
});
define("@scom/scom-dapp/header.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-dapp/header.css.ts", "@scom/scom-dapp/assets.ts", "@scom/scom-dapp/site.ts", "@scom/scom-dapp/wallet.ts", "@scom/scom-dapp/pathToRegexp.ts", "@scom/scom-dapp/API.ts", "@scom/scom-dapp/selectNetwork.tsx", "@scom/scom-dapp/connectWallet.tsx"], function (require, exports, components_10, eth_wallet_5, header_css_1, assets_3, site_3, wallet_3, pathToRegexp_1, API_2, selectNetwork_1, connectWallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Header = void 0;
    const Theme = components_10.Styles.Theme.ThemeVars;
    ;
    let Header = class Header extends components_10.Module {
        constructor(parent, options) {
            super(parent, options);
            this.walletInfo = {
                address: '',
                balance: '',
                networkId: 0
            };
            this.handleChainChanged = async (chainId) => {
                this.walletInfo.networkId = chainId;
                this.selectedNetwork = (0, wallet_3.getNetworkInfo)(chainId);
                let wallet = eth_wallet_5.Wallet.getClientInstance();
                this.walletInfo.address = wallet.address;
                const isConnected = wallet.isConnected;
                this.walletInfo.balance = isConnected ? components_10.FormatUtils.formatNumber((await wallet.balance).toFixed(), { decimalFigures: 2 }) : '0';
                this.updateConnectedStatus(isConnected);
                this.updateList(isConnected);
                this.renderMobileMenu();
                this.renderDesktopMenu();
            };
            this.updateConnectedStatus = (isConnected) => {
                if (isConnected) {
                    this.lblBalance.caption = `${this.walletInfo.balance} ${this.symbol}`;
                    const address = this.walletInfo.address;
                    const displayedAddress = address ? components_10.FormatUtils.truncateWalletAddress(address) : '-';
                    this.btnWalletDetail.caption = displayedAddress;
                    this.lblWalletAddress.caption = displayedAddress;
                    const networkInfo = (0, wallet_3.getNetworkInfo)(eth_wallet_5.Wallet.getInstance().chainId);
                    this.hsViewAccount.visible = !!networkInfo?.explorerAddressUrl;
                }
                else {
                    this.hsViewAccount.visible = false;
                }
                const supportedNetworks = (0, wallet_3.getSiteSupportedNetworks)();
                const isSupportedNetwork = this.selectedNetwork && supportedNetworks.findIndex(network => network === this.selectedNetwork) !== -1;
                if (isSupportedNetwork) {
                    const img = this.selectedNetwork?.image ? this.selectedNetwork.image : undefined;
                    this.btnNetwork.icon = img ? this.$render("i-icon", { width: 26, height: 26, image: { url: img } }) : undefined;
                    this.btnNetwork.caption = this.selectedNetwork?.chainName ?? "";
                }
                else {
                    this.btnNetwork.icon = undefined;
                    this.btnNetwork.caption = (0, wallet_3.isDefaultNetworkFromWallet)() ? "Unknown Network" : "Unsupported Network";
                }
                this.btnNetwork.visible = true;
                this.btnConnectWallet.visible = !isConnected;
                this.hsBalance.visible = !this._hideWalletBalance && isConnected;
                this.pnlWalletDetail.visible = isConnected;
            };
            this.openConnectModal = () => {
                this.initWallet();
                if (!this.connectWalletModule) {
                    this.connectWalletModule = new connectWallet_1.ConnectWallet();
                    this.connectWalletModule.onWalletSelected = async () => {
                        this.connectWalletModule.closeModal();
                    };
                }
                let modal = this.connectWalletModule.openModal({
                    // title: 'Connect wallet',
                    width: '28rem'
                });
                this.connectWalletModule.show();
            };
            this.openNetworkModal = async () => {
                if ((0, wallet_3.isDefaultNetworkFromWallet)())
                    return;
                if (!this.selectNetworkModule) {
                    this.selectNetworkModule = new selectNetwork_1.SelectNetwork();
                    this.selectNetworkModule.onNetworkSelected = async () => {
                        this.selectNetworkModule.closeModal();
                    };
                }
                let modal = this.selectNetworkModule.openModal({
                    title: 'Select a Network',
                    width: '28rem'
                });
            };
            this.openWalletDetailModal = () => {
                this.mdWalletDetail.visible = true;
            };
            this.openAccountModal = (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                this.mdAccount.visible = true;
            };
            this.login = async (sessionNonce) => {
                let errMsg = '';
                let isLoggedIn = false;
                if (!this.isLoginRequestSent) {
                    try {
                        this.isLoginRequestSent = true;
                        const loginAPIResult = await (0, API_2.apiLogin)(sessionNonce);
                        if (loginAPIResult.error || !loginAPIResult.success) {
                            errMsg = loginAPIResult.error?.message || 'Login failed';
                        }
                        else {
                            isLoggedIn = true;
                        }
                    }
                    catch (err) {
                        errMsg = 'Login failed';
                    }
                    this.isLoginRequestSent = false;
                }
                return {
                    success: isLoggedIn,
                    error: errMsg
                };
            };
            this.handleLogoutClick = async (target, event) => {
                if (event)
                    event.stopPropagation();
                this.mdWalletDetail.visible = false;
                if ((0, site_3.getRequireLogin)()) {
                    await (0, API_2.apiLogout)();
                    localStorage.removeItem('loggedInAccount');
                    components_10.application.EventBus.dispatch("isAccountLoggedIn" /* EventId.IsAccountLoggedIn */, false);
                }
                await (0, wallet_3.logoutWallet)();
                this.mdAccount.visible = false;
            };
            this.copyWalletAddress = () => {
                components_10.application.copyToClipboard(this.walletInfo.address || "");
            };
            this.initWallet = async () => {
                if (this.wallet)
                    return;
                const onAccountChanged = async (payload) => {
                    const { userTriggeredConnect, account, sessionNonce, sessionExpireAt } = payload;
                    let requireLogin = (0, site_3.getRequireLogin)();
                    let connected = !!account;
                    if (connected) {
                        if (requireLogin) {
                            if (userTriggeredConnect) {
                                let loginResult = await this.login(sessionNonce);
                                if (loginResult.success) {
                                    this.keepSessionAlive(sessionExpireAt);
                                    localStorage.setItem('loggedInAccount', account);
                                }
                                else {
                                    this.mdMainAlert.message = {
                                        status: 'error',
                                        content: loginResult.error
                                    };
                                    this.mdMainAlert.showModal();
                                }
                                components_10.application.EventBus.dispatch("isAccountLoggedIn" /* EventId.IsAccountLoggedIn */, loginResult.success);
                            }
                            else {
                                const { success, error, expireAt } = await (0, API_2.checkLoginSession)();
                                if (success) {
                                    this.keepSessionAlive(expireAt);
                                    localStorage.setItem('loggedInAccount', account);
                                    components_10.application.EventBus.dispatch("isAccountLoggedIn" /* EventId.IsAccountLoggedIn */, true);
                                }
                                else {
                                    localStorage.removeItem('loggedInAccount');
                                    components_10.application.EventBus.dispatch("isAccountLoggedIn" /* EventId.IsAccountLoggedIn */, false);
                                }
                            }
                        }
                        else {
                            await this.doActionOnWalletConnected(connected);
                        }
                        const walletProviderName = eth_wallet_5.Wallet.getClientInstance()?.clientSideProvider?.name || '';
                        localStorage.setItem('walletProvider', walletProviderName);
                    }
                    else {
                        if (requireLogin) {
                            localStorage.removeItem('loggedInAccount');
                            components_10.application.EventBus.dispatch("isAccountLoggedIn" /* EventId.IsAccountLoggedIn */, false);
                        }
                        else {
                            await this.doActionOnWalletConnected(connected);
                        }
                    }
                };
                let wallet = eth_wallet_5.Wallet.getClientInstance();
                await wallet.init();
                this.wallet = wallet;
                wallet.registerWalletEvent(this, eth_wallet_5.Constants.ClientWalletEvent.AccountsChanged, onAccountChanged);
                wallet.registerWalletEvent(this, eth_wallet_5.Constants.ClientWalletEvent.ChainChanged, async (chainIdHex) => {
                    const chainId = Number(chainIdHex);
                    await this.handleChainChanged(chainId);
                });
            };
            this.$eventBus = components_10.application.EventBus;
        }
        ;
        get symbol() {
            let symbol = '';
            if (this.selectedNetwork?.chainId && this.selectedNetwork?.symbol) {
                symbol = this.selectedNetwork?.symbol;
            }
            return symbol;
        }
        get hideNetworkButton() {
            return this._hideNetworkButton;
        }
        set hideNetworkButton(value) {
            this._hideNetworkButton = value;
            if (value)
                this.pnlNetwork.visible = false;
        }
        get hideWalletBalance() {
            return this._hideWalletBalance;
        }
        set hideWalletBalance(value) {
            this._hideWalletBalance = value;
            if (value)
                this.hsBalance.visible = false;
        }
        async doActionOnWalletConnected(connected) {
            let wallet = eth_wallet_5.Wallet.getClientInstance();
            this.walletInfo.address = wallet.address;
            this.walletInfo.balance = connected ? components_10.FormatUtils.formatNumber((await wallet.balance).toFixed(), { decimalFigures: 2 }) : '0';
            this.walletInfo.networkId = wallet.chainId;
            this.selectedNetwork = (0, wallet_3.getNetworkInfo)(wallet.chainId);
            this.updateConnectedStatus(connected);
            this.updateList(connected);
            this.renderMobileMenu();
            this.renderDesktopMenu();
        }
        registerEvent() {
            this.$eventBus.register(this, "connectWallet" /* EventId.ConnectWallet */, this.openConnectModal);
            // this.$eventBus.register(this, EventId.IsWalletDisconnected, async () => {
            //   const requireLogin = getRequireLogin();
            //   if (requireLogin) return;
            //   await this.doActionOnWalletConnected(false);
            // })
            this.$eventBus.register(this, "isAccountLoggedIn" /* EventId.IsAccountLoggedIn */, async (loggedIn) => {
                const requireLogin = (0, site_3.getRequireLogin)();
                if (!requireLogin)
                    return;
                let connected = loggedIn && eth_wallet_5.Wallet.getClientInstance().isConnected;
                await this.doActionOnWalletConnected(connected);
            });
            this.$eventBus.register(this, "chainChanged" /* EventId.chainChanged */, async (chainId) => {
                await this.handleChainChanged(chainId);
            });
        }
        async init() {
            this.classList.add(header_css_1.default);
            this.selectedNetwork = (0, wallet_3.getNetworkInfo)((0, wallet_3.getDefaultChainId)());
            super.init();
            try {
                const customStyleAttr = this.getAttribute('customStyles', true);
                const customStyle = components_10.Styles.style(customStyleAttr);
                customStyle && this.classList.add(customStyle);
            }
            catch { }
            this._menuItems = this.getAttribute("menuItems", true, []);
            this.renderMobileMenu();
            this.renderDesktopMenu();
            this.controlMenuDisplay();
            this.registerEvent();
            let selectedProvider = localStorage.getItem('walletProvider');
            if (!selectedProvider && (0, wallet_3.hasMetaMask)()) {
                selectedProvider = wallet_3.WalletPlugin.MetaMask;
            }
            if (!eth_wallet_5.Wallet.getClientInstance().chainId) {
                eth_wallet_5.Wallet.getClientInstance().chainId = (0, wallet_3.getDefaultChainId)();
            }
            const themeType = document.body.style.getPropertyValue('--theme');
            this.switchTheme.checked = themeType === 'light';
            const requireLogin = (0, site_3.getRequireLogin)();
            if (requireLogin) {
                this.btnConnectWallet.caption = 'Login';
                this.doActionOnWalletConnected(false);
                await this.initWallet();
                const loggedInAccount = (0, site_3.getLoggedInAccount)();
                await (0, wallet_3.connectWallet)(selectedProvider, {
                    userTriggeredConnect: false,
                    loggedInAccount
                });
            }
            else {
                this.btnConnectWallet.caption = 'Connect Wallet';
                await this.initWallet();
                await (0, wallet_3.connectWallet)(selectedProvider, {
                    userTriggeredConnect: false,
                });
                this.doActionOnWalletConnected((0, wallet_3.isWalletConnected)());
            }
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener('resize', this.controlMenuDisplay.bind(this));
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            window.removeEventListener('resize', this.controlMenuDisplay.bind(this));
        }
        controlMenuDisplay() {
            const url = assets_3.assets.logo.header;
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
        updateList(isConnected) {
            this.connectWalletModule?.setActiveWalletIndicator(isConnected);
            this.selectNetworkModule?.setActiveNetworkIndicator(isConnected);
        }
        viewOnExplorerByAddress() {
            (0, wallet_3.viewOnExplorerByAddress)(eth_wallet_5.Wallet.getInstance().chainId, this.walletInfo.address);
        }
        openLink(link) {
            return window.open(link, '_blank');
        }
        ;
        isWalletActive(walletPlugin) {
            const provider = (0, wallet_3.getWalletPluginProvider)(walletPlugin);
            return provider ? provider.installed() && eth_wallet_5.Wallet.getClientInstance().clientSideProvider?.name === walletPlugin : false;
        }
        isNetworkActive(chainId) {
            return eth_wallet_5.Wallet.getInstance().chainId === chainId;
        }
        keepSessionAlive(expireAt) {
            if (this.keepAliveInterval) {
                clearInterval(this.keepAliveInterval);
            }
            if (expireAt) {
                const interval = Math.floor((expireAt - Date.now()) / 2);
                this.keepAliveInterval = setInterval(async () => {
                    await (0, API_2.checkLoginSession)();
                }, interval);
            }
        }
        getMenuPath(url, params) {
            try {
                const toPath = (0, pathToRegexp_1.compile)(url, { encode: encodeURIComponent });
                return toPath(params);
            }
            catch (err) { }
            return "";
        }
        _getMenuData(list, mode, validMenuItemsFn) {
            const menuItems = [];
            list.filter(validMenuItemsFn).forEach((item, key) => {
                const linkTarget = item.isToExternal ? '_blank' : '_self';
                const path = this.getMenuPath(item.url, item.params);
                const _menuItem = {
                    title: item.caption,
                    link: { href: '/#' + path, target: linkTarget },
                };
                if (mode === 'mobile') {
                    _menuItem.font = { color: Theme.colors.primary.main };
                    if (item.img)
                        _menuItem.icon = { width: 24, height: 24, image: { width: 24, height: 24, url: components_10.application.assets(item.img) } };
                }
                if (item.menus && item.menus.length) {
                    _menuItem.items = this._getMenuData(item.menus, mode, validMenuItemsFn);
                }
                menuItems.push(_menuItem);
            });
            return menuItems;
        }
        getMenuData(list, mode) {
            let wallet = eth_wallet_5.Wallet.getClientInstance();
            let isLoggedIn = (item) => !item.isLoginRequired || (0, site_3.getIsLoggedIn)(wallet.address);
            let chainId = this.selectedNetwork?.chainId || wallet.chainId;
            let validMenuItemsFn;
            if (chainId) {
                validMenuItemsFn = (item) => isLoggedIn(item) && !item.isDisabled && (!item.networks || item.networks.includes(chainId)) && (0, site_3.isValidEnv)(item.env);
            }
            else {
                validMenuItemsFn = (item) => isLoggedIn(item) && !item.isDisabled && (0, site_3.isValidEnv)(item.env);
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
            const themeValues = this.switchTheme.checked ? components_10.Styles.Theme.defaultTheme : components_10.Styles.Theme.darkTheme;
            components_10.Styles.Theme.applyTheme(themeValues);
            const themeType = this.switchTheme.checked ? 'light' : 'dark';
            document.body.style.setProperty('--theme', themeType);
            components_10.application.EventBus.dispatch("themeChanged" /* EventId.themeChanged */, themeType);
            this.controlMenuDisplay();
        }
        render() {
            return (this.$render("i-hstack", { height: 60, position: "relative", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, background: { color: Theme.background.paper }, verticalAlignment: "center" },
                this.$render("i-grid-layout", { width: '100%', position: "relative", verticalAlignment: 'center', templateColumns: ["1fr", "auto"] },
                    this.$render("i-hstack", { id: "hsMobileMenu", verticalAlignment: "center", width: "max-content", visible: false },
                        this.$render("i-icon", { id: "hamburger", class: 'pointer', name: "bars", width: "20px", height: "20px", display: "inline-block", margin: { right: 5 }, fill: Theme.text.primary, onClick: this.toggleMenu }),
                        this.$render("i-modal", { id: "mdMobileMenu", height: "auto", minWidth: "250px", showBackdrop: false, popupPlacement: "bottomLeft", background: { color: Theme.background.modal } },
                            this.$render("i-menu", { id: "menuMobile", mode: "inline", font: { color: Theme.text.primary } })),
                        this.$render("i-image", { id: "imgMobileLogo", class: "header-logo", height: 40, margin: { right: '0.5rem' } })),
                    this.$render("i-hstack", { id: "hsDesktopMenu", wrap: "nowrap", verticalAlignment: "center", width: "100%", overflow: "hidden" },
                        this.$render("i-image", { id: "imgDesktopLogo", class: "header-logo", height: 40, margin: { right: '1.25rem' } }),
                        this.$render("i-menu", { id: "menuDesktop", width: "100%", border: { left: { color: Theme.divider, width: '1px', style: 'solid' } }, font: { color: Theme.text.primary } })),
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end' },
                        this.$render("i-panel", { margin: { right: '0.5rem' } },
                            this.$render("i-switch", { id: "switchTheme", checkedText: '\u263C', uncheckedText: '\u263E', checkedThumbColor: "transparent", uncheckedThumbColor: "transparent", class: "custom-switch", visible: (0, site_3.hasThemeButton)(), onChanged: this.onThemeChanged.bind(this) })),
                        this.$render("i-panel", { id: "pnlNetwork" },
                            this.$render("i-button", { id: "btnNetwork", visible: false, height: 38, class: "btn-network", margin: { right: '0.5rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: 5 }, font: { color: Theme.colors.primary.contrastText }, onClick: this.openNetworkModal })),
                        this.$render("i-hstack", { id: "hsBalance", height: 38, visible: false, horizontalAlignment: "center", verticalAlignment: "center", background: { color: Theme.colors.primary.main }, border: { radius: 5 }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' } },
                            this.$render("i-label", { id: "lblBalance", font: { color: Theme.colors.primary.contrastText } })),
                        this.$render("i-panel", { id: "pnlWalletDetail", visible: false },
                            this.$render("i-button", { id: "btnWalletDetail", height: 38, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, margin: { left: '0.5rem' }, border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, onClick: this.openWalletDetailModal }),
                            this.$render("i-modal", { id: "mdWalletDetail", class: "wallet-modal", height: "auto", maxWidth: 200, showBackdrop: false, popupPlacement: "bottomRight" },
                                this.$render("i-vstack", { gap: 15, padding: { top: 10, left: 10, right: 10, bottom: 10 } },
                                    this.$render("i-button", { caption: "Account", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openAccountModal }),
                                    this.$render("i-button", { caption: "Logout", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.handleLogoutClick })))),
                        this.$render("i-button", { id: "btnConnectWallet", height: 38, caption: "Connect Wallet", border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, onClick: this.openConnectModal }))),
                this.$render("i-modal", { id: 'mdAccount', title: 'Account', class: 'os-modal', width: 440, height: 200, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { width: "100%", padding: { top: "1.75rem", bottom: "1rem", left: "2.75rem", right: "2.75rem" }, gap: 5 },
                        this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: 'center' },
                            this.$render("i-label", { font: { size: '0.875rem' }, caption: 'Connected with' }),
                            this.$render("i-button", { caption: 'Logout', font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: 6, bottom: 6, left: 10, right: 10 }, border: { radius: 5 }, onClick: this.handleLogoutClick })),
                        this.$render("i-label", { id: "lblWalletAddress", font: { size: '1.25rem', bold: true, color: Theme.colors.primary.main }, lineHeight: 1.5 }),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "2.5rem" },
                            this.$render("i-hstack", { class: "pointer", verticalAlignment: "center", tooltip: { content: `The address has been copied`, trigger: 'click' }, gap: "0.5rem", onClick: this.copyWalletAddress },
                                this.$render("i-icon", { name: "copy", width: "16px", height: "16px", fill: Theme.text.secondary }),
                                this.$render("i-label", { caption: "Copy Address", font: { size: "0.875rem", bold: true } })),
                            this.$render("i-hstack", { id: "hsViewAccount", class: "pointer", verticalAlignment: "center", onClick: this.viewOnExplorerByAddress.bind(this) },
                                this.$render("i-icon", { name: "external-link-alt", width: "16", height: "16", fill: Theme.text.secondary, display: "inline-block" }),
                                this.$render("i-label", { caption: "View on Explorer", margin: { left: "0.5rem" }, font: { size: "0.875rem", bold: true } }))))),
                this.$render("main-alert", { id: "mdMainAlert" }),
                this.$render("i-hstack", { position: 'absolute', width: "100%", bottom: "0px", left: "0px", class: "custom-bd" })));
        }
    };
    __decorate([
        (0, components_10.observable)()
    ], Header.prototype, "walletInfo", void 0);
    Header = __decorate([
        (0, components_10.customElements)('main-header')
    ], Header);
    exports.Header = Header;
});
define("@scom/scom-dapp/footer.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logoStyle = void 0;
    exports.logoStyle = components_11.Styles.style({
        $nest: {
            '> img': {
                maxHeight: 'unset',
                maxWidth: 'unset'
            }
        }
    });
});
define("@scom/scom-dapp/footer.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-dapp/footer.css.ts", "@scom/scom-dapp/assets.ts"], function (require, exports, components_12, footer_css_1, assets_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = void 0;
    const Theme = components_12.Styles.Theme.ThemeVars;
    ;
    let Footer = class Footer extends components_12.Module {
        init() {
            super.init();
            const hasLogo = this.getAttribute("hasLogo", true, true);
            this.imgLogo.visible = hasLogo;
            this.updateLogo = this.updateLogo.bind(this);
            this.updateLogo();
            const version = this.getAttribute("version", true, "");
            this.lblVersion.caption = version ? "Version: " + version : version;
            this.lblVersion.visible = !!version;
            const copyright = this.getAttribute('copyrightInfo', true, "");
            this.lblCopyright.caption = version ? copyright + " |" : copyright;
            this.lblCopyright.visible = !!copyright;
            try {
                const customStyleAttr = this.getAttribute('customStyles', true);
                const customStyle = components_12.Styles.style(customStyleAttr);
                customStyle && this.classList.add(customStyle);
            }
            catch { }
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener('resize', this.updateLogo);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            window.removeEventListener('resize', this.updateLogo);
        }
        updateLogo() {
            const url = assets_4.assets.logo.footer;
            if (this.imgLogo.url !== url)
                this.imgLogo.url = url;
        }
        render() {
            return (this.$render("i-panel", { height: 105, padding: { top: '1rem', bottom: '1rem', right: '2rem', left: '2rem' }, background: { color: components_12.Styles.Theme.ThemeVars.background.main } },
                this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", width: "100%" },
                    this.$render("i-vstack", { gap: "0.5rem", width: "100%", class: "footer-content" },
                        this.$render("i-hstack", { padding: { bottom: '0.5rem' }, border: { bottom: { width: 1, style: 'solid', color: Theme.divider } }, verticalAlignment: "center", gap: 8, class: "footer-content_logo" },
                            this.$render("i-image", { id: "imgLogo", class: footer_css_1.logoStyle, height: 40 }),
                            this.$render("i-hstack", { id: "lblPoweredBy", gap: 4, class: "power-by" },
                                this.$render("i-label", { caption: 'Powered by', class: "lb-power" }),
                                this.$render("i-label", { caption: 'Secure', font: { bold: true, transform: 'uppercase' }, class: "lb-secure" }),
                                this.$render("i-label", { caption: 'Compute', font: { bold: true, transform: 'uppercase' }, class: "lb-compute" }))),
                        this.$render("i-hstack", { gap: 4, verticalAlignment: "center", wrap: "wrap", class: "footer-content_copyright" },
                            this.$render("i-label", { id: "lblCopyright", font: { color: Theme.text.secondary, size: '0.875em' } }),
                            this.$render("i-label", { id: "lblVersion", font: { color: Theme.text.secondary, size: '0.875em' } }))))));
        }
    };
    Footer = __decorate([
        (0, components_12.customElements)('main-footer')
    ], Footer);
    exports.Footer = Footer;
});
define("@scom/scom-dapp", ["require", "exports", "@ijstech/components", "@scom/scom-dapp/index.css.ts", "@scom/scom-dapp/site.ts", "@scom/scom-dapp/wallet.ts", "@scom/scom-dapp/header.tsx", "@scom/scom-dapp/footer.tsx", "@scom/scom-dapp/alert.tsx", "@scom/scom-dapp/pathToRegexp.ts", "@scom/scom-dapp/assets.ts"], function (require, exports, components_13, index_css_1, site_4, wallet_4, header_1, footer_1, alert_1, pathToRegexp_2, assets_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Alert = exports.Footer = exports.Header = void 0;
    Object.defineProperty(exports, "Header", { enumerable: true, get: function () { return header_1.Header; } });
    Object.defineProperty(exports, "Footer", { enumerable: true, get: function () { return footer_1.Footer; } });
    Object.defineProperty(exports, "Alert", { enumerable: true, get: function () { return alert_1.Alert; } });
    ;
    let MainLauncher = class MainLauncher extends components_13.Module {
        constructor(parent, options) {
            super(parent, options);
            this.mergeTheme = (target, theme) => {
                for (const key of Object.keys(theme)) {
                    if (theme[key] instanceof Object) {
                        Object.assign(theme[key], this.mergeTheme(target[key], theme[key]));
                    }
                }
                Object.assign(target || {}, theme);
                return target;
            };
            this.classList.add(index_css_1.default);
            this._options = options;
            let defaultRoute = this._options?.routes?.find(route => route.default);
            if (defaultRoute && (!location.hash || location.hash === '#/')) {
                const toPath = (0, pathToRegexp_2.compile)(defaultRoute.url, { encode: encodeURIComponent });
                location.hash = toPath();
            }
            else {
                this.handleHashChange();
            }
            this.$eventBus = components_13.application.EventBus;
            this.registerEvent();
        }
        ;
        async init() {
            if (this.options?.type !== 'widget') {
                window.onhashchange = this.handleHashChange.bind(this);
            }
            this.menuItems = this.options.menus || [];
            assets_5.assets.breakpoints = this.options.breakpoints;
            (0, site_4.updateConfig)(this.options);
            (0, wallet_4.updateWalletConfig)(this.options);
            if (this.options.themes)
                this.updateThemes(this.options.themes);
            this.customHeaderStyles = this._options?.header?.customStyles ?? {};
            this.customFooterStyles = this._options?.footer?.customStyles ?? {};
            this.hasFooterLogo = this._options?.footer?.hasLogo ?? true;
            super.init();
            this.updateLayout();
        }
        ;
        registerEvent() {
            this.$eventBus.register(this, "setHeaderVisibility" /* EventId.setHeaderVisibility */, (visible) => {
                this.headerElm.visible = visible;
            });
            this.$eventBus.register(this, "setFooterVisibility" /* EventId.setFooterVisibility */, (visible) => {
                this.footerElm.visible = visible;
            });
            this.$eventBus.register(this, "scrollToTop" /* EventId.scrollToTop */, this.scrollToTop);
        }
        hideCurrentModule() {
            if (this.currentModule) {
                this.currentModule.style.display = 'none';
                this.currentModule.onHide();
            }
        }
        async getModuleByPath(path) {
            let menu;
            let params;
            let list = [...this._options.routes || [], ...this._options.menus || []];
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
                        item.regex = (0, pathToRegexp_2.match)(item.url, { decode: decodeURIComponent });
                    let _match = item.regex(path);
                    if (_match !== false) {
                        menu = item;
                        params = "params" in menu ? Object.assign({ ...menu.params }, _match.params) : _match.params;
                        break;
                    }
                    ;
                }
                ;
            }
            ;
            if (menu) {
                let menuObj = menu;
                if (!menuObj.moduleObject) {
                    menuObj.moduleObject = await components_13.application.loadModule(menu.module, this._options);
                    if (menuObj.moduleObject)
                        menuObj.moduleObject.onLoad();
                }
                let moduleParams = this._options.modules[menu.module].params;
                return {
                    module: menuObj.moduleObject,
                    params: Object.assign({ ...moduleParams }, { ...params })
                };
            }
        }
        ;
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
            }
            ;
        }
        ;
        updateThemes(themes) {
            if (!themes)
                return;
            if (themes.dark) {
                this.mergeTheme(components_13.Styles.Theme.darkTheme, themes.dark);
            }
            if (themes.light) {
                this.mergeTheme(components_13.Styles.Theme.defaultTheme, themes.light);
            }
            const theme = themes.default === 'light' ? components_13.Styles.Theme.defaultTheme : components_13.Styles.Theme.darkTheme;
            components_13.Styles.Theme.applyTheme(theme);
            document.body.style.setProperty('--theme', themes.default);
        }
        updateLayout() {
            const header = this._options.header || {};
            const footer = this._options.footer || {};
            this.headerElm.visible = header.visible ?? true;
            this.footerElm.visible = footer.visible ?? true;
            if (header.fixed && footer.fixed) {
                this.pnlMain.overflow.y = 'auto';
            }
            else {
                if (header.fixed) {
                    this.pnlScrollable.append(this.pnlMain);
                    this.pnlScrollable.append(this.footerElm);
                    this.pnlScrollable.visible = true;
                }
                else if (footer.fixed) {
                    this.pnlScrollable.append(this.headerElm);
                    this.pnlScrollable.append(this.pnlMain);
                    this.pnlScrollable.visible = true;
                }
            }
            this.headerElm.hideNetworkButton = header.hideNetworkButton;
            this.headerElm.hideWalletBalance = header.hideWalletBalance;
        }
        scrollToTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.pnlScrollable.scrollTop = 0;
        }
        async render() {
            return (this.$render("i-vstack", { height: "inherit" },
                this.$render("main-header", { id: "headerElm", menuItems: this.menuItems, height: "auto", width: "100%", customStyles: this.customHeaderStyles }),
                this.$render("i-vstack", { id: "pnlScrollable", visible: false, stack: { grow: "1" }, overflow: { y: 'auto' } }),
                this.$render("i-panel", { id: "pnlMain", stack: { grow: "1" } }),
                this.$render("main-footer", { id: "footerElm", stack: { shrink: '0' }, class: 'footer', height: "auto", width: "100%", copyrightInfo: this._options.copyrightInfo, version: this._options.version, hasLogo: this.hasFooterLogo, customStyles: this.customFooterStyles })));
        }
        ;
    };
    MainLauncher = __decorate([
        components_13.customModule
    ], MainLauncher);
    exports.default = MainLauncher;
    ;
});
