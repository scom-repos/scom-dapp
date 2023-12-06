import { Wallet, Utils, Types } from "@ijstech/eth-wallet";
import { LoginSessionType } from "./constants";

const API_BASE_URL = '/api/account/v0';

function constructPersonalSignMessage(walletAddress: string, uuid: string) {
  let messageChunks = [
      'Welcome to SCOM Marketplace!',
      'Click to sign in and accept the SCOM Terms of Service.',
      'This request will not trigger a blockchain transaction or cost any gas fees.',
      `Wallet address:\n${walletAddress}`,
      `Nonce:\n${uuid}`
  ]
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
};
async function requestLoginSession(sessionType: LoginSessionType) {
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
};
async function apiLogin(sessionNonce: string) {
  const wallet = Wallet.getClientInstance();
  let msg = constructPersonalSignMessage(wallet.address, sessionNonce);
  await Wallet.initWeb3();
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
};
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
async function sendAuthCode(email: string) {
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
async function verifyAuthCode(verifyAuthCodeArgs: any) {
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

export {
  requestLoginSession,
  checkLoginSession,
  apiLogin,
  apiLogout,
  sendAuthCode,
  verifyAuthCode
}