import { Wallet, Utils, Types } from "@ijstech/eth-wallet";

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
async function checkLoginSession(walletAddress: string) {
  let body = JSON.stringify({ walletAddress: walletAddress });
  let response = await fetch(API_BASE_URL + '/checkLoginSession', {
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
async function requestLoginSession(walletAddress: string) {
  let body = JSON.stringify({ walletAddress: walletAddress });
  let response = await fetch(API_BASE_URL + '/requestLoginSession', {
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
async function apiLogin() {
  const wallet = Wallet.getClientInstance();
  let session = await requestLoginSession(wallet.address);
  if (session.success && session.data?.account)
    return {success: true};

  let msg = constructPersonalSignMessage(wallet.address, session.data.nonce);
  await Wallet.initWeb3();
  let signature = await wallet.signMessage(msg);
  let chainId = await wallet.getChainId();
  let body = JSON.stringify({
    chainId: chainId,
    uuid: session.data.nonce,
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
  let response = await fetch(API_BASE_URL + '/sendAuthCode', {
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
  let response = await fetch(API_BASE_URL + '/verifyAuthCode', {
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
  checkLoginSession,
  apiLogin,
  apiLogout,
  sendAuthCode,
  verifyAuthCode
}