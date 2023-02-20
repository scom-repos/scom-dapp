import { Wallet, Utils, Types } from "@ijstech/eth-wallet";

const API_BASE_URL = '/api/account/v0';

function constructLoginTypedMessageData(chainId: number, uuid: string) {
  let domain: Types.IEIP712Domain = {
    name: 'scom',
    version: '0.1.0',
    chainId: chainId,
    verifyingContract: ''
  };
  let customTypes: Types.EIP712TypeMap = {
    Login: [
      {
        'name': 'uuid',
        'type': 'string'
      }
    ]
  };
  let message = {
    uuid: uuid
  };
  let data = Utils.constructTypedMessageData(domain, customTypes, 'Login', message);
  return data;
}

async function requestRandomSessionId(walletAddress: string) {
  let body = JSON.stringify({ walletAddress: walletAddress });
  let response = await fetch(API_BASE_URL + '/requestRandomNumber', {
    body: body,
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });
  let result = await response.json();
  return result.result;
}

async function login() {
  const wallet = Wallet.getClientInstance();
  let randomSessionIdResult = await requestRandomSessionId(wallet.account.address);
  let data = constructLoginTypedMessageData(wallet.chainId, randomSessionIdResult.uuid);
  let signature = await wallet.signTypedDataV4(data);
  let body = JSON.stringify({
    uuid: randomSessionIdResult.uuid,
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

async function logout() {
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

export {
  login,
  logout
}