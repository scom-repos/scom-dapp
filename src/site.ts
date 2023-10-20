import { application } from "@ijstech/components";
import { IOAuthProvider } from "./interface";

export const updateConfig = (options: any) => {
  if (options.oauth) {
    state.oauth = options.oauth;
  }
  if (options.env) {
    setEnv(options.env);
  }
  if (options.requireLogin) {
    setRequireLogin(options.requireLogin);
  }
  state.showThemeButton = options?.showThemeButton ?? false
  application.store = {
    ...application.store,
    ...state
  }
};

const state = {
  oauth: {} as {[provider: string]: IOAuthProvider},
  showThemeButton: false,
  env: "",
  requireLogin: false,
  isLoggedIn: (address: string) => getIsLoggedIn(address)
}

export const getOAuthProvider = (provider: string) => {
  return state.oauth[provider];
}

export const hasThemeButton = () => {
  return state.showThemeButton
}

export const isValidEnv = (env: string) => {
  const _env = state.env === 'testnet' || state.env === 'mainnet' ? state.env : "";
  return !_env || !env || env === _env;
}

const setEnv = (env: string) => {
  state.env = env;
}

export const getEnv = () => {
  return state.env;
}

const setRequireLogin = (value: boolean) => {
  state.requireLogin = value
}

export const getRequireLogin = () => {
  return state.requireLogin;
}

export const getIsLoggedIn = (address: string) => {
  const loggedInAccount = getLoggedInAccount();
  return loggedInAccount === address;
}

export const getLoggedInAccount = () => {
  const loggedInAccount = localStorage.getItem('loggedInAccount');
  return loggedInAccount;
}