define("aws-sdk", ()=>{});
define("asn1.js", ()=>{});
define("bn.js", ()=>{});
define("ethereumjs-tx", ()=>{});
define("ethereumjs-util", ()=>{});
define("ethereum-cryptography/keccak", ()=>{});
define("web3", (require,exports)=>{
    exports['web3'] = window["Web3"];
});
define("bignumber.js", (require,exports)=>{
    exports['BigNumber'] = window["BigNumber"];
});
define("@ijstech/eth-wallet",(require, exports)=>{
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/contract.ts
var require_contract = __commonJS({
  "src/contract.ts"(exports, module2) {
    var Contract3;
    (function(_Contract) {
      class Contract4 {
        constructor(wallet, address, abi, bytecode) {
          this.wallet = wallet;
          if (abi)
            this.abiHash = this.wallet.registerAbi(abi);
          if (typeof abi == "string")
            this._abi = JSON.parse(abi);
          else
            this._abi = abi;
          this._bytecode = bytecode;
          if (address)
            this._address = address;
        }
        at(address) {
          this._address = address;
          return this;
        }
        set address(value) {
          this._address = value;
        }
        get address() {
          return this._address || "";
        }
        decodeEvents(receipt) {
          let events = this.getAbiEvents();
          let result = [];
          for (let name in receipt.events) {
            let events2 = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
            events2.forEach((e) => {
              let data = e.raw;
              let event = events2[data.topics[0]];
              result.push(Object.assign({ _name: name, _address: this.address }, this.wallet.decodeLog(event.inputs, data.data, data.topics.slice(1))));
            });
          }
          return result;
        }
        parseEvents(receipt, eventName) {
          let eventAbis = this.getAbiEvents();
          let topic0 = this.getAbiTopics([eventName])[0];
          let result = [];
          if (receipt.events) {
            for (let name in receipt.events) {
              let events = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
              events.forEach((event) => {
                if (topic0 == event.raw.topics[0] && (this.address && this.address == event.address)) {
                  result.push(this.wallet.decode(eventAbis[topic0], event, event.raw));
                }
              });
            }
          } else if (receipt.logs) {
            for (let i = 0; i < receipt.logs.length; i++) {
              let log = receipt.logs[i];
              if (topic0 == log.topics[0] && (this.address && this.address == log.address)) {
                result.push(this.wallet.decode(eventAbis[topic0], log));
              }
            }
          }
          return result;
        }
        get events() {
          let result = [];
          for (let i = 0; i < this._abi.length; i++) {
            if (this._abi[i].type == "event")
              result.push(this._abi[i]);
          }
          return result;
        }
        getAbiEvents() {
          if (!this._events) {
            this._events = {};
            let events = this._abi.filter((e) => e.type == "event");
            for (let i = 0; i < events.length; i++) {
              let topic = this.wallet.utils.sha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
              this._events[topic] = events[i];
            }
          }
          return this._events;
        }
        getAbiTopics(eventNames) {
          if (!eventNames || eventNames.length == 0)
            eventNames = null;
          let result = [];
          let events = this.getAbiEvents();
          for (let topic in events) {
            if (!eventNames || eventNames.includes(events[topic].name)) {
              result.push(topic);
            }
          }
          if (result.length == 0 && eventNames && eventNames.length > 0)
            return ["NULL"];
          return [result];
        }
        registerEvents(handler) {
          if (this._address)
            this.wallet.registerEvent(this.getAbiEvents(), this._address, handler);
        }
        scanEvents(fromBlock, toBlock, eventNames) {
          let topics = this.getAbiTopics(eventNames);
          let events = this.getAbiEvents();
          return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        }
        async batchCall(batchObj, key, methodName, params, options) {
        }
        async call(methodName, params, options) {
          return await this.wallet._call(this.abiHash, this._address, methodName, params, options);
        }
        async _send(methodName, params, options) {
          params = params || [];
          if (!methodName)
            params.unshift(this._bytecode);
          return await this.wallet._send(this.abiHash, this._address, methodName, params, options);
        }
        async __deploy(params, options) {
          let receipt = await this._send("", params, options);
          this.address = receipt.contractAddress;
          return this.address;
        }
        send(methodName, params, options) {
          let receipt = this._send(methodName, params, options);
          return receipt;
        }
        _deploy(...params) {
          return this.__deploy(params);
        }
        methods(methodName, ...params) {
          let method = this._abi.find((e) => e.name == methodName);
          if (method.stateMutability == "view" || method.stateMutability == "pure") {
            return this.call(methodName, params);
          } else if (method.stateMutability == "payable") {
            let value = params.pop();
            return this.call(methodName, params, { value });
          } else {
            return this.send(methodName, params);
          }
        }
      }
      _Contract.Contract = Contract4;
    })(Contract3 || (Contract3 = {}));
    module2.exports = Contract3;
  }
});

// src/merkleTree.ts
var import_bignumber, MerkleTree;
var init_merkleTree = __esm({
  "src/merkleTree.ts"() {
    import_bignumber = __toModule(require("bignumber.js"));
    init_utils();
    MerkleTree = class {
      constructor(wallet, options) {
        this.tree = [];
        this.leavesData = {};
        this.leavesKeyHashMap = {};
        this.leavesHashDataMap = {};
        this.nodeInfoMap = {};
        this.abi = options.abi;
        const hashFunc = getSha3HashBufferFunc(wallet, options.abi);
        let abiKeyName = options.abiKeyName || options.abi[0].name;
        this.leavesData = options.leavesData;
        let leaves = [];
        for (let leafData of options.leavesData) {
          let key;
          if (options.getCustomKey) {
            key = options.getCustomKey(leafData);
          } else {
            key = leafData[abiKeyName];
          }
          let dataHash = hashFunc(leafData);
          this.leavesKeyHashMap[key] = this.leavesKeyHashMap[key] || [];
          this.leavesKeyHashMap[key].push(dataHash);
          this.leavesHashDataMap[dataHash] = leafData;
          leaves.push(dataHash);
        }
        this.tree.push(leaves);
        while (this.tree[this.tree.length - 1].length > 1) {
          let layer = this.tree.length - 1;
          let children = this.tree[layer];
          let parent = [];
          this.nodeInfoMap[layer] = {};
          for (let i = 0; i < children.length - 1; i += 2) {
            let parentHash;
            let firstChild = children[i];
            let secondChild = children[i + 1];
            if (new import_bignumber.BigNumber(firstChild).lt(secondChild)) {
              parentHash = wallet.soliditySha3("0x" + firstChild.replace("0x", "") + secondChild.replace("0x", ""));
            } else {
              parentHash = wallet.soliditySha3("0x" + secondChild.replace("0x", "") + firstChild.replace("0x", ""));
            }
            parent.push(parentHash);
            this.nodeInfoMap[layer][firstChild] = {
              parent: parentHash,
              sibling: secondChild
            };
            this.nodeInfoMap[layer][secondChild] = {
              parent: parentHash,
              sibling: firstChild
            };
          }
          if (children.length % 2 == 1) {
            let child = children[children.length - 1];
            let parentHash = "0x" + child.replace("0x", "");
            parent.push(parentHash);
            this.nodeInfoMap[layer][child] = {
              parent: parentHash
            };
          }
          this.tree.push(parent);
        }
      }
      toString() {
        let arr = [];
        for (let i = this.tree.length - 1; i >= 0; i--) {
          arr.push(this.tree[i].join(","));
        }
        return arr.join(",");
      }
      getHexRoot() {
        return this.tree[this.tree.length - 1][0];
      }
      getHexProofsByKey(key) {
        let proofs = [];
        let leaves = this.leavesKeyHashMap[key] || [];
        if (leaves.length == 0)
          return [];
        for (let leaf of leaves) {
          proofs.push(this.getHexProof(leaf));
        }
        return proofs;
      }
      getHexProof(leaf) {
        let proof = [];
        if (this.tree.length == 1)
          return proof;
        let leafInfo = this.nodeInfoMap[0][leaf];
        if (leafInfo.sibling) {
          proof.push(leafInfo.sibling);
        }
        let parentHash = leafInfo.parent;
        for (let i = 1; i < this.tree.length - 1; i++) {
          if (parentHash == this.getHexRoot())
            break;
          let leafInfo2 = this.nodeInfoMap[i][parentHash];
          if (leafInfo2.sibling) {
            proof.push(leafInfo2.sibling);
          }
          parentHash = leafInfo2.parent;
        }
        return proof;
      }
      getABI() {
        return this.abi;
      }
      getLeavesByKey(key) {
        return this.leavesKeyHashMap[key] || [];
      }
      getLeavesDataByKey(key) {
        let leaves = this.leavesKeyHashMap[key] || [];
        if (leaves.length == 0)
          return [];
        let leavesData = [];
        for (let leaf of leaves) {
          leavesData.push(this.getLeafData(leaf));
        }
        return leavesData;
      }
      getLeafData(leaf) {
        return this.leavesHashDataMap[leaf];
      }
    };
  }
});

// src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  EIP712DomainAbi: () => EIP712DomainAbi,
  TYPED_MESSAGE_SCHEMA: () => TYPED_MESSAGE_SCHEMA
});
var EIP712DomainAbi, TYPED_MESSAGE_SCHEMA;
var init_constants = __esm({
  "src/constants.ts"() {
    EIP712DomainAbi = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ];
    TYPED_MESSAGE_SCHEMA = {
      type: "object",
      properties: {
        types: {
          type: "object",
          additionalProperties: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" }
              },
              required: ["name", "type"]
            }
          }
        },
        primaryType: { type: "string" },
        domain: { type: "object" },
        message: { type: "object" }
      },
      required: ["types", "primaryType", "domain", "message"]
    };
  }
});

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  addressToBytes32: () => addressToBytes32,
  addressToBytes32Right: () => addressToBytes32Right,
  bytes32ToAddress: () => bytes32ToAddress,
  bytes32ToString: () => bytes32ToString,
  constructTypedMessageData: () => constructTypedMessageData,
  fromDecimals: () => fromDecimals,
  generateMerkleTree: () => generateMerkleTree,
  getMerkleLeavesData: () => getMerkleLeavesData,
  getMerkleProofs: () => getMerkleProofs,
  getSha3HashBufferFunc: () => getSha3HashBufferFunc,
  nullAddress: () => nullAddress,
  numberToBytes32: () => numberToBytes32,
  padLeft: () => padLeft,
  padRight: () => padRight,
  sleep: () => sleep,
  stringToBytes: () => stringToBytes,
  stringToBytes32: () => stringToBytes32,
  toDecimals: () => toDecimals,
  toNumber: () => toNumber,
  toString: () => toString
});
function Web3Lib() {
  if (typeof window !== "undefined" && window["Web3"])
    return window["Web3"];
  else
    return require("web3");
}
function sleep(millisecond) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(null);
    }, millisecond);
  });
}
function numberToBytes32(value, prefix) {
  let v = new import_bignumber2.BigNumber(value).toString(16);
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function padLeft(string, chars, sign) {
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
}
function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign ? sign : "0");
}
function stringToBytes32(value) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(stringToBytes32(value[i]));
    }
    return result;
  } else {
    if (value.length == 66 && value.startsWith("0x"))
      return value;
    return Web3.utils.padRight(Web3.utils.asciiToHex(value), 64);
  }
}
function stringToBytes(value, nByte) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(stringToBytes(value[i]));
    }
    return result;
  } else {
    if (nByte) {
      if (new RegExp(`^0x[0-9a-fA-F]{${2 * nByte}}$`).test(value))
        return value;
      else if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value)) {
        if (value.length >= nByte * 2 + 2)
          return value;
        else
          return "0x" + value.substring(2) + "00".repeat(nByte - (value.length - 2) / 2);
      } else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) {
        if (value.length >= nByte * 2)
          return value;
        else
          return "0x" + value + "00".repeat(nByte - value.length / 2);
      } else
        return Web3.utils.padRight(Web3.utils.asciiToHex(value), nByte * 2);
    } else {
      if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value))
        return value;
      else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value))
        return "0x" + value;
      else
        return Web3.utils.asciiToHex(value);
    }
  }
}
function addressToBytes32(value, prefix) {
  let v = value;
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function bytes32ToAddress(value) {
  return "0x" + value.replace("0x000000000000000000000000", "");
}
function bytes32ToString(value) {
  return Web3.utils.hexToUtf8(value);
}
function addressToBytes32Right(value, prefix) {
  let v = value;
  v = v.replace("0x", "");
  v = padRight(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function toNumber(value) {
  if (typeof value == "number")
    return value;
  else if (typeof value == "string")
    return new import_bignumber2.BigNumber(value).toNumber();
  else
    return value.toNumber();
}
function toDecimals(value, decimals) {
  decimals = decimals || 18;
  return new import_bignumber2.BigNumber(value).shiftedBy(decimals);
}
function fromDecimals(value, decimals) {
  decimals = decimals || 18;
  return new import_bignumber2.BigNumber(value).shiftedBy(-decimals);
}
function toString(value) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(toString(value[i]));
    }
    return result;
  } else if (typeof value === "number")
    return value.toString(10);
  else if (import_bignumber2.BigNumber.isBigNumber(value))
    return value.toFixed();
  else
    return value;
}
function getSha3HashBufferFunc(wallet, abi) {
  return (leafData) => {
    let encodePackedInput = abi.map((abiItem) => {
      return {
        t: abiItem.type,
        v: leafData[abiItem.name]
      };
    });
    let hex = wallet.soliditySha3.apply(wallet, encodePackedInput);
    return hex;
  };
}
function generateMerkleTree(wallet, options) {
  const merkleTree = new MerkleTree(wallet, options);
  return merkleTree;
}
function getMerkleProofs(wallet, tree, options) {
  let proofs = [];
  if (options.key) {
    proofs = tree.getHexProofsByKey(options.key);
  } else if (options.leafData) {
    let abi = tree.getABI();
    const hashFunc = getSha3HashBufferFunc(wallet, abi);
    let leaf = hashFunc(options.leafData);
    proofs.push(tree.getHexProof(leaf));
  }
  return proofs;
}
function getMerkleLeavesData(tree, options) {
  let data;
  if (options.key) {
    data = tree.getLeavesDataByKey(options.key);
  } else if (options.hash) {
    data.push(tree.getLeafData(options.hash));
  }
  return data;
}
function constructTypedMessageData(domain, customTypes, primaryType, message) {
  let data = {
    types: __spreadValues({
      EIP712Domain: EIP712DomainAbi
    }, customTypes),
    primaryType,
    domain,
    message
  };
  return data;
}
var import_bignumber2, Web3, nullAddress;
var init_utils = __esm({
  "src/utils.ts"() {
    import_bignumber2 = __toModule(require("bignumber.js"));
    init_merkleTree();
    init_constants();
    Web3 = Web3Lib();
    nullAddress = "0x0000000000000000000000000000000000000000";
  }
});

// src/contracts/bin/erc20.json
var require_erc20 = __commonJS({
  "src/contracts/bin/erc20.json"(exports, module2) {
    module2.exports = {
      abi: [{ inputs: [{ internalType: "string", name: "name", type: "string" }, { internalType: "string", name: "symbol", type: "string" }, { internalType: "address", name: "_minter", type: "address" }, { internalType: "uint256", name: "totalSupply", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "owner", type: "address" }, { indexed: true, internalType: "address", name: "spender", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256" }], name: "Approval", type: "event" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "from", type: "address" }, { indexed: true, internalType: "address", name: "to", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256" }], name: "Transfer", type: "event" }, { inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }], name: "allowance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "approve", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [], name: "cap", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [], name: "decimals", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "subtractedValue", type: "uint256" }], name: "decreaseAllowance", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "addedValue", type: "uint256" }], name: "increaseAllowance", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "account", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "mint", outputs: [], stateMutability: "nonpayable", type: "function" }, { inputs: [], name: "minter", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" }, { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transfer", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "sender", type: "address" }, { internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transferFrom", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }],
      bytecode: "60a06040523480156200001157600080fd5b50604051620012a0380380620012a0833981810160405260808110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200010a57600080fd5b9083019060208201858111156200012057600080fd5b82516401000000008111828201881017156200013b57600080fd5b82525081516020918201929091019080838360005b838110156200016a57818101518382015260200162000150565b50505050905090810190601f168015620001985780820380516001836020036101000a031916815260200191505b506040908152602082810151929091015186519294509250829186918691620001c891600391908501906200025e565b508051620001de9060049060208401906200025e565b50506005805460ff19166012179055508062000241576040805162461bcd60e51b815260206004820152601560248201527f45524332304361707065643a2063617020697320300000000000000000000000604482015290519081900360640190fd5b6006555060601b6001600160601b03191660805250620003039050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620002a157805160ff1916838001178555620002d1565b82800160010185558215620002d1579182015b82811115620002d1578251825591602001919060010190620002b4565b50620002df929150620002e3565b5090565b6200030091905b80821115620002df5760008155600101620002ea565b90565b60805160601c610f7a620003266000398061047f52806105f35250610f7a6000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063395093511161008c57806395d89b411161006657806395d89b4114610314578063a457c2d71461031c578063a9059cbb14610355578063dd62ed3e1461038e576100ea565b8063395093511461026d57806340c10f19146102a657806370a08231146102e1576100ea565b806318160ddd116100c857806318160ddd146101ea57806323b872dd14610204578063313ce56714610247578063355274ea14610265576100ea565b806306fdde03146100ef578063075461721461016c578063095ea7b31461019d575b600080fd5b6100f76103c9565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610131578181015183820152602001610119565b50505050905090810190601f16801561015e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017461047d565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101d6600480360360408110156101b357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356104a1565b604080519115158252519081900360200190f35b6101f26104be565b60408051918252519081900360200190f35b6101d66004803603606081101561021a57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135811691602081013590911690604001356104c4565b61024f61056b565b6040805160ff9092168252519081900360200190f35b6101f2610574565b6101d66004803603604081101561028357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813516906020013561057a565b6102df600480360360408110156102bc57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356105db565b005b6101f2600480360360208110156102f757600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661068d565b6100f76106b5565b6101d66004803603604081101561033257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610734565b6101d66004803603604081101561036b57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356107af565b6101f2600480360360408110156103a457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160200135166107c3565b60038054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104735780601f1061044857610100808354040283529160200191610473565b820191906000526020600020905b81548152906001019060200180831161045657829003601f168201915b5050505050905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006104b56104ae6107fb565b84846107ff565b50600192915050565b60025490565b60006104d1848484610946565b610561846104dd6107fb565b61055c85604051806060016040528060288152602001610eaf6028913973ffffffffffffffffffffffffffffffffffffffff8a166000908152600160205260408120906105286107fb565b73ffffffffffffffffffffffffffffffffffffffff168152602081019190915260400160002054919063ffffffff610b2216565b6107ff565b5060019392505050565b60055460ff1690565b60065490565b60006104b56105876107fb565b8461055c85600160006105986107fb565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff610bd316565b3373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000161461067f57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f4e6f742066726f6d206d696e7465720000000000000000000000000000000000604482015290519081900360640190fd5b6106898282610c4e565b5050565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b60048054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104735780601f1061044857610100808354040283529160200191610473565b60006104b56107416107fb565b8461055c85604051806060016040528060258152602001610f20602591396001600061076b6107fb565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff610b2216565b60006104b56107bc6107fb565b8484610946565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b3390565b73ffffffffffffffffffffffffffffffffffffffff831661086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180610efc6024913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff82166108d7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180610e676022913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff83166109b2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526025815260200180610ed76025913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610a1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180610e446023913960400191505060405180910390fd5b610a29838383610d8b565b610a7981604051806060016040528060268152602001610e896026913973ffffffffffffffffffffffffffffffffffffffff8616600090815260208190526040902054919063ffffffff610b2216565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082209390935590841681522054610abb908263ffffffff610bd316565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610bcb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610b90578181015183820152602001610b78565b50505050905090810190601f168015610bbd5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b600082820183811015610c4757604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b73ffffffffffffffffffffffffffffffffffffffff8216610cd057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b610cdc60008383610d8b565b600254610cef908263ffffffff610bd316565b60025573ffffffffffffffffffffffffffffffffffffffff8216600090815260208190526040902054610d28908263ffffffff610bd316565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b610d96838383610e3e565b73ffffffffffffffffffffffffffffffffffffffff8316610e3e57610db9610574565b610dd182610dc56104be565b9063ffffffff610bd316565b1115610e3e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f45524332304361707065643a2063617020657863656564656400000000000000604482015290519081900360640190fd5b50505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa26469706673582212207fc226d6e4710807cc45df55579a0cf7761d5ad01ffb12d78b630a3ab9858ef364736f6c634300060b0033"
    };
  }
});

// src/contracts/erc20.ts
var import_contract, import_bignumber3, Abi, Bytecode, Erc20;
var init_erc20 = __esm({
  "src/contracts/erc20.ts"() {
    import_contract = __toModule(require_contract());
    import_bignumber3 = __toModule(require("bignumber.js"));
    init_utils();
    Abi = require_erc20().abi;
    Bytecode = require_erc20().bytecode;
    Erc20 = class extends import_contract.Contract {
      constructor(wallet, address, decimals) {
        super(wallet, address, Abi, Bytecode);
        this._decimals = decimals;
      }
      async deploy(params) {
        return this.__deploy([params.name, params.symbol, params.minter || this.wallet.address, this.wallet.utils.toWei(params.cap ? params.cap.toString() : "1000000000")]);
      }
      parseApprovalEvent(receipt) {
        return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
      }
      decodeApprovalEvent(event) {
        let result = event.data;
        return {
          owner: result.owner,
          spender: result.spender,
          value: new import_bignumber3.BigNumber(result.value),
          _event: event
        };
      }
      parseTransferEvent(receipt) {
        return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
      }
      decodeTransferEvent(event) {
        let result = event.data;
        return {
          from: result.from,
          to: result.to,
          value: new import_bignumber3.BigNumber(result.value),
          _event: event
        };
      }
      async allowance(params) {
        return fromDecimals(await this.methods("allowance", params.owner, params.spender), await this.decimals);
      }
      approve(params) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(this.methods("approve", params.spender, await toDecimals(params.amount, await this.decimals)));
          } catch (err) {
            reject(err);
          }
        });
      }
      get balance() {
        return this.balanceOf(this.wallet.address);
      }
      async balanceOf(address) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await fromDecimals(await this.methods("balanceOf", address), await this.decimals));
          } catch (err) {
            reject(err);
          }
        });
      }
      get cap() {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await fromDecimals(await this.methods("cap"), await this.decimals));
          } catch (err) {
            reject(err);
          }
        });
      }
      get decimals() {
        return new Promise(async (resolve, reject) => {
          try {
            if (!this._decimals)
              this._decimals = new import_bignumber3.BigNumber(await this.methods("decimals")).toNumber();
            resolve(this._decimals);
          } catch (err) {
            reject(err);
          }
        });
      }
      mint(params) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await this.methods("mint", params.address, await toDecimals(params.amount, await this.decimals)));
          } catch (err) {
            reject(err);
          }
        });
      }
      minter() {
        return this.methods("minter");
      }
      get name() {
        return this.methods("name");
      }
      get symbol() {
        return this.methods("symbol");
      }
      get totalSupply() {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await fromDecimals(await this.methods("totalSupply"), await this.decimals));
          } catch (err) {
            reject(err);
          }
        });
      }
      async transfer(params) {
        return this.methods("transfer", params.address, await toDecimals(params.amount, await this.decimals));
      }
    };
  }
});

// src/kms.ts
var require_kms = __commonJS({
  "src/kms.ts"(exports, module2) {
    var AwsSDK = __toModule(require("aws-sdk"));
    var asn1 = __toModule(require("asn1.js"));
    var import_bn2 = __toModule(require("bn.js"));
    var ethutil = __toModule(require("ethereumjs-util"));
    var import_ethereumjs_tx = __toModule(require("ethereumjs-tx"));
    var KMS;
    (function(_KMS) {
      const EcdsaSigAsnParse = asn1 && asn1.define ? asn1.define("EcdsaSig", function() {
        this.seq().obj(this.key("r").int(), this.key("s").int());
      }) : void 0;
      const EcdsaPubKey = asn1 && asn1.define ? asn1.define("EcdsaPubKey", function() {
        this.seq().obj(this.key("algo").seq().obj(this.key("a").objid(), this.key("b").objid()), this.key("pubKey").bitstr());
      }) : void 0;
      function recoverPubKeyFromSig(msg, r, s, v) {
        let rBuffer = r.toBuffer();
        let sBuffer = s.toBuffer();
        let pubKey = ethutil.ecrecover(msg, v, rBuffer, sBuffer);
        let addrBuf = ethutil.pubToAddress(pubKey);
        let recoveredEthAddr = ethutil.bufferToHex(addrBuf);
        return recoveredEthAddr;
      }
      class KMS3 {
        constructor(options) {
          this._options = options;
          this._sdk = new AwsSDK.KMS(options);
        }
        getEthereumAddress(publicKey) {
          let res = EcdsaPubKey.decode(publicKey, "der");
          let pubKeyBuffer = res.pubKey.data;
          pubKeyBuffer = pubKeyBuffer.slice(1, pubKeyBuffer.length);
          let buf = ethutil.keccak256(pubKeyBuffer);
          return "0x" + buf.slice(-20).toString("hex");
        }
        async sign(msgHash) {
          const params = {
            KeyId: this._options.keyId,
            Message: msgHash,
            SigningAlgorithm: "ECDSA_SHA_256",
            MessageType: "DIGEST"
          };
          return await this._sdk.sign(params).promise();
        }
        async signMessage(chainId, message) {
          let hash = ethutil.hashPersonalMessage(ethutil.toBuffer(message));
          let sig = await this.findEthereumSig(hash);
          let address = await this.getAddress();
          let recoveredPubAddr = this.findRightKey(hash, sig.r, sig.s, address);
          let r = sig.r.toBuffer();
          let s = sig.s.toBuffer();
          let v = new import_bn2.default(recoveredPubAddr.v + (chainId > 1 ? 8 + chainId * 2 : 0)).toBuffer();
          return "0x" + Buffer.concat([r, s, v]).toString("hex");
        }
        async findEthereumSig(plaintext) {
          let signature = await this.sign(plaintext);
          if (signature.Signature == void 0) {
            throw new Error("Signature is undefined.");
          }
          let decoded = EcdsaSigAsnParse.decode(signature.Signature, "der");
          let r = decoded.r;
          let s = decoded.s;
          let secp256k1N = new import_bn2.default("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16);
          let secp256k1halfN = secp256k1N.div(new import_bn2.default(2));
          if (s.gt(secp256k1halfN)) {
            s = secp256k1N.sub(s);
          }
          return { r, s };
        }
        findRightKey(msg, r, s, expectedEthAddr) {
          let v = 27;
          let pubKey = recoverPubKeyFromSig(msg, r, s, v);
          if (pubKey != expectedEthAddr) {
            v = 28;
            pubKey = recoverPubKeyFromSig(msg, r, s, v);
          }
          return { pubKey, v };
        }
        async getPublicKey() {
          return this._sdk.getPublicKey({
            KeyId: this._options.keyId
          }).promise();
        }
        async getAddress() {
          if (!this._address) {
            let pubKey = await this.getPublicKey();
            this._address = this.getEthereumAddress(pubKey.PublicKey);
          }
          return this._address;
        }
        async signTransaction(chainId, txData) {
          const tx = new import_ethereumjs_tx.Transaction(txData, {
            chain: chainId
          });
          let txHash = tx.hash(false);
          let sig = await this.findEthereumSig(txHash);
          let address = await this.getAddress();
          let recoveredPubAddr = this.findRightKey(txHash, sig.r, sig.s, address);
          tx.r = sig.r.toBuffer();
          tx.s = sig.s.toBuffer();
          tx.v = new import_bn2.default(recoveredPubAddr.v + (chainId > 1 ? 8 + chainId * 2 : 0)).toBuffer();
          const serializedTx = tx.serialize().toString("hex");
          return "0x" + serializedTx;
        }
      }
      _KMS.KMS = KMS3;
    })(KMS || (KMS = {}));
    module2.exports = KMS;
  }
});

// src/types.ts
var types_exports = {};
__export(types_exports, {
  SignTypedDataVersion: () => SignTypedDataVersion
});
var SignTypedDataVersion;
var init_types = __esm({
  "src/types.ts"() {
    (function(SignTypedDataVersion2) {
      SignTypedDataVersion2["V1"] = "V1";
      SignTypedDataVersion2["V3"] = "V3";
      SignTypedDataVersion2["V4"] = "V4";
    })(SignTypedDataVersion || (SignTypedDataVersion = {}));
  }
});

// src/signTypedData.ts
function encodeType(primaryType, types) {
  let result = "";
  const unsortedDeps = findTypeDependencies(primaryType, types);
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    const children = types[type];
    if (!children) {
      throw new Error(`No type definition specified: ${type}`);
    }
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function isArray(type) {
  return type.lastIndexOf("]") === type.length - 1;
}
function isHexString(value, length) {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/))
    return false;
  if (typeof length !== "undefined" && length > 0 && value.length !== 2 + 2 * length)
    return false;
  return true;
}
function parseTypeArray(type) {
  const tmp = type.match(/(.*)\[(.*?)\]$/u);
  if (tmp) {
    return tmp[2] === "" ? "dynamic" : parseInt(tmp[2], 10);
  }
  return null;
}
function elementaryName(name) {
  if (name.startsWith("int[")) {
    return `int256${name.slice(3)}`;
  } else if (name === "int") {
    return "int256";
  } else if (name.startsWith("uint[")) {
    return `uint256${name.slice(4)}`;
  } else if (name === "uint") {
    return "uint256";
  } else if (name.startsWith("fixed[")) {
    return `fixed128x128${name.slice(5)}`;
  } else if (name === "fixed") {
    return "fixed128x128";
  } else if (name.startsWith("ufixed[")) {
    return `ufixed128x128${name.slice(6)}`;
  } else if (name === "ufixed") {
    return "ufixed128x128";
  }
  return name;
}
function isDynamic(type) {
  return type === "string" || type === "bytes" || parseTypeArray(type) === "dynamic";
}
function isHexPrefixed(str) {
  if (typeof str !== "string") {
    throw new Error(`[isHexPrefixed] input must be type 'string', received type ${typeof str}`);
  }
  return str[0] === "0" && str[1] === "x";
}
function parseNumber(arg) {
  const type = typeof arg;
  if (type === "string") {
    if (isHexPrefixed(arg)) {
      return new import_bn.default(stripHexPrefix(arg), 16);
    }
    return new import_bn.default(arg, 10);
  } else if (type === "number") {
    return new import_bn.default(arg);
  } else if (arg.toArray) {
    return arg;
  }
  throw new Error("Argument is not a number");
}
function parseTypeN(type) {
  return parseInt(/^\D+(\d+)$/u.exec(type)[1], 10);
}
function parseTypeNxM(type) {
  const tmp = /^\D+(\d+)x(\d+)$/u.exec(type);
  return [parseInt(tmp[1], 10), parseInt(tmp[2], 10)];
}
function padToEven(value) {
  let a = value;
  if (typeof a !== "string") {
    throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
  }
  if (a.length % 2)
    a = `0${a}`;
  return a;
}
function normalize(input) {
  if (!input) {
    return void 0;
  }
  if (typeof input === "number") {
    if (input < 0) {
      return "0x";
    }
    const buffer = toBuffer(input);
    input = bufferToHex(buffer);
  }
  if (typeof input !== "string") {
    let msg = "eth-sig-util.normalize() requires hex string or integer input.";
    msg += ` received ${typeof input}: ${input}`;
    throw new Error(msg);
  }
  return addHexPrefix(input.toLowerCase());
}
function encodeSingle(type, arg) {
  let size, num, ret, i;
  if (type === "address") {
    return encodeSingle("uint160", parseNumber(arg));
  } else if (type === "bool") {
    return encodeSingle("uint8", arg ? 1 : 0);
  } else if (type === "string") {
    return encodeSingle("bytes", Buffer.from(arg, "utf8"));
  } else if (isArray(type)) {
    if (typeof arg.length === "undefined") {
      throw new Error("Not an array?");
    }
    size = parseTypeArray(type);
    if (size !== "dynamic" && size !== 0 && arg.length > size) {
      throw new Error(`Elements exceed array size: ${size}`);
    }
    ret = [];
    type = type.slice(0, type.lastIndexOf("["));
    if (typeof arg === "string") {
      arg = JSON.parse(arg);
    }
    for (i in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, i)) {
        ret.push(encodeSingle(type, arg[i]));
      }
    }
    if (size === "dynamic") {
      const length = encodeSingle("uint256", arg.length);
      ret.unshift(length);
    }
    return Buffer.concat(ret);
  } else if (type === "bytes") {
    arg = Buffer.from(arg);
    ret = Buffer.concat([encodeSingle("uint256", arg.length), arg]);
    if (arg.length % 32 !== 0) {
      ret = Buffer.concat([ret, zeros(32 - arg.length % 32)]);
    }
    return ret;
  } else if (type.startsWith("bytes")) {
    size = parseTypeN(type);
    if (size < 1 || size > 32) {
      throw new Error(`Invalid bytes<N> width: ${size}`);
    }
    if (typeof arg === "number") {
      arg = normalize(arg);
    }
    return setLengthRight(toBuffer(arg), 32);
  } else if (type.startsWith("uint")) {
    size = parseTypeN(type);
    if (size % 8 || size < 8 || size > 256) {
      throw new Error(`Invalid uint<N> width: ${size}`);
    }
    num = parseNumber(arg);
    if (num.bitLength() > size) {
      throw new Error(`Supplied uint exceeds width: ${size} vs ${num.bitLength()}`);
    }
    if (num < 0) {
      throw new Error("Supplied uint is negative");
    }
    return num.toArrayLike(Buffer, "be", 32);
  } else if (type.startsWith("int")) {
    size = parseTypeN(type);
    if (size % 8 || size < 8 || size > 256) {
      throw new Error(`Invalid int<N> width: ${size}`);
    }
    num = parseNumber(arg);
    if (num.bitLength() > size) {
      throw new Error(`Supplied int exceeds width: ${size} vs ${num.bitLength()}`);
    }
    return num.toTwos(256).toArrayLike(Buffer, "be", 32);
  } else if (type.startsWith("ufixed")) {
    size = parseTypeNxM(type);
    num = parseNumber(arg);
    if (num < 0) {
      throw new Error("Supplied ufixed is negative");
    }
    return encodeSingle("uint256", num.mul(new import_bn.default(2).pow(new import_bn.default(size[1]))));
  } else if (type.startsWith("fixed")) {
    size = parseTypeNxM(type);
    return encodeSingle("int256", parseNumber(arg).mul(new import_bn.default(2).pow(new import_bn.default(size[1]))));
  }
  throw new Error(`Unsupported or invalid type: ${type}`);
}
function rawEncode(types, values) {
  const output = [];
  const data = [];
  let headLength = 0;
  types.forEach(function(type) {
    if (isArray(type)) {
      const size = parseTypeArray(type);
      if (size !== "dynamic") {
        headLength += 32 * size;
      } else {
        headLength += 32;
      }
    } else {
      headLength += 32;
    }
  });
  for (let i = 0; i < types.length; i++) {
    const type = elementaryName(types[i]);
    const value = values[i];
    const cur = encodeSingle(type, value);
    if (isDynamic(type)) {
      output.push(encodeSingle("uint256", headLength));
      data.push(cur);
      headLength += cur.length;
    } else {
      output.push(cur);
    }
  }
  return Buffer.concat(output.concat(data));
}
function numberToBuffer(num) {
  const hexVal = num.toString(16);
  const prepend = hexVal.length % 2 ? "0" : "";
  return Buffer.from(prepend + hexVal, "hex");
}
function arrToBufArr(arr) {
  if (!Array.isArray(arr)) {
    return Buffer.from(arr);
  }
  return arr.map((a) => arrToBufArr(a));
}
function encodeField(types, name, type, value, version) {
  if (types[type] !== void 0) {
    return [
      "bytes32",
      version === SignTypedDataVersion.V4 && value == null ? "0x0000000000000000000000000000000000000000000000000000000000000000" : arrToBufArr((0, import_keccak.keccak256)(encodeData(type, value, types, version)))
    ];
  }
  if (value === void 0) {
    throw new Error(`missing value for field ${name} of type ${type}`);
  }
  if (type === "bytes") {
    if (typeof value === "number") {
      value = numberToBuffer(value);
    } else if (isHexString(value)) {
      value = numberToBuffer(parseInt(value, 16));
    } else {
      value = Buffer.from(value, "utf8");
    }
    return ["bytes32", arrToBufArr((0, import_keccak.keccak256)(value))];
  }
  if (type === "string") {
    if (typeof value === "number") {
      value = numberToBuffer(value);
    } else {
      value = Buffer.from(value != null ? value : "", "utf8");
    }
    return ["bytes32", arrToBufArr((0, import_keccak.keccak256)(value))];
  }
  if (type.lastIndexOf("]") === type.length - 1) {
    if (version === SignTypedDataVersion.V3) {
      throw new Error("Arrays are unimplemented in encodeData; use V4 extension");
    }
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField(types, name, parsedType, item, version));
    return [
      "bytes32",
      arrToBufArr((0, import_keccak.keccak256)(rawEncode(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v))))
    ];
  }
  return [type, value];
}
function findTypeDependencies(primaryType, types, results = new Set()) {
  [primaryType] = primaryType.match(/^\w*/u);
  if (results.has(primaryType) || types[primaryType] === void 0) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies(field.type, types, results);
  }
  return results;
}
function hashType(primaryType, types) {
  const encodedHashType = Buffer.from(encodeType(primaryType, types), "utf-8");
  return arrToBufArr((0, import_keccak.keccak256)(encodedHashType));
}
function hashStruct(primaryType, data, types, version) {
  let encodedData = encodeData(primaryType, data, types, version);
  return arrToBufArr((0, import_keccak.keccak256)(encodedData));
}
function encodeData(primaryType, data, types, version) {
  const encodedTypes = ["bytes32"];
  const encodedValues = [hashType(primaryType, types)];
  for (const field of types[primaryType]) {
    if (version === SignTypedDataVersion.V3 && data[field.name] === void 0) {
      continue;
    }
    const [type, value] = encodeField(types, field.name, field.type, data[field.name], version);
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return rawEncode(encodedTypes, encodedValues);
}
function sanitizeData(data) {
  const sanitizedData = {};
  for (const key in TYPED_MESSAGE_SCHEMA.properties) {
    if (data[key]) {
      sanitizedData[key] = data[key];
    }
  }
  if ("types" in sanitizedData) {
    sanitizedData.types = __spreadValues({ EIP712Domain: [] }, sanitizedData.types);
  }
  return sanitizedData;
}
function eip712Hash(typedData, version) {
  const sanitizedData = sanitizeData(typedData);
  const parts = [Buffer.from("1901", "hex")];
  parts.push(hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types, version));
  if (sanitizedData.primaryType !== "EIP712Domain") {
    parts.push(hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, version));
  }
  return arrToBufArr((0, import_keccak.keccak256)(Buffer.concat(parts)));
}
function padWithZeroes(hexString, targetLength) {
  if (hexString !== "" && !/^[a-f0-9]+$/iu.test(hexString)) {
    throw new Error(`Expected an unprefixed hex string. Received: ${hexString}`);
  }
  if (targetLength < 0) {
    throw new Error(`Expected a non-negative integer target length. Received: ${targetLength}`);
  }
  return String.prototype.padStart.call(hexString, targetLength, "0");
}
function concatSig(v, r, s) {
  const rSig = (0, import_ethereumjs_util.fromSigned)(r);
  const sSig = (0, import_ethereumjs_util.fromSigned)(s);
  const vSig = (0, import_ethereumjs_util.bufferToInt)(v);
  const rStr = padWithZeroes((0, import_ethereumjs_util.toUnsigned)(rSig).toString("hex"), 64);
  const sStr = padWithZeroes((0, import_ethereumjs_util.toUnsigned)(sSig).toString("hex"), 64);
  const vStr = stripHexPrefix(intToHex(vSig));
  return addHexPrefix(rStr.concat(sStr, vStr));
}
function recoverPublicKey(messageHash, signature) {
  const sigParams = (0, import_ethereumjs_util.fromRpcSig)(signature);
  return (0, import_ethereumjs_util.ecrecover)(messageHash, sigParams.v, sigParams.r, sigParams.s);
}
function signTypedDataWithPrivateKey({
  privateKey,
  data,
  version
}) {
  const bufferPrivateKey = Buffer.from(privateKey.replace("0x", ""), "hex");
  const messageHash = eip712Hash(data, version);
  const sig = (0, import_ethereumjs_util.ecsign)(messageHash, bufferPrivateKey);
  return concatSig(toBuffer(sig.v), sig.r, sig.s);
}
function recoverTypedSignature({
  data,
  signature,
  version
}) {
  const messageHash = eip712Hash(data, version);
  const publicKey = recoverPublicKey(messageHash, signature);
  const sender = (0, import_ethereumjs_util.publicToAddress)(publicKey);
  return bufferToHex(sender);
}
var import_bn, import_keccak, import_ethereumjs_util, stripHexPrefix, zeros, assertIsBuffer, setLength, setLengthRight, intToHex, intToBuffer, bufferToHex, addHexPrefix, toBuffer;
var init_signTypedData = __esm({
  "src/signTypedData.ts"() {
    init_types();
    init_constants();
    import_bn = __toModule(require("bn.js"));
    import_keccak = __toModule(require("ethereum-cryptography/keccak"));
    import_ethereumjs_util = __toModule(require("ethereumjs-util"));
    stripHexPrefix = (str) => {
      if (typeof str !== "string")
        throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);
      return isHexPrefixed(str) ? str.slice(2) : str;
    };
    zeros = function(bytes) {
      return Buffer.allocUnsafe(bytes).fill(0);
    };
    assertIsBuffer = function(input) {
      if (!Buffer.isBuffer(input)) {
        const msg = `This method only supports Buffer but input was: ${input}`;
        throw new Error(msg);
      }
    };
    setLength = function(msg, length, right) {
      const buf = zeros(length);
      if (right) {
        if (msg.length < length) {
          msg.copy(buf);
          return buf;
        }
        return msg.slice(0, length);
      } else {
        if (msg.length < length) {
          msg.copy(buf, length - msg.length);
          return buf;
        }
        return msg.slice(-length);
      }
    };
    setLengthRight = function(msg, length) {
      assertIsBuffer(msg);
      return setLength(msg, length, true);
    };
    intToHex = function(i) {
      if (!Number.isSafeInteger(i) || i < 0) {
        throw new Error(`Received an invalid integer type: ${i}`);
      }
      return `0x${i.toString(16)}`;
    };
    intToBuffer = function(i) {
      const hex = intToHex(i);
      return Buffer.from(padToEven(hex.slice(2)), "hex");
    };
    bufferToHex = function(buf) {
      buf = toBuffer(buf);
      return "0x" + buf.toString("hex");
    };
    addHexPrefix = function(str) {
      if (typeof str !== "string") {
        return str;
      }
      return isHexPrefixed(str) ? str : "0x" + str;
    };
    toBuffer = function(v) {
      if (v === null || v === void 0) {
        return Buffer.allocUnsafe(0);
      }
      if (Buffer.isBuffer(v)) {
        return Buffer.from(v);
      }
      if (Array.isArray(v) || v instanceof Uint8Array) {
        return Buffer.from(v);
      }
      if (typeof v === "string") {
        if (!isHexString(v)) {
          throw new Error(`Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`);
        }
        return Buffer.from(padToEven(stripHexPrefix(v)), "hex");
      }
      if (typeof v === "number") {
        return intToBuffer(v);
      }
      if (typeof v === "bigint") {
        if (v < BigInt(0)) {
          throw new Error(`Cannot convert negative bigint to buffer. Given: ${v}`);
        }
        let n = v.toString(16);
        if (n.length % 2)
          n = "0" + n;
        return Buffer.from(n, "hex");
      }
      if (v.toArray) {
        return Buffer.from(v.toArray());
      }
      if (v.toBuffer) {
        return Buffer.from(v.toBuffer());
      }
      throw new Error("invalid type");
    };
  }
});

// src/wallet.ts
var require_wallet = __commonJS({
  "src/wallet.ts"(exports, module2) {
    var W3 = __toModule(require("web3"));
    var import_bignumber5 = __toModule(require("bignumber.js"));
    init_erc20();
    var import_kms = __toModule(require_kms());
    init_utils();
    init_types();
    init_signTypedData();
    var Web32 = initWeb3Lib();
    var Web3Modal;
    var WalletConnectProvider;
    var RequireJS = {
      require(reqs, callback) {
        window.require(reqs, callback);
      }
    };
    function initWeb3Lib() {
      if (typeof window !== "undefined" && window["Web3"])
        return window["Web3"];
      else
        return require("web3");
    }
    function initWeb3ModalLib(callback) {
      if (typeof window !== "undefined") {
        RequireJS.require(["WalletConnectProvider", "Web3Modal"], (walletconnect, web3modal) => {
          window["WalletConnectProvider"] = walletconnect;
          window["Web3Modal"] = web3modal;
          callback();
        });
      }
    }
    var Wallet2;
    (function(_Wallet) {
      function toString2(value) {
        if (Array.isArray(value)) {
          let result = [];
          for (let i = 0; i < value.length; i++) {
            result.push(toString2(value[i]));
          }
          return result;
        } else if (typeof value === "number")
          return value.toString(10);
        else if (import_bignumber5.BigNumber.isBigNumber(value))
          return value.toFixed();
        else
          return value;
      }
      _Wallet.toString = toString2;
      ;
      function stringToBytes322(value) {
        if (Array.isArray(value)) {
          let result = [];
          for (let i = 0; i < value.length; i++) {
            result.push(stringToBytes322(value[i]));
          }
          return result;
        } else {
          if (value.length == 66 && value.startsWith("0x"))
            return value;
          return Web32.utils.padRight(Web32.utils.asciiToHex(value), 64);
        }
      }
      _Wallet.stringToBytes32 = stringToBytes322;
      ;
      function stringToBytes2(value, nByte) {
        if (Array.isArray(value)) {
          let result = [];
          for (let i = 0; i < value.length; i++) {
            result.push(stringToBytes2(value[i]));
          }
          return result;
        } else {
          if (nByte) {
            if (new RegExp(`^0x[0-9a-fA-F]{${2 * nByte}}$`).test(value))
              return value;
            else if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value)) {
              if (value.length >= nByte * 2 + 2)
                return value;
              else
                return "0x" + value.substring(2) + "00".repeat(nByte - (value.length - 2) / 2);
            } else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) {
              if (value.length >= nByte * 2)
                return value;
              else
                return "0x" + value + "00".repeat(nByte - value.length / 2);
            } else
              return Web32.utils.padRight(Web32.utils.asciiToHex(value), nByte * 2);
          } else {
            if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value))
              return value;
            else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value))
              return "0x" + value;
            else
              return Web32.utils.asciiToHex(value);
          }
        }
      }
      _Wallet.stringToBytes = stringToBytes2;
      ;
      ;
      ;
      ;
      ;
      ;
      const WalletUtils = {
        fromWei(value) {
          return new import_bignumber5.BigNumber(W3.default.utils.fromWei(value));
        }
      };
      _Wallet.DefaultNetworksMap = {
        1: {
          chainId: 1,
          chainName: "Ethereum Mainnet",
          rpcUrls: ["https://mainnet.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://etherscan.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        3: {
          chainId: 3,
          chainName: "Ropsten Test Network",
          rpcUrls: ["https://ropsten.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://ropsten.etherscan.io"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        4: {
          chainId: 4,
          chainName: "Rinkeby Test Network",
          rpcUrls: ["https://rinkeby.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://rinkeby.etherscan.io"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        42: {
          chainId: 42,
          chainName: "Kovan Test Network",
          rpcUrls: ["https://kovan.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://kovan.etherscan.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        56: {
          chainId: 56,
          chainName: "Binance Mainnet",
          rpcUrls: ["https://bsc-dataseed.binance.org"],
          blockExplorerUrls: ["https://bscscan.com"],
          nativeCurrency: {
            decimals: 18,
            name: "BNB",
            symbol: "BNB"
          }
        },
        97: {
          chainId: 97,
          chainName: "Binance Testnet",
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          blockExplorerUrls: ["https://testnet.bscscan.com"],
          nativeCurrency: {
            decimals: 18,
            name: "BNB",
            symbol: "BNB"
          }
        },
        137: {
          chainId: 137,
          chainName: "Polygon",
          rpcUrls: ["https://polygon-rpc.com"],
          blockExplorerUrls: ["https://polygonscan.com/"],
          nativeCurrency: {
            decimals: 18,
            name: "MATIC",
            symbol: "MATIC"
          }
        },
        1287: {
          chainId: 1287,
          chainName: "Moonbeam Testnet",
          rpcUrls: ["https://rpc.testnet.moonbeam.network"],
          blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network"],
          nativeCurrency: {
            decimals: 18,
            name: "MOON",
            symbol: "MOON"
          }
        },
        31337: {
          chainId: 31337,
          chainName: "Amino Testnet",
          rpcUrls: ["https://leucine0.node.alphacarbon.network"],
          blockExplorerUrls: ["https://leucine0.blockscout.alphacarbon.network"],
          nativeCurrency: {
            decimals: 18,
            name: "TACT",
            symbol: "TACT"
          }
        },
        80001: {
          chainId: 80001,
          chainName: "Mumbai",
          rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
          nativeCurrency: {
            decimals: 18,
            name: "MATIC",
            symbol: "MATIC"
          }
        },
        43113: {
          chainId: 43113,
          chainName: "Avalanche FUJI C-Chain",
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://testnet.snowtrace.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "AVAX",
            symbol: "AVAX"
          }
        },
        43114: {
          chainId: 43114,
          chainName: "Avalanche Mainnet C-Chain",
          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://snowtrace.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "AVAX",
            symbol: "AVAX"
          }
        },
        4002: {
          chainId: 4002,
          chainName: "Fantom Testnet",
          rpcUrls: ["https://rpc.testnet.fantom.network/"],
          blockExplorerUrls: ["https://testnet.ftmscan.com/", "https://explorer.testnet.fantom.network/"],
          nativeCurrency: {
            decimals: 18,
            name: "FTM",
            symbol: "FTM"
          }
        },
        250: {
          chainId: 250,
          chainName: "Fantom Opera",
          rpcUrls: ["https://rpc.ftm.tools/"],
          blockExplorerUrls: ["https://ftmscan.com/", "https://explorer.fantom.network/"],
          nativeCurrency: {
            decimals: 18,
            name: "FTM",
            symbol: "FTM"
          }
        },
        13370: {
          chainId: 13370,
          chainName: "AminoX Testnet",
          rpcUrls: ["https://aminoxtestnet.node.alphacarbon.network"],
          blockExplorerUrls: ["https://aminoxtestnet.blockscout.alphacarbon.network/"],
          nativeCurrency: {
            decimals: 18,
            name: "TACT",
            symbol: "TACT"
          }
        }
      };
      let WalletPlugin2;
      (function(WalletPlugin3) {
        WalletPlugin3["MetaMask"] = "metamask";
        WalletPlugin3["Coin98"] = "coin98";
        WalletPlugin3["TrustWallet"] = "trustwallet";
        WalletPlugin3["BinanceChainWallet"] = "binancechainwallet";
        WalletPlugin3["ONTOWallet"] = "onto";
        WalletPlugin3["WalletConnect"] = "walletconnect";
        WalletPlugin3["BitKeepWallet"] = "bitkeepwallet";
      })(WalletPlugin2 = _Wallet.WalletPlugin || (_Wallet.WalletPlugin = {}));
      _Wallet.WalletPluginConfig = {
        [WalletPlugin2.MetaMask]: {
          provider: () => {
            return window["ethereum"];
          },
          installed: () => {
            let ethereum = window["ethereum"];
            return !!ethereum && !!ethereum.isMetaMask;
          },
          homepage: () => {
            return "https://metamask.io/download.html";
          }
        },
        [WalletPlugin2.Coin98]: {
          provider: () => {
            return window["ethereum"];
          },
          installed: () => {
            let ethereum = window["ethereum"];
            return !!ethereum && (!!ethereum.isCoin98 || !!window["isCoin98"]);
          },
          homepage: () => {
            return "https://docs.coin98.com/products/coin98-wallet";
          }
        },
        [WalletPlugin2.TrustWallet]: {
          provider: () => {
            return window["ethereum"];
          },
          installed: () => {
            let ethereum = window["ethereum"];
            return !!ethereum && !!ethereum.isTrust;
          },
          homepage: () => {
            return "https://link.trustwallet.com/open_url?url=" + window.location.href;
          }
        },
        [WalletPlugin2.BinanceChainWallet]: {
          provider: () => {
            return window["BinanceChain"];
          },
          installed: () => {
            return !!window["BinanceChain"];
          },
          homepage: () => {
            return "https://www.binance.org/en";
          }
        },
        [WalletPlugin2.ONTOWallet]: {
          provider: () => {
            return window["onto"];
          },
          installed: () => {
            return !!window["onto"];
          },
          homepage: () => {
            return "https://onto.app/en/download/?mode=app";
          }
        },
        [WalletPlugin2.BitKeepWallet]: {
          provider: () => {
            return window["bitkeep"]["ethereum"];
          },
          installed: () => {
            return !!window["isBitKeep"];
          },
          homepage: () => {
            return "https://bitkeep.com/download?type=2";
          }
        }
      };
      class ClientSideProvider {
        constructor(wallet, walletPlugin, events, options) {
          this._isConnected = false;
          this.wallet = wallet;
          this.walletPlugin = walletPlugin;
          this._events = events;
          this._options = options;
        }
        get installed() {
          return _Wallet.WalletPluginConfig[this.walletPlugin].installed();
        }
        initEvents() {
          let self = this;
          if (this.installed) {
            this.provider.on("accountsChanged", (accounts) => {
              let accountAddress;
              let hasAccounts = accounts && accounts.length > 0;
              if (hasAccounts) {
                accountAddress = self.wallet.web3.utils.toChecksumAddress(accounts[0]);
                self.wallet.web3.selectedAddress = accountAddress;
                self.wallet.account = {
                  address: accountAddress
                };
              }
              this._isConnected = hasAccounts;
              if (self.onAccountChanged)
                self.onAccountChanged(accountAddress);
            });
            this.provider.on("chainChanged", (chainId) => {
              self.wallet.chainId = parseInt(chainId);
              if (this._options && this._options.callWithDefaultProvider) {
                if (this._options.infuraId)
                  this.wallet.infuraId = this._options.infuraId;
                self.wallet.setDefaultProvider();
              }
              if (self.onChainChanged)
                self.onChainChanged(chainId);
            });
            this.provider.on("connect", (connectInfo) => {
              if (self.onConnect)
                self.onConnect(connectInfo);
            });
            this.provider.on("disconnect", (error) => {
              if (self.onDisconnect)
                self.onDisconnect(error);
            });
          }
          ;
        }
        async connect() {
          this.provider = _Wallet.WalletPluginConfig[this.walletPlugin].provider();
          this.wallet.chainId = parseInt(this.provider.chainId, 16);
          this.wallet.web3.setProvider(this.provider);
          if (this._events) {
            this.onAccountChanged = this._events.onAccountChanged;
            this.onChainChanged = this._events.onChainChanged;
            this.onConnect = this._events.onConnect;
            this.onDisconnect = this._events.onDisconnect;
          }
          this.initEvents();
          let self = this;
          try {
            if (this.installed) {
              await this.provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
                let accountAddress;
                let hasAccounts = accounts && accounts.length > 0;
                if (hasAccounts) {
                  accountAddress = self.wallet.web3.utils.toChecksumAddress(accounts[0]);
                  self.wallet.web3.selectedAddress = accountAddress;
                  self.wallet.account = {
                    address: accountAddress
                  };
                }
                this._isConnected = hasAccounts;
                if (self.onAccountChanged)
                  self.onAccountChanged(accountAddress);
              });
            }
          } catch (error) {
            console.error(error);
          }
          return this.provider;
        }
        async disconnect() {
          if (this.provider == null) {
            return;
          }
          if (this.provider.disconnect) {
            await this.provider.disconnect();
          }
          this.wallet.account = null;
          this._isConnected = false;
        }
        get isConnected() {
          return this._isConnected;
        }
        addToken(option, type) {
          return new Promise(async function(resolve, reject) {
            try {
              let result = await this.provider.request({
                method: "wallet_watchAsset",
                params: {
                  type: type || "ERC20",
                  options: option
                }
              });
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        }
        switchNetwork(chainId, onChainChanged) {
          let self = this;
          if (onChainChanged) {
            this.onChainChanged = onChainChanged;
          }
          return new Promise(async function(resolve, reject) {
            try {
              let chainIdHex = "0x" + chainId.toString(16);
              try {
                let result = await self.provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{
                    chainId: chainIdHex
                  }]
                });
                resolve(!result);
              } catch (error) {
                if (error.code === 4902) {
                  try {
                    let network = self.wallet.networksMap[chainId];
                    if (!network)
                      resolve(false);
                    let { chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = network;
                    if (!Array.isArray(rpcUrls))
                      rpcUrls = [rpcUrls];
                    if (blockExplorerUrls && !Array.isArray(blockExplorerUrls))
                      blockExplorerUrls = [blockExplorerUrls];
                    if (iconUrls && !Array.isArray(iconUrls))
                      iconUrls = [iconUrls];
                    let result = await self.provider.request({
                      method: "wallet_addEthereumChain",
                      params: [{
                        chainId: chainIdHex,
                        chainName,
                        nativeCurrency,
                        rpcUrls,
                        blockExplorerUrls,
                        iconUrls
                      }]
                    });
                    resolve(!result);
                  } catch (error2) {
                    reject(error2);
                  }
                } else
                  reject(error);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
        addNetwork(options) {
          return new Promise(async function(resolve, reject) {
            try {
              options = JSON.parse(JSON.stringify(options));
              let chainIdHex = "0x" + options.chainId.toString(16);
              try {
                await this.provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: chainIdHex }]
                });
                resolve(true);
              } catch (err) {
                let result = await this.provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    options
                  ]
                });
                resolve(!result);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      }
      _Wallet.ClientSideProvider = ClientSideProvider;
      class BinanceChainWalletProvider extends ClientSideProvider {
        switchNetwork(chainId, onChainChanged) {
          let self = this;
          if (onChainChanged) {
            this.onChainChanged = onChainChanged;
          }
          return new Promise(async function(resolve, reject) {
            try {
              let chainIdHex = "0x" + chainId.toString(16);
              try {
                let result = await self.provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{
                    chainId: chainIdHex
                  }]
                });
                resolve(!result);
              } catch (error) {
                if (error.code === 4902) {
                  try {
                    let network = self.wallet.networksMap[chainId];
                    if (!network)
                      resolve(false);
                    let { chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = network;
                    if (!Array.isArray(rpcUrls))
                      rpcUrls = [rpcUrls];
                    if (blockExplorerUrls && !Array.isArray(blockExplorerUrls))
                      blockExplorerUrls = [blockExplorerUrls];
                    if (iconUrls && !Array.isArray(iconUrls))
                      iconUrls = [iconUrls];
                    let result = await self.provider.request({
                      method: "wallet_addEthereumChain",
                      params: [{
                        chainId: chainIdHex,
                        chainName,
                        nativeCurrency,
                        rpcUrls,
                        blockExplorerUrls,
                        iconUrls
                      }]
                    });
                    resolve(!result);
                  } catch (error2) {
                    reject(error2);
                  }
                } else
                  reject(error);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      }
      _Wallet.BinanceChainWalletProvider = BinanceChainWalletProvider;
      class Web3ModalProvider extends ClientSideProvider {
        constructor(wallet, walletPlugin, events, options) {
          super(wallet, walletPlugin, events);
          this.initializeWeb3Modal(options);
        }
        get installed() {
          return true;
        }
        initializeWeb3Modal(options) {
          let func = () => {
            WalletConnectProvider = window["WalletConnectProvider"];
            const providerOptions = {
              walletconnect: {
                package: WalletConnectProvider.default,
                options
              }
            };
            Web3Modal = window["Web3Modal"];
            this.web3Modal = new Web3Modal.default({
              cacheProvider: false,
              providerOptions
            });
          };
          initWeb3ModalLib(func);
        }
        async connect() {
          await this.disconnect();
          this.provider = await this.web3Modal.connectTo(WalletPlugin2.WalletConnect);
          this.wallet.chainId = this.provider.chainId;
          this.wallet.web3.setProvider(this.provider);
          if (this._events) {
            this.onAccountChanged = this._events.onAccountChanged;
            this.onChainChanged = this._events.onChainChanged;
            this.onConnect = this._events.onConnect;
            this.onDisconnect = this._events.onDisconnect;
          }
          this.initEvents();
          let self = this;
          try {
            await this.wallet.web3.eth.getAccounts((err, accounts) => {
              let accountAddress;
              let hasAccounts = accounts && accounts.length > 0;
              if (hasAccounts) {
                accountAddress = self.wallet.web3.utils.toChecksumAddress(accounts[0]);
                self.wallet.web3.selectedAddress = accountAddress;
                this.wallet.account = {
                  address: accountAddress
                };
              }
              this._isConnected = hasAccounts;
              if (self.onAccountChanged)
                self.onAccountChanged(accountAddress);
            });
          } catch (error) {
            console.error(error);
          }
          return this.provider;
        }
        async disconnect() {
          if (this.provider == null) {
            return;
          }
          if (this.provider.disconnect) {
            await this.provider.disconnect();
          }
          this.wallet.account = null;
          this._isConnected = false;
        }
      }
      _Wallet.Web3ModalProvider = Web3ModalProvider;
      function createClientSideProvider(wallet, walletPlugin, events, providerOptions) {
        if (Wallet3.isInstalled(walletPlugin)) {
          if (walletPlugin == WalletPlugin2.BinanceChainWallet) {
            return new BinanceChainWalletProvider(wallet, walletPlugin, events);
          }
          if (walletPlugin == WalletPlugin2.WalletConnect) {
            return new Web3ModalProvider(wallet, walletPlugin, events, providerOptions);
          } else {
            return new ClientSideProvider(wallet, walletPlugin, events);
          }
        }
        return null;
      }
      _Wallet.createClientSideProvider = createClientSideProvider;
      ;
      const _Wallet2 = class {
        constructor(provider, account) {
          this._eventTopicAbi = {};
          this._eventHandler = {};
          this._sendTxEventHandler = {};
          this._contracts = {};
          this._networksMap = {};
          this._abiHashDict = {};
          this._abiContractDict = {};
          this._abiAddressDict = {};
          this._abiEventDict = {};
          this._provider = provider;
          this._web3 = new Web32(provider);
          this._utils = {
            fromWei: this._web3.utils.fromWei,
            hexToUtf8: this._web3.utils.hexToUtf8,
            sha3: this._web3.utils.sha3,
            toUtf8: this._web3.utils.toUtf8,
            toWei: this._web3.utils.toWei,
            toString: toString2,
            stringToBytes: stringToBytes2,
            stringToBytes32: stringToBytes322
          };
          if (Array.isArray(account)) {
            this._accounts = account;
            this._account = account[0];
          } else
            this._account = account;
          if (this._account && this._account.privateKey && !this._account.address)
            this._account.address = this._web3.eth.accounts.privateKeyToAccount(this._account.privateKey).address;
          this._networksMap = _Wallet.DefaultNetworksMap;
        }
        static getInstance() {
          return _Wallet2.instance;
        }
        static isInstalled(walletPlugin) {
          if (walletPlugin == WalletPlugin2.WalletConnect)
            return true;
          return _Wallet.WalletPluginConfig[walletPlugin] ? _Wallet.WalletPluginConfig[walletPlugin].installed() : false;
        }
        get isConnected() {
          return this.clientSideProvider ? this.clientSideProvider.isConnected : false;
        }
        async switchNetwork(chainId, onChainChanged) {
          let result;
          if (this.clientSideProvider) {
            result = await this.clientSideProvider.switchNetwork(chainId, onChainChanged);
          } else {
            this.chainId = chainId;
            this.setDefaultProvider();
            onChainChanged("0x" + chainId.toString(16));
          }
          return result;
        }
        setDefaultProvider() {
          var _a;
          if (!this.chainId)
            this.chainId = 56;
          if (this._networksMap[this.chainId] && this._networksMap[this.chainId].rpcUrls.length > 0) {
            let rpc = this._networksMap[this.chainId].rpcUrls[0];
            if (rpc.indexOf("{INFURA_ID}")) {
              rpc = rpc.replace("{INFURA_ID}", (_a = this._infuraId) != null ? _a : "");
            }
            this.provider = rpc;
          }
        }
        async connect(walletPlugin, events, providerOptions) {
          this.clientSideProvider = createClientSideProvider(this, walletPlugin, events, providerOptions);
          if (this.clientSideProvider) {
            await this.clientSideProvider.connect();
            if (providerOptions && providerOptions.callWithDefaultProvider) {
              if (providerOptions.infuraId)
                this._infuraId = providerOptions.infuraId;
              this.setDefaultProvider();
            } else {
              this.provider = this.clientSideProvider.provider;
            }
          } else {
            this.setDefaultProvider();
          }
          return this.clientSideProvider;
        }
        async disconnect() {
          if (this.clientSideProvider) {
            await this.clientSideProvider.disconnect();
          }
          this.setDefaultProvider();
        }
        get accounts() {
          return new Promise((resolve) => {
            if (this._accounts) {
              let result = [];
              for (let i = 0; i < this._accounts.length; i++) {
                if (!this._accounts[i].address && this._accounts[i].privateKey)
                  this._accounts[i].address = this._web3.eth.accounts.privateKeyToAccount(this._accounts[i].privateKey).address;
                result.push(this._accounts[i].address);
              }
              return resolve(result);
            } else if (this._account)
              return resolve([this._account.address]);
            resolve(this._web3.eth.getAccounts());
          });
        }
        get address() {
          if (this._account && this._account.privateKey) {
            if (!this._account.address)
              this._account.address = this._web3.eth.accounts.privateKeyToAccount(this._account.privateKey).address;
            return this._account.address;
          } else if (this._kms && this._account) {
            return this._account.address;
          } else if (this._web3.selectedAddress) {
            return this._web3.selectedAddress;
          } else if (this._web3.eth.defaultAccount) {
            return this._web3.eth.defaultAccount;
          }
          if (!this._account) {
            this._account = this.createAccount();
            return this._account.address;
          } else
            return this._account.address;
        }
        get account() {
          return {
            address: this.address
          };
        }
        set account(value) {
          this._kms = null;
          this._web3.eth.defaultAccount = "";
          this._account = value;
        }
        get infuraId() {
          return this._infuraId;
        }
        set infuraId(value) {
          this._infuraId = value;
          this.setDefaultProvider();
        }
        get networksMap() {
          return this._networksMap;
        }
        getNetworkInfo(chainId) {
          return this._networksMap[chainId];
        }
        setNetworkInfo(network) {
          this._networksMap[network.chainId] = network;
        }
        setMultipleNetworksInfo(networks) {
          for (let network of networks) {
            this.setNetworkInfo(network);
          }
        }
        createAccount() {
          let acc = this._web3.eth.accounts.create();
          return {
            address: acc.address,
            privateKey: acc.privateKey
          };
        }
        decodeLog(inputs, hexString, topics) {
          return this.web3.eth.abi.decodeLog(inputs, hexString, topics);
        }
        get defaultAccount() {
          if (this._account)
            return this._account.address;
          return this._web3.eth.defaultAccount;
        }
        set defaultAccount(address) {
          if (this._accounts) {
            for (let i = 0; i < this._accounts.length; i++) {
              if (!this._accounts[i].address && this._accounts[i].privateKey)
                this._accounts[i].address = this._web3.eth.accounts.privateKeyToAccount(this._accounts[i].privateKey).address;
              if (this._accounts[i].address && this._accounts[i].address.toLowerCase() == address.toLowerCase()) {
                this._account = this._accounts[i];
                return;
              }
            }
          } else if (this._account && this._account.address && this._account.address.toLowerCase() == address.toLowerCase()) {
            return;
          } else
            this._web3.eth.defaultAccount = address;
        }
        async getChainId() {
          if (!this.chainId)
            this.chainId = await this._web3.eth.getChainId();
          return this.chainId;
        }
        get provider() {
          return this._provider;
        }
        set provider(value) {
          this._web3.setProvider(value);
          this._provider = value;
        }
        sendSignedTransaction(tx) {
          let _web3 = this._web3;
          return _web3.eth.sendSignedTransaction(tx);
        }
        async signTransaction(tx, privateKey) {
          let _web3 = this._web3;
          let gas = tx.gas || await _web3.eth.estimateGas({
            from: this.address,
            to: tx.to,
            data: tx.data
          });
          let gasLimit = tx.gasLimit || gas;
          let nonce = tx.nonce || await _web3.eth.getTransactionCount(this.address);
          if (privateKey || this._account && this._account.privateKey) {
            let signedTx = await _web3.eth.accounts.signTransaction({
              nonce,
              gas,
              gasLimit,
              data: tx.data,
              from: this.address,
              to: tx.to
            }, privateKey ? privateKey : this._account.privateKey);
            return signedTx.rawTransaction;
          } else if (this._account && this._account.kms) {
            let chainId = await this.getChainId();
            let txHash = await this.kms.signTransaction(chainId, tx);
            return txHash;
          } else {
            let t = await _web3.eth.signTransaction({
              from: this.address,
              nonce,
              gasLimit,
              gas,
              to: tx.to,
              data: tx.data
            }, this.address);
            return t.raw;
          }
        }
        registerSendTxEvents(eventsOptions) {
          this._sendTxEventHandler = eventsOptions;
        }
        async getContract(abiHash) {
          let contract;
          if (!this._abiContractDict[abiHash]) {
            contract = this.newContract(this._abiHashDict[abiHash]);
            this._abiContractDict[abiHash] = contract;
            return contract;
          }
          ;
          return this._abiContractDict[abiHash];
        }
        async _call(abiHash, address, methodName, params, options) {
          let contract = await this.getContract(abiHash);
          contract.options.address = address;
          let method = contract.methods[methodName].apply(this, params);
          let result = method.call(__spreadValues({ from: this.address }, options));
          return result;
        }
        async txObj(abiHash, address, methodName, params, options) {
          let contract = await this.getContract(abiHash);
          params = params || [];
          let bytecode;
          if (!methodName) {
            bytecode = params.shift();
            contract.options.address = void 0;
          } else
            contract.options.address = address;
          let abi = this._abiHashDict[abiHash];
          let methodAbi = abi.find((e) => methodName ? e.name == methodName : e.type == "constructor");
          if (methodAbi)
            for (let i = 0; i < methodAbi.inputs.length; i++) {
              if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
                params[i] = params[i] || "";
                if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
                  let a = [];
                  for (let k = 0; k < params[i].length; k++) {
                    let s = params[i][k] || "";
                    if (!params[i][k])
                      a.push("0x");
                    else
                      a.push(s);
                  }
                  params[i] = a;
                } else if (!params[i])
                  params[i] = "0x";
              } else if (methodAbi.inputs[i].type == "address") {
                if (!params[i])
                  params[i] = nullAddress;
              }
            }
          let method;
          if (!methodName)
            method = contract.deploy({ data: bytecode, arguments: params });
          else
            method = contract.methods[methodName].apply(this, params);
          let tx = {};
          tx.from = this.address;
          tx.to = address || void 0;
          tx.data = method.encodeABI();
          if (options && options.value) {
            tx.value = options.value;
          } else {
            tx.value = 0;
          }
          if (options && (options.gas || options.gasLimit)) {
            tx.gas = options.gas || options.gasLimit;
          } else {
            try {
              tx.gas = await method.estimateGas({ from: this.address, to: address ? address : void 0, value: options && options.value || 0 });
              tx.gas = Math.min(await this.blockGasLimit(), Math.round(tx.gas * 1.5));
            } catch (e) {
              if (e.message == "Returned error: out of gas") {
                console.log(e.message);
                tx.gas = Math.round(await this.blockGasLimit() * 0.5);
              } else {
                if (e.message.includes("Returned error: execution reverted: ")) {
                  throw e;
                }
                try {
                  await method.call(__spreadValues({ from: this.address }, options));
                } catch (e2) {
                  if (e2.message.includes("VM execution error.")) {
                    var msg = (e2.data || e2.message).match(/0x[0-9a-fA-F]+/);
                    if (msg && msg.length) {
                      msg = msg[0];
                      if (msg.startsWith("0x08c379a")) {
                        msg = this.decodeErrorMessage(msg);
                        throw new Error("Returned error: execution reverted: " + msg);
                      }
                    }
                  }
                }
                throw e;
              }
            }
          }
          if (!tx.gasPrice) {
            tx.gasPrice = await this.getGasPrice();
          }
          if (options && options.nonce) {
            tx.nonce = options.nonce;
          } else {
            tx.nonce = await this.transactionCount();
          }
          return tx;
        }
        async _send(abiHash, address, methodName, params, options) {
          let tx = await this.txObj(abiHash, address, methodName, params, options);
          let receipt = await this.sendTransaction(tx);
          return receipt;
        }
        async _methods(...args) {
          let _web3 = this._web3;
          let result;
          let value;
          let method;
          let methodAbi;
          let byteCode;
          let abi = args.shift();
          let address = args.shift();
          let methodName = args.shift();
          if (methodName == "deploy")
            byteCode = args.shift();
          let contract;
          let hash;
          if (this._contracts[address])
            contract = this._contracts[address];
          else {
            hash = this._web3.utils.sha3(JSON.stringify(abi));
            if (this._contracts[hash]) {
              contract = this._contracts[hash];
            }
          }
          if (!contract) {
            contract = new this._web3.eth.Contract(abi);
            this._contracts[address] = contract;
            this._contracts[hash] = contract;
          }
          if (methodName == "deploy") {
            method = contract[methodName]({
              data: byteCode,
              arguments: args
            });
          } else {
            for (let i = 0; i < abi.length; i++) {
              if (abi[i].name == methodName) {
                methodAbi = abi[i];
                break;
              }
            }
            if (methodAbi.payable)
              value = args.pop();
            for (let i = 0; i < methodAbi.inputs.length; i++) {
              if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
                args[i] = args[i] || "";
                if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
                  let a = [];
                  for (let k = 0; k < args[i].length; k++) {
                    let s = args[i][k] || "";
                    if (s.indexOf("0x") != 0)
                      a.push(_web3.utils.fromAscii(s));
                    else
                      a.push(s);
                  }
                  args[i] = a;
                } else if (args[i].indexOf("0x") != 0)
                  args[i] = _web3.utils.fromAscii(args[i]);
              } else if (methodAbi.inputs[i].type == "address") {
                if (!args[i])
                  args[i] = _web3.eth.abi.encodeParameter("address", 0);
              }
            }
            method = contract.methods[methodName].apply(contract, args);
          }
          let tx = {
            to: address,
            data: method.encodeABI()
          };
          return tx;
        }
        async methods(...args) {
          let _web3 = this._web3;
          if (_web3.methods) {
            return _web3.methods.apply(_web3, args);
          } else {
            let result;
            let value;
            let method;
            let methodAbi;
            let byteCode;
            let abi = args.shift();
            let address = args.shift();
            let methodName = args.shift();
            if (methodName == "deploy")
              byteCode = args.shift();
            let contract;
            let hash;
            if (address && this._contracts[address])
              contract = this._contracts[address];
            else {
              hash = this._web3.utils.sha3(JSON.stringify(abi));
              if (this._contracts[hash]) {
                contract = this._contracts[hash];
              }
            }
            ;
            if (!contract) {
              contract = new this._web3.eth.Contract(abi);
              if (address)
                this._contracts[address] = contract;
              this._contracts[hash] = contract;
            }
            ;
            if (methodName == "deploy") {
              method = contract[methodName]({
                data: byteCode,
                arguments: args
              });
            } else {
              for (let i = 0; i < abi.length; i++) {
                if (abi[i].name == methodName) {
                  methodAbi = abi[i];
                  break;
                }
              }
              if (methodAbi.payable)
                value = args.pop();
              for (let i = 0; i < methodAbi.inputs.length; i++) {
                if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
                  args[i] = args[i] || "";
                  if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
                    let a = [];
                    for (let k = 0; k < args[i].length; k++) {
                      let s = args[i][k] || "";
                      if (s.indexOf("0x") != 0)
                        a.push(_web3.utils.fromAscii(s));
                      else
                        a.push(s);
                    }
                    args[i] = a;
                  } else if (args[i].indexOf("0x") != 0)
                    args[i] = _web3.utils.fromAscii(args[i]);
                } else if (methodAbi.inputs[i].type == "address") {
                  if (!args[i])
                    args[i] = _web3.eth.abi.encodeParameter("address", 0);
                }
              }
              method = contract.methods[methodName].apply(contract, args);
            }
            ;
            contract.options.address = address;
            if (methodAbi && (methodAbi.constant || methodAbi.stateMutability == "view")) {
              return method.call({ from: this.address });
            }
            if (!this._blockGasLimit) {
              this._blockGasLimit = (await _web3.eth.getBlock("latest")).gasLimit;
            }
            let gas;
            try {
              gas = await method.estimateGas({ from: this.address, to: address, value });
              gas = Math.min(this._blockGasLimit, Math.round(gas * 1.5));
            } catch (e) {
              if (e.message == "Returned error: out of gas") {
                console.log(e.message);
                gas = Math.round(this._blockGasLimit * 0.5);
              } else {
                try {
                  await method.call({ from: this.address, value });
                } catch (e2) {
                  if (e2.message.includes("VM execution error.")) {
                    var msg = (e2.data || e2.message).match(/0x[0-9a-fA-F]+/);
                    if (msg && msg.length) {
                      msg = msg[0];
                      if (msg.startsWith("0x08c379a")) {
                        msg = _web3.eth.abi.decodeParameter("string", "0x" + msg.substring(10));
                        throw new Error(msg);
                      }
                    }
                  }
                }
                throw e;
              }
            }
            let gasPrice = await _web3.eth.getGasPrice();
            if (this._account && this._account.privateKey) {
              let tx = {
                gas,
                gasPrice,
                data: method.encodeABI(),
                from: this.address,
                to: address,
                value
              };
              let signedTx = await _web3.eth.accounts.signTransaction(tx, this._account.privateKey);
              result = await _web3.eth.sendSignedTransaction(signedTx.rawTransaction);
              if (methodName == "deploy")
                return result.contractAddress;
              return result;
            } else if (this._account && this._account.kms) {
              let nonce = await _web3.eth.getTransactionCount(this.address);
              let price = _web3.utils.numberToHex(await _web3.eth.getGasPrice());
              let tx = {
                from: this.address,
                nonce,
                gasPrice: price,
                gasLimit: gas,
                gas,
                to: address,
                data: method.encodeABI()
              };
              let chainId = await this.getChainId();
              let txHash = await this.kms.signTransaction(chainId, tx);
              result = await _web3.eth.sendSignedTransaction(txHash);
              if (methodName == "deploy")
                return result.contractAddress;
              return result;
            } else {
              contract.options.address = address;
              let nonce = await _web3.eth.getTransactionCount(this.address);
              let tx = {
                from: this.address,
                nonce,
                gasPrice,
                gas,
                to: address,
                value,
                data: method.encodeABI()
              };
              let promiEvent = _web3.eth.sendTransaction(tx);
              promiEvent.on("error", (error) => {
                if (error.message.startsWith("Transaction was not mined within 50 blocks")) {
                  return;
                }
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(error);
              });
              promiEvent.on("transactionHash", (receipt) => {
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(null, receipt);
              });
              promiEvent.on("confirmation", (confNumber, receipt) => {
                if (this._sendTxEventHandler.confirmation && confNumber == 1)
                  this._sendTxEventHandler.confirmation(receipt);
              });
              result = await promiEvent;
              if (methodName == "deploy")
                return result.contractAddress;
              return result;
            }
          }
        }
        get balance() {
          let self = this;
          let _web3 = this._web3;
          return new Promise(async function(resolve) {
            try {
              let network = self._networksMap[self.chainId];
              let decimals = 18;
              if (network && network.nativeCurrency && network.nativeCurrency.decimals)
                decimals = network.nativeCurrency.decimals;
              let result = await _web3.eth.getBalance(self.address);
              resolve(new import_bignumber5.BigNumber(result).div(10 ** decimals));
            } catch (err) {
              resolve(new import_bignumber5.BigNumber(0));
            }
          });
        }
        balanceOf(address) {
          let self = this;
          let _web3 = this._web3;
          return new Promise(async function(resolve) {
            try {
              let network = self._networksMap[self.chainId];
              let decimals = 18;
              if (network && network.nativeCurrency && network.nativeCurrency.decimals)
                decimals = network.nativeCurrency.decimals;
              let result = await _web3.eth.getBalance(address);
              resolve(new import_bignumber5.BigNumber(result).div(10 ** decimals));
            } catch (err) {
              resolve(new import_bignumber5.BigNumber(0));
            }
          });
        }
        recoverSigner(msg, signature) {
          let _web3 = this._web3;
          return new Promise(async function(resolve, reject) {
            try {
              let signing_address = await _web3.eth.accounts.recover(msg, signature);
              resolve(signing_address);
            } catch (err) {
              reject(err);
            }
            ;
          });
        }
        getBlock(blockHashOrBlockNumber, returnTransactionObjects) {
          if (returnTransactionObjects) {
            return this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", true);
          }
          return this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", false);
        }
        getBlockNumber() {
          return this._web3.eth.getBlockNumber();
        }
        async getBlockTimestamp(blockHashOrBlockNumber) {
          let block = await this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", false);
          if (typeof block.timestamp == "string")
            return parseInt(block.timestamp);
          else
            return block.timestamp;
        }
        async initKMS(value) {
          value = value || this._account.kms;
          if (value) {
            this._kms = new import_kms.KMS(value);
            this._account = {
              address: await this._kms.getAddress(),
              kms: value
            };
          }
        }
        get kms() {
          if (this._account && !this._kms && this._account.kms)
            this._kms = new import_kms.KMS(this._account.kms);
          return this._kms;
        }
        set privateKey(value) {
          if (value) {
            this._kms = null;
            this._web3.eth.defaultAccount = "";
          }
          this._account = {
            address: "",
            privateKey: value
          };
        }
        registerEvent(eventMap, address, handler) {
          for (let topic in eventMap) {
            this._eventTopicAbi[topic] = eventMap[topic];
          }
          if (address && handler) {
            this._eventHandler[address] = handler;
          }
        }
        getAbiEvents(abi) {
          let _web3 = this._web3;
          let events = abi.filter((e) => e.type == "event");
          let eventMap = {};
          for (let i = 0; i < events.length; i++) {
            let topic = _web3.utils.soliditySha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
            eventMap[topic] = events[i];
          }
          return eventMap;
        }
        getAbiTopics(abi, eventNames) {
          if (!eventNames || eventNames.length == 0)
            eventNames = null;
          let _web3 = this._web3;
          let result = [];
          let events = abi.filter((e) => e.type == "event");
          for (let i = 0; i < events.length; i++) {
            if (!eventNames || eventNames.indexOf(events[i].name) >= 0) {
              let topic = _web3.utils.soliditySha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
              result.push(topic);
            }
          }
          if (result.length == 0 && eventNames && eventNames.length > 0)
            return ["NULL"];
          return [result];
        }
        getContractAbi(address) {
          return this._abiAddressDict[address];
        }
        getContractAbiEvents(address) {
          let events = this._abiEventDict[address];
          if (events)
            return events;
          let abi = this._abiHashDict[this._abiAddressDict[address]];
          if (abi) {
            events = this.getAbiEvents(abi);
            this._abiEventDict[address] = events;
            return events;
          }
        }
        registerAbi(abi, address, handler) {
          let hash = "";
          if (typeof abi == "string") {
            hash = this._web3.utils.sha3(abi);
            abi = JSON.parse(abi);
          } else {
            hash = this._web3.utils.sha3(JSON.stringify(abi));
          }
          if (!address && !handler && this._abiHashDict[hash])
            return hash;
          let eventMap;
          eventMap = this.getAbiEvents(abi);
          for (let topic in eventMap) {
            this._eventTopicAbi[topic] = eventMap[topic];
          }
          this._abiHashDict[hash] = abi;
          if (address)
            this.registerAbiContracts(hash, address, handler);
          return hash;
        }
        registerAbiContracts(abiHash, address, handler) {
          if (address) {
            if (!Array.isArray(address))
              address = [address];
            for (let i = 0; i < address.length; i++) {
              this._abiAddressDict[address[i]] = abiHash;
              if (handler)
                this._eventHandler[address[i]] = handler;
            }
          }
        }
        decode(abi, event, raw) {
          if (!raw)
            raw = event;
          let d;
          try {
            if (abi) {
              d = this.web3.eth.abi.decodeLog(abi.inputs, raw.data, raw.topics.slice(1));
              if (d.__length__) {
                for (let k = 0; k < d.__length__; k++)
                  delete d[k];
                delete d["__length__"];
              }
            }
          } catch (err) {
          }
          let log = {
            address: event.address,
            blockNumber: event.blockNumber,
            topics: raw.topics,
            data: d ? d : raw.data,
            rawData: d ? raw.data : void 0,
            logIndex: event.logIndex,
            name: abi ? abi.name : void 0,
            transactionHash: event.transactionHash,
            transactionIndex: event.transactionIndex
          };
          return log;
        }
        async decodeEventData(data, events) {
          let _web3 = this._web3;
          let event;
          if (events)
            event = events[data.topics[0]];
          else {
            event = this._eventTopicAbi[data.topics[0]];
          }
          ;
          let log = this.decode(event, data);
          let handler = this._eventHandler[data.address];
          if (handler)
            await handler(this, log);
          return log;
        }
        scanEvents(fromBlock, toBlock, topics, events, address) {
          let _web3 = this._web3;
          return new Promise(async (resolve, reject) => {
            try {
              let logs = await _web3.eth.getPastLogs({
                fromBlock,
                toBlock,
                address,
                topics: topics ? topics : null
              });
              let result = [];
              for (let i = 0; i < logs.length; i++) {
                let e = logs[i];
                result.push(await this.decodeEventData(e, events));
              }
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        }
        send(to, amount) {
          let _web3 = this._web3;
          let address = this.address;
          let self = this;
          return new Promise(async function(resolve, reject) {
            try {
              let value = _web3.utils.numberToHex(_web3.utils.toWei(amount.toString()));
              let result;
              if (self._account && self._account.privateKey || self.kms) {
                let nonce = await _web3.eth.getTransactionCount(address);
                let gas = await _web3.eth.estimateGas({
                  from: address,
                  nonce,
                  to,
                  value
                });
                let price = _web3.utils.numberToHex(await _web3.eth.getGasPrice());
                let tx = {
                  from: address,
                  nonce,
                  gasPrice: price,
                  gasLimit: gas,
                  gas,
                  to,
                  value
                };
                if (self.kms) {
                  let chainId = await self.getChainId();
                  let txHash = await self.kms.signTransaction(chainId, tx);
                  result = await _web3.eth.sendSignedTransaction(txHash);
                } else {
                  let signedTx = await _web3.eth.accounts.signTransaction(tx, self._account.privateKey);
                  result = await _web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                }
                resolve(result);
              } else {
                result = await _web3.eth.sendTransaction({ from: address, to, value: _web3.utils.toWei(amount.toString()).toString() });
                resolve(result);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
        setBlockTime(time) {
          return new Promise((resolve, reject) => {
            let method = time > 1e9 ? "evm_mine" : "evm_increaseTime";
            this._web3.currentProvider.send({
              jsonrpc: "2.0",
              method,
              params: [time],
              id: new Date().getTime()
            }, (err, result) => {
              if (err)
                return reject(err);
              if (method == "evm_mine") {
                return resolve(result);
              } else {
                this._web3.currentProvider.send({
                  jsonrpc: "2.0",
                  method: "evm_mine",
                  params: [],
                  id: new Date().getTime()
                }, (err2, result2) => {
                  if (err2)
                    return reject(err2);
                  return resolve(result2);
                });
              }
            });
          });
        }
        increaseBlockTime(value) {
          return new Promise((resolve, reject) => {
            this._web3.currentProvider.send({
              jsonrpc: "2.0",
              method: "evm_increaseTime",
              params: [value],
              id: new Date().getTime()
            }, (err, result) => {
              this._web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
              }, (err2, result2) => {
                resolve(result2);
              });
            });
          });
        }
        signMessage(msg) {
          let _web3 = this._web3;
          let address = this.address;
          let self = this;
          let currentProvider = this.provider;
          if (typeof window !== "undefined" && this.clientSideProvider) {
            this.provider = this.clientSideProvider.provider;
          }
          let promise = new Promise(async function(resolve, reject) {
            try {
              let result;
              if (self.kms) {
                result = await self.kms.signMessage(self.chainId, _web3.utils.stringToHex(msg));
                resolve(result);
              } else if (self._account && self._account.privateKey) {
                result = await _web3.eth.accounts.sign(msg, self._account.privateKey);
                resolve(result.signature);
              } else if (typeof window !== "undefined" && self.clientSideProvider) {
                result = await _web3.eth.personal.sign(msg, address, null);
                resolve(result);
              } else {
                result = await _web3.eth.sign(msg, address, null);
                resolve(result);
              }
            } catch (err) {
              reject(err);
            }
          });
          promise.finally(() => {
            this.provider = currentProvider;
          });
          return promise;
        }
        signTypedDataV4(data) {
          let self = this;
          let currentProvider = this.provider;
          let promise;
          if (typeof window !== "undefined" && this.clientSideProvider) {
            this.provider = this.clientSideProvider.provider;
            promise = new Promise(async (resolve, reject) => {
              try {
                self._web3.currentProvider.send({
                  jsonrpc: "2.0",
                  method: "eth_signTypedData_v4",
                  params: [
                    self.defaultAccount,
                    JSON.stringify(data)
                  ],
                  id: Date.now()
                }, function(err, result) {
                  if (err)
                    return reject(err);
                  if (result.error)
                    return reject(result.error);
                  let signature = result.result;
                  resolve(signature);
                });
              } catch (e) {
                reject(e);
              }
            });
            promise.finally(() => {
              this.provider = currentProvider;
            });
          } else {
            promise = new Promise(async (resolve, reject) => {
              try {
                let signature = signTypedDataWithPrivateKey({
                  privateKey: this._account.privateKey,
                  data,
                  version: SignTypedDataVersion.V4
                });
                resolve(signature);
              } catch (e) {
                reject(e);
              }
            });
          }
          return promise;
        }
        recoverTypedSignatureV4(data, signature) {
          let signer = recoverTypedSignature({
            signature,
            data,
            version: SignTypedDataVersion.V4
          });
          signer = this._web3.utils.toChecksumAddress(signer);
          return signer;
        }
        token(tokenAddress, decimals) {
          return new Erc20(this, tokenAddress, decimals);
        }
        async tokenInfo(tokenAddress) {
          let erc20 = this.token(tokenAddress);
          return {
            decimals: await erc20.decimals,
            name: await erc20.name,
            symbol: await erc20.symbol,
            totalSupply: await erc20.totalSupply
          };
        }
        get utils() {
          return this._utils;
        }
        verifyMessage(account, msg, signature) {
          let _web3 = this._web3;
          return new Promise(async function(resolve, reject) {
            try {
              let signing_address = await _web3.eth.accounts.recover(msg, signature);
              resolve(signing_address && account.toLowerCase() == signing_address.toLowerCase());
            } catch (err) {
              reject(err);
            }
            ;
          });
        }
        blockGasLimit() {
          return new Promise(async (resolve, reject) => {
            try {
              if (!this._gasLimit)
                this._gasLimit = (await this._web3.eth.getBlock("latest")).gasLimit;
              resolve(this._gasLimit);
            } catch (e) {
              reject(e);
            }
          });
        }
        getGasPrice() {
          return (async () => new import_bignumber5.BigNumber(await this._web3.eth.getGasPrice()))();
        }
        transactionCount() {
          return (async () => await this._web3.eth.getTransactionCount(this.address))();
        }
        async sendTransaction(transaction) {
          transaction.value = new import_bignumber5.BigNumber(transaction.value).toFixed();
          transaction.gasPrice = new import_bignumber5.BigNumber(transaction.gasPrice).toFixed();
          let currentProvider = this.provider;
          try {
            if (typeof window !== "undefined" && this.clientSideProvider) {
              this.provider = this.clientSideProvider.provider;
            }
            if (this._account && this._account.privateKey) {
              let signedTx = await this._web3.eth.accounts.signTransaction(transaction, this._account.privateKey);
              return await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            } else if (this._account && this._account.kms) {
              let chainId = await this.getChainId();
              let signedTx = await this.kms.signTransaction(chainId, transaction);
              return await this._web3.eth.sendSignedTransaction(signedTx);
            } else {
              let promiEvent = this._web3.eth.sendTransaction(transaction);
              promiEvent.on("error", (error) => {
                if (error.message.startsWith("Transaction was not mined within 50 blocks")) {
                  return;
                }
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(error);
              });
              promiEvent.on("transactionHash", (receipt) => {
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(null, receipt);
              });
              promiEvent.on("confirmation", (confNumber, receipt) => {
                if (this._sendTxEventHandler.confirmation && confNumber == 1)
                  this._sendTxEventHandler.confirmation(receipt);
              });
              return await promiEvent;
            }
          } catch (err) {
          }
          this.provider = currentProvider;
          return null;
        }
        async getTransaction(transactionHash) {
          let web3Receipt = await this._web3.eth.getTransaction(transactionHash);
          return {
            from: web3Receipt.from,
            to: web3Receipt.to,
            nonce: web3Receipt.nonce,
            gas: web3Receipt.gas,
            gasPrice: web3Receipt.gasPrice,
            data: web3Receipt.input,
            value: web3Receipt.value
          };
        }
        getTransactionReceipt(transactionHash) {
          return this._web3.eth.getTransactionReceipt(transactionHash);
        }
        call(transaction) {
          transaction.value = new import_bignumber5.BigNumber(transaction.value).toFixed();
          transaction.gasPrice = new import_bignumber5.BigNumber(transaction.gasPrice).toFixed();
          return this._web3.eth.call(transaction);
        }
        newContract(abi, address) {
          return new this._web3.eth.Contract(abi, address);
        }
        decodeErrorMessage(msg) {
          return this._web3.eth.abi.decodeParameter("string", "0x" + msg.substring(10));
        }
        async newBatchRequest() {
          return new Promise((resolve, reject) => {
            try {
              resolve({
                batch: new this._web3.BatchRequest(),
                promises: [],
                execute: (batch, promises) => {
                  batch.execute();
                  return Promise.all(promises);
                }
              });
            } catch (e) {
              reject(e);
            }
          });
        }
        soliditySha3(...val) {
          return this._web3.utils.soliditySha3(...val);
        }
        get web3() {
          return this._web3;
        }
      };
      let Wallet3 = _Wallet2;
      Wallet3.instance = new _Wallet2();
      _Wallet.Wallet = Wallet3;
    })(Wallet2 || (Wallet2 = {}));
    module2.exports = Wallet2;
  }
});

// src/index.ts
__export(exports, {
  BigNumber: () => import_bignumber4.BigNumber,
  Constants: () => constants_exports,
  Contract: () => import_contract2.Contract,
  Contracts: () => contracts_exports,
  Erc20: () => Erc20,
  Event: () => import_wallet.Event,
  IAccount: () => import_wallet.IAccount,
  IBatchRequestObj: () => import_wallet.IBatchRequestObj,
  IClientProviderOptions: () => import_wallet.IClientProviderOptions,
  INetwork: () => import_wallet.INetwork,
  ISendTxEventsOptions: () => import_wallet.ISendTxEventsOptions,
  IWallet: () => import_wallet.IWallet,
  IWalletUtils: () => import_wallet.IWalletUtils,
  MerkleTree: () => MerkleTree,
  Transaction: () => import_wallet.Transaction,
  TransactionReceipt: () => import_wallet.TransactionReceipt,
  Types: () => types_exports,
  Utils: () => utils_exports,
  Wallet: () => import_wallet.Wallet,
  WalletPlugin: () => import_wallet.WalletPlugin,
  WalletPluginConfig: () => import_wallet.WalletPluginConfig
});
var import_wallet = __toModule(require_wallet());
var import_contract2 = __toModule(require_contract());
var import_bignumber4 = __toModule(require("bignumber.js"));
init_erc20();
init_merkleTree();
init_utils();

// src/contracts/index.ts
var contracts_exports = {};
__export(contracts_exports, {
  ERC1155: () => ERC1155,
  ERC20: () => ERC20,
  ERC721: () => ERC721
});

// src/contracts/ERC1155/ERC1155.json.ts
var ERC1155_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "string", "name": "uri_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
  ],
  "bytecode": "60806040523480156200001157600080fd5b5060405162001d6438038062001d6483398101604081905262000034916200006e565b6200003f8162000046565b50620002a5565b6002620000548282620001d9565b5050565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156200008257600080fd5b82516001600160401b03808211156200009a57600080fd5b818501915085601f830112620000af57600080fd5b815181811115620000c457620000c462000058565b604051601f8201601f19908116603f01168101908382118183101715620000ef57620000ef62000058565b8160405282815288868487010111156200010857600080fd5b600093505b828410156200012c57848401860151818501870152928501926200010d565b828411156200013e5760008684830101525b98975050505050505050565b600181811c908216806200015f57607f821691505b6020821081036200018057634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001d457600081815260208120601f850160051c81016020861015620001af5750805b601f850160051c820191505b81811015620001d057828155600101620001bb565b5050505b505050565b81516001600160401b03811115620001f557620001f562000058565b6200020d816200020684546200014a565b8462000186565b602080601f8311600181146200024557600084156200022c5750858301515b600019600386901b1c1916600185901b178555620001d0565b600085815260208120601f198616915b82811015620002765788860151825594840194600190910190840162000255565b5085821015620002955787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b611aaf80620002b56000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461018657600080fd5b8062fdd58e1461008c57806301ffc9a7146100b25780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004611260565b610199565b6040519081526020015b60405180910390f35b6100c56100c03660046112bb565b610276565b60405190151581526020016100a9565b6100e86100e33660046112df565b61035b565b6040516100a99190611363565b610108610103366004611517565b6103ef565b005b61011d6101183660046115c1565b6104b8565b6040516100a991906116c7565b6101086101383660046116da565b610610565b6100c561014b366004611716565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205460ff1690565b610108610194366004611749565b61061f565b600073ffffffffffffffffffffffffffffffffffffffff8316610243576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b5060009081526020818152604080832073ffffffffffffffffffffffffffffffffffffffff949094168352929052205490565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061030957507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061035557507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b60606002805461036a906117ae565b80601f0160208091040260200160405190810160405280929190818152602001828054610396906117ae565b80156103e35780601f106103b8576101008083540402835291602001916103e3565b820191906000526020600020905b8154815290600101906020018083116103c657829003601f168201915b50505050509050919050565b73ffffffffffffffffffffffffffffffffffffffff85163314806104185750610418853361014b565b6104a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206e6f7220617070726f7665640000000000000000000000000000000000606482015260840161023a565b6104b185858585856106e1565b5050505050565b6060815183511461054b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d617463680000000000000000000000000000000000000000000000606482015260840161023a565b6000835167ffffffffffffffff81111561056757610567611376565b604051908082528060200260200182016040528015610590578160200160208202803683370190505b50905060005b8451811015610608576105db8582815181106105b4576105b4611801565b60200260200101518583815181106105ce576105ce611801565b6020026020010151610199565b8282815181106105ed576105ed611801565b60209081029190910101526106018161185f565b9050610596565b509392505050565b61061b338383610a1b565b5050565b73ffffffffffffffffffffffffffffffffffffffff85163314806106485750610648853361014b565b6106d4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206e6f7220617070726f7665640000000000000000000000000000000000606482015260840161023a565b6104b18585858585610b6e565b8151835114610772576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161023a565b73ffffffffffffffffffffffffffffffffffffffff8416610815576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161023a565b3360005b845181101561098657600085828151811061083657610836611801565b60200260200101519050600085838151811061085457610854611801565b6020908102919091018101516000848152808352604080822073ffffffffffffffffffffffffffffffffffffffff8e168352909352919091205490915081811015610921576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161023a565b60008381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8e8116855292528083208585039055908b1682528120805484929061096b908490611897565b925050819055505050508061097f9061185f565b9050610819565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516109fd9291906118af565b60405180910390a4610a13818787878787610dac565b505050505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ad6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c660000000000000000000000000000000000000000000000606482015260840161023a565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8416610c11576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161023a565b336000610c1d8561103f565b90506000610c2a8561103f565b905060008681526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8c16845290915290205485811015610cea576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161023a565b60008781526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8d8116855292528083208985039055908a16825281208054889290610d34908490611897565b9091555050604080518881526020810188905273ffffffffffffffffffffffffffffffffffffffff808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610da1848a8a8a8a8a61108a565b505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610a13576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c8190610e2390899089908890889088906004016118dd565b6020604051808303816000875af1925050508015610e7c575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252610e7991810190611948565b60015b610f6557610e88611965565b806308c379a003610edb5750610e9c611981565b80610ea75750610edd565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161023a9190611363565b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e204552433131353560448201527f526563656976657220696d706c656d656e746572000000000000000000000000606482015260840161023a565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014611036576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161023a565b50505050505050565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061107957611079611801565b602090810291909101015292915050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610a13576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e61906111019089908990889088908890600401611a29565b6020604051808303816000875af192505050801561115a575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261115791810190611948565b60015b61116657610e88611965565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014611036576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161023a565b803573ffffffffffffffffffffffffffffffffffffffff8116811461125b57600080fd5b919050565b6000806040838503121561127357600080fd5b61127c83611237565b946020939093013593505050565b7fffffffff00000000000000000000000000000000000000000000000000000000811681146112b857600080fd5b50565b6000602082840312156112cd57600080fd5b81356112d88161128a565b9392505050565b6000602082840312156112f157600080fd5b5035919050565b6000815180845260005b8181101561131e57602081850181015186830182015201611302565b81811115611330576000602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006112d860208301846112f8565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff821117156113e9576113e9611376565b6040525050565b600067ffffffffffffffff82111561140a5761140a611376565b5060051b60200190565b600082601f83011261142557600080fd5b81356020611432826113f0565b60405161143f82826113a5565b83815260059390931b850182019282810191508684111561145f57600080fd5b8286015b8481101561147a5780358352918301918301611463565b509695505050505050565b600082601f83011261149657600080fd5b813567ffffffffffffffff8111156114b0576114b0611376565b6040516114e560207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f85011601826113a5565b8181528460208386010111156114fa57600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a0868803121561152f57600080fd5b61153886611237565b945061154660208701611237565b9350604086013567ffffffffffffffff8082111561156357600080fd5b61156f89838a01611414565b9450606088013591508082111561158557600080fd5b61159189838a01611414565b935060808801359150808211156115a757600080fd5b506115b488828901611485565b9150509295509295909350565b600080604083850312156115d457600080fd5b823567ffffffffffffffff808211156115ec57600080fd5b818501915085601f83011261160057600080fd5b8135602061160d826113f0565b60405161161a82826113a5565b83815260059390931b850182019282810191508984111561163a57600080fd5b948201945b8386101561165f5761165086611237565b8252948201949082019061163f565b9650508601359250508082111561167557600080fd5b5061168285828601611414565b9150509250929050565b600081518084526020808501945080840160005b838110156116bc578151875295820195908201906001016116a0565b509495945050505050565b6020815260006112d8602083018461168c565b600080604083850312156116ed57600080fd5b6116f683611237565b91506020830135801515811461170b57600080fd5b809150509250929050565b6000806040838503121561172957600080fd5b61173283611237565b915061174060208401611237565b90509250929050565b600080600080600060a0868803121561176157600080fd5b61176a86611237565b945061177860208701611237565b93506040860135925060608601359150608086013567ffffffffffffffff8111156117a257600080fd5b6115b488828901611485565b600181811c908216806117c257607f821691505b6020821081036117fb577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361189057611890611830565b5060010190565b600082198211156118aa576118aa611830565b500190565b6040815260006118c2604083018561168c565b82810360208401526118d4818561168c565b95945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a0604083015261191660a083018661168c565b8281036060840152611928818661168c565b9050828103608084015261193c81856112f8565b98975050505050505050565b60006020828403121561195a57600080fd5b81516112d88161128a565b600060033d111561197e5760046000803e5060005160e01c5b90565b600060443d101561198f5790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff81602484011181841117156119dd57505050505090565b82850191508151818111156119f55750505050505090565b843d8701016020828501011115611a0f5750505050505090565b611a1e602082860101876113a5565b509095945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a06080830152611a6e60a08301846112f8565b97965050505050505056fea2646970667358221220629d19ed81833c600194ef6c914026aeb7d943acc5b7583bd9b04634d6745b5064736f6c634300080f0033"
};

// src/contracts/ERC1155/ERC1155.ts
var ERC1155 = class extends import_contract2.Contract {
  constructor(wallet, address) {
    super(wallet, address, ERC1155_json_default.abi, ERC1155_json_default.bytecode);
    this.assign();
  }
  deploy(uri) {
    return this.__deploy([uri]);
  }
  parseApprovalForAllEvent(receipt) {
    return this.parseEvents(receipt, "ApprovalForAll").map((e) => this.decodeApprovalForAllEvent(e));
  }
  decodeApprovalForAllEvent(event) {
    let result = event.data;
    return {
      account: result.account,
      operator: result.operator,
      approved: result.approved,
      _event: event
    };
  }
  parseTransferBatchEvent(receipt) {
    return this.parseEvents(receipt, "TransferBatch").map((e) => this.decodeTransferBatchEvent(e));
  }
  decodeTransferBatchEvent(event) {
    let result = event.data;
    return {
      operator: result.operator,
      from: result.from,
      to: result.to,
      ids: result.ids.map((e) => new import_bignumber4.BigNumber(e)),
      values: result.values.map((e) => new import_bignumber4.BigNumber(e)),
      _event: event
    };
  }
  parseTransferSingleEvent(receipt) {
    return this.parseEvents(receipt, "TransferSingle").map((e) => this.decodeTransferSingleEvent(e));
  }
  decodeTransferSingleEvent(event) {
    let result = event.data;
    return {
      operator: result.operator,
      from: result.from,
      to: result.to,
      id: new import_bignumber4.BigNumber(result.id),
      value: new import_bignumber4.BigNumber(result.value),
      _event: event
    };
  }
  parseURIEvent(receipt) {
    return this.parseEvents(receipt, "URI").map((e) => this.decodeURIEvent(e));
  }
  decodeURIEvent(event) {
    let result = event.data;
    return {
      value: result.value,
      id: new import_bignumber4.BigNumber(result.id),
      _event: event
    };
  }
  assign() {
    let balanceOfParams = (params) => [params.account, utils_exports.toString(params.id)];
    let balanceOf_call = async (params) => {
      let result = await this.call("balanceOf", balanceOfParams(params));
      return new import_bignumber4.BigNumber(result);
    };
    this.balanceOf = balanceOf_call;
    let balanceOfBatchParams = (params) => [params.accounts, utils_exports.toString(params.ids)];
    let balanceOfBatch_call = async (params) => {
      let result = await this.call("balanceOfBatch", balanceOfBatchParams(params));
      return result.map((e) => new import_bignumber4.BigNumber(e));
    };
    this.balanceOfBatch = balanceOfBatch_call;
    let isApprovedForAllParams = (params) => [params.account, params.operator];
    let isApprovedForAll_call = async (params) => {
      let result = await this.call("isApprovedForAll", isApprovedForAllParams(params));
      return result;
    };
    this.isApprovedForAll = isApprovedForAll_call;
    let supportsInterface_call = async (interfaceId) => {
      let result = await this.call("supportsInterface", [interfaceId]);
      return result;
    };
    this.supportsInterface = supportsInterface_call;
    let uri_call = async (param1) => {
      let result = await this.call("uri", [utils_exports.toString(param1)]);
      return result;
    };
    this.uri = uri_call;
    let safeBatchTransferFromParams = (params) => [params.from, params.to, utils_exports.toString(params.ids), utils_exports.toString(params.amounts), utils_exports.stringToBytes(params.data)];
    let safeBatchTransferFrom_send = async (params) => {
      let result = await this.send("safeBatchTransferFrom", safeBatchTransferFromParams(params));
      return result;
    };
    let safeBatchTransferFrom_call = async (params) => {
      let result = await this.call("safeBatchTransferFrom", safeBatchTransferFromParams(params));
      return;
    };
    this.safeBatchTransferFrom = Object.assign(safeBatchTransferFrom_send, {
      call: safeBatchTransferFrom_call
    });
    let safeTransferFromParams = (params) => [params.from, params.to, utils_exports.toString(params.id), utils_exports.toString(params.amount), utils_exports.stringToBytes(params.data)];
    let safeTransferFrom_send = async (params) => {
      let result = await this.send("safeTransferFrom", safeTransferFromParams(params));
      return result;
    };
    let safeTransferFrom_call = async (params) => {
      let result = await this.call("safeTransferFrom", safeTransferFromParams(params));
      return;
    };
    this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
      call: safeTransferFrom_call
    });
    let setApprovalForAllParams = (params) => [params.operator, params.approved];
    let setApprovalForAll_send = async (params) => {
      let result = await this.send("setApprovalForAll", setApprovalForAllParams(params));
      return result;
    };
    let setApprovalForAll_call = async (params) => {
      let result = await this.call("setApprovalForAll", setApprovalForAllParams(params));
      return;
    };
    this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
      call: setApprovalForAll_call
    });
  }
};

// src/contracts/ERC20/ERC20.json.ts
var ERC20_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
  ],
  "bytecode": "60806040523480156200001157600080fd5b5060405162000e6538038062000e65833981016040819052620000349162000127565b600362000042838262000220565b50600462000051828262000220565b505050620002ec565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008257600080fd5b81516001600160401b03808211156200009f576200009f6200005a565b604051601f8301601f19908116603f01168101908282118183101715620000ca57620000ca6200005a565b81604052838152602092508683858801011115620000e757600080fd5b600091505b838210156200010b5785820183015181830184015290820190620000ec565b838211156200011d5760008385830101525b9695505050505050565b600080604083850312156200013b57600080fd5b82516001600160401b03808211156200015357600080fd5b620001618683870162000070565b935060208501519150808211156200017857600080fd5b50620001878582860162000070565b9150509250929050565b600181811c90821680620001a657607f821691505b602082108103620001c757634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021b57600081815260208120601f850160051c81016020861015620001f65750805b601f850160051c820191505b81811015620002175782815560010162000202565b5050505b505050565b81516001600160401b038111156200023c576200023c6200005a565b62000254816200024d845462000191565b84620001cd565b602080601f8311600181146200028c5760008415620002735750858301515b600019600386901b1c1916600185901b17855562000217565b600085815260208120601f198616915b82811015620002bd578886015182559484019460019091019084016200029c565b5085821015620002dc5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610b6980620002fc6000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c80633950935111610081578063a457c2d71161005b578063a457c2d714610194578063a9059cbb146101a7578063dd62ed3e146101ba57600080fd5b8063395093511461014357806370a082311461015657806395d89b411461018c57600080fd5b806318160ddd116100b257806318160ddd1461010f57806323b872dd14610121578063313ce5671461013457600080fd5b806306fdde03146100ce578063095ea7b3146100ec575b600080fd5b6100d6610200565b6040516100e3919061094a565b60405180910390f35b6100ff6100fa3660046109e6565b610292565b60405190151581526020016100e3565b6002545b6040519081526020016100e3565b6100ff61012f366004610a10565b6102aa565b604051601281526020016100e3565b6100ff6101513660046109e6565b6102ce565b610113610164366004610a4c565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6100d661031a565b6100ff6101a23660046109e6565b610329565b6100ff6101b53660046109e6565b6103ff565b6101136101c8366004610a6e565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461020f90610aa1565b80601f016020809104026020016040519081016040528092919081815260200182805461023b90610aa1565b80156102885780601f1061025d57610100808354040283529160200191610288565b820191906000526020600020905b81548152906001019060200180831161026b57829003601f168201915b5050505050905090565b6000336102a081858561040d565b5060019392505050565b6000336102b88582856105c0565b6102c3858585610697565b506001949350505050565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff871684529091528120549091906102a09082908690610315908790610af4565b61040d565b60606004805461020f90610aa1565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168452909152812054909190838110156103f2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6102c3828686840361040d565b6000336102a0818585610697565b73ffffffffffffffffffffffffffffffffffffffff83166104af576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016103e9565b73ffffffffffffffffffffffffffffffffffffffff8216610552576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016103e9565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146106915781811015610684576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103e9565b610691848484840361040d565b50505050565b73ffffffffffffffffffffffffffffffffffffffff831661073a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016103e9565b73ffffffffffffffffffffffffffffffffffffffff82166107dd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016103e9565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610893576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016103e9565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082208585039055918516815290812080548492906108d7908490610af4565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161093d91815260200190565b60405180910390a3610691565b600060208083528351808285015260005b818110156109775785810183015185820160400152820161095b565b81811115610989576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146109e157600080fd5b919050565b600080604083850312156109f957600080fd5b610a02836109bd565b946020939093013593505050565b600080600060608486031215610a2557600080fd5b610a2e846109bd565b9250610a3c602085016109bd565b9150604084013590509250925092565b600060208284031215610a5e57600080fd5b610a67826109bd565b9392505050565b60008060408385031215610a8157600080fd5b610a8a836109bd565b9150610a98602084016109bd565b90509250929050565b600181811c90821680610ab557607f821691505b602082108103610aee577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60008219821115610b2e577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b50019056fea26469706673582212207def247031a1cdda9a4e03414ee7eb938ec3094aae4edaf07b4f9575cda80a2364736f6c634300080f0033"
};

// src/contracts/ERC20/ERC20.ts
var ERC20 = class extends import_contract2.Contract {
  constructor(wallet, address) {
    super(wallet, address, ERC20_json_default.abi, ERC20_json_default.bytecode);
    this.assign();
  }
  deploy(params) {
    return this.__deploy([params.name, params.symbol]);
  }
  parseApprovalEvent(receipt) {
    return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
  }
  decodeApprovalEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      spender: result.spender,
      value: new import_bignumber4.BigNumber(result.value),
      _event: event
    };
  }
  parseTransferEvent(receipt) {
    return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
  }
  decodeTransferEvent(event) {
    let result = event.data;
    return {
      from: result.from,
      to: result.to,
      value: new import_bignumber4.BigNumber(result.value),
      _event: event
    };
  }
  assign() {
    let allowanceParams = (params) => [params.owner, params.spender];
    let allowance_call = async (params) => {
      let result = await this.call("allowance", allowanceParams(params));
      return new import_bignumber4.BigNumber(result);
    };
    this.allowance = allowance_call;
    let balanceOf_call = async (account) => {
      let result = await this.call("balanceOf", [account]);
      return new import_bignumber4.BigNumber(result);
    };
    this.balanceOf = balanceOf_call;
    let decimals_call = async () => {
      let result = await this.call("decimals");
      return new import_bignumber4.BigNumber(result);
    };
    this.decimals = decimals_call;
    let name_call = async () => {
      let result = await this.call("name");
      return result;
    };
    this.name = name_call;
    let symbol_call = async () => {
      let result = await this.call("symbol");
      return result;
    };
    this.symbol = symbol_call;
    let totalSupply_call = async () => {
      let result = await this.call("totalSupply");
      return new import_bignumber4.BigNumber(result);
    };
    this.totalSupply = totalSupply_call;
    let approveParams = (params) => [params.spender, utils_exports.toString(params.amount)];
    let approve_send = async (params) => {
      let result = await this.send("approve", approveParams(params));
      return result;
    };
    let approve_call = async (params) => {
      let result = await this.call("approve", approveParams(params));
      return result;
    };
    this.approve = Object.assign(approve_send, {
      call: approve_call
    });
    let decreaseAllowanceParams = (params) => [params.spender, utils_exports.toString(params.subtractedValue)];
    let decreaseAllowance_send = async (params) => {
      let result = await this.send("decreaseAllowance", decreaseAllowanceParams(params));
      return result;
    };
    let decreaseAllowance_call = async (params) => {
      let result = await this.call("decreaseAllowance", decreaseAllowanceParams(params));
      return result;
    };
    this.decreaseAllowance = Object.assign(decreaseAllowance_send, {
      call: decreaseAllowance_call
    });
    let increaseAllowanceParams = (params) => [params.spender, utils_exports.toString(params.addedValue)];
    let increaseAllowance_send = async (params) => {
      let result = await this.send("increaseAllowance", increaseAllowanceParams(params));
      return result;
    };
    let increaseAllowance_call = async (params) => {
      let result = await this.call("increaseAllowance", increaseAllowanceParams(params));
      return result;
    };
    this.increaseAllowance = Object.assign(increaseAllowance_send, {
      call: increaseAllowance_call
    });
    let transferParams = (params) => [params.to, utils_exports.toString(params.amount)];
    let transfer_send = async (params) => {
      let result = await this.send("transfer", transferParams(params));
      return result;
    };
    let transfer_call = async (params) => {
      let result = await this.call("transfer", transferParams(params));
      return result;
    };
    this.transfer = Object.assign(transfer_send, {
      call: transfer_call
    });
    let transferFromParams = (params) => [params.from, params.to, utils_exports.toString(params.amount)];
    let transferFrom_send = async (params) => {
      let result = await this.send("transferFrom", transferFromParams(params));
      return result;
    };
    let transferFrom_call = async (params) => {
      let result = await this.call("transferFrom", transferFromParams(params));
      return result;
    };
    this.transferFrom = Object.assign(transferFrom_send, {
      call: transferFrom_call
    });
  }
};

// src/contracts/ERC721/ERC721.json.ts
var ERC721_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
  ],
  "bytecode": "60806040523480156200001157600080fd5b5060405162001a9038038062001a90833981016040819052620000349162000127565b600062000042838262000220565b50600162000051828262000220565b505050620002ec565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008257600080fd5b81516001600160401b03808211156200009f576200009f6200005a565b604051601f8301601f19908116603f01168101908282118183101715620000ca57620000ca6200005a565b81604052838152602092508683858801011115620000e757600080fd5b600091505b838210156200010b5785820183015181830184015290820190620000ec565b838211156200011d5760008385830101525b9695505050505050565b600080604083850312156200013b57600080fd5b82516001600160401b03808211156200015357600080fd5b620001618683870162000070565b935060208501519150808211156200017857600080fd5b50620001878582860162000070565b9150509250929050565b600181811c90821680620001a657607f821691505b602082108103620001c757634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021b57600081815260208120601f850160051c81016020861015620001f65750805b601f850160051c820191505b81811015620002175782815560010162000202565b5050505b505050565b81516001600160401b038111156200023c576200023c6200005a565b62000254816200024d845462000191565b84620001cd565b602080601f8311600181146200028c5760008415620002735750858301515b600019600386901b1c1916600185901b17855562000217565b600085815260208120601f198616915b82811015620002bd578886015182559484019460019091019084016200029c565b5085821015620002dc5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61179480620002fc6000396000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101d0578063b88d4fde146101e3578063c87b56dd146101f6578063e985e9c51461020957600080fd5b80636352211e1461019457806370a08231146101a757806395d89b41146101c857600080fd5b8063095ea7b3116100bd578063095ea7b31461015957806323b872dd1461016e57806342842e0e1461018157600080fd5b806301ffc9a7146100e457806306fdde031461010c578063081812fc14610121575b600080fd5b6100f76100f2366004611259565b610252565b60405190151581526020015b60405180910390f35b610114610337565b60405161010391906112ec565b61013461012f3660046112ff565b6103c9565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610103565b61016c610167366004611341565b6103fd565b005b61016c61017c36600461136b565b61058e565b61016c61018f36600461136b565b61062f565b6101346101a23660046112ff565b61064a565b6101ba6101b53660046113a7565b6106d6565b604051908152602001610103565b6101146107a4565b61016c6101de3660046113c2565b6107b3565b61016c6101f136600461142d565b6107c2565b6101146102043660046112ff565b61086a565b6100f7610217366004611527565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260056020908152604080832093909416825291909152205460ff1690565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f80ac58cd0000000000000000000000000000000000000000000000000000000014806102e557507fffffffff0000000000000000000000000000000000000000000000000000000082167f5b5e139f00000000000000000000000000000000000000000000000000000000145b8061033157507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b6060600080546103469061155a565b80601f01602080910402602001604051908101604052809291908181526020018280546103729061155a565b80156103bf5780601f10610394576101008083540402835291602001916103bf565b820191906000526020600020905b8154815290600101906020018083116103a257829003601f168201915b5050505050905090565b60006103d4826108de565b5060009081526004602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b60006104088261064a565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036104ca576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff821614806104f357506104f38133610217565b61057f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c000060648201526084016104c1565b610589838361096c565b505050565b6105983382610a0c565b610624576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206e6f7220617070726f76656400000000000000000000000000000000000060648201526084016104c1565b610589838383610acc565b610589838383604051806020016040528060008152506107c2565b60008181526002602052604081205473ffffffffffffffffffffffffffffffffffffffff1680610331576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e204944000000000000000060448201526064016104c1565b600073ffffffffffffffffffffffffffffffffffffffff821661077b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f74206120766160448201527f6c6964206f776e6572000000000000000000000000000000000000000000000060648201526084016104c1565b5073ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b6060600180546103469061155a565b6107be338383610d33565b5050565b6107cc3383610a0c565b610858576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206e6f7220617070726f76656400000000000000000000000000000000000060648201526084016104c1565b61086484848484610e60565b50505050565b6060610875826108de565b600061088c60408051602081019091526000815290565b905060008151116108ac57604051806020016040528060008152506108d7565b806108b684610f03565b6040516020016108c79291906115ad565b6040516020818303038152906040525b9392505050565b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff16610969576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e204944000000000000000060448201526064016104c1565b50565b600081815260046020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff841690811790915581906109c68261064a565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610a188361064a565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610a86575073ffffffffffffffffffffffffffffffffffffffff80821660009081526005602090815260408083209388168352929052205460ff165b80610ac457508373ffffffffffffffffffffffffffffffffffffffff16610aac846103c9565b73ffffffffffffffffffffffffffffffffffffffff16145b949350505050565b8273ffffffffffffffffffffffffffffffffffffffff16610aec8261064a565b73ffffffffffffffffffffffffffffffffffffffff1614610b8f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e657200000000000000000000000000000000000000000000000000000060648201526084016104c1565b73ffffffffffffffffffffffffffffffffffffffff8216610c31576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016104c1565b610c3c60008261096c565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600360205260408120805460019290610c7290849061160b565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260408120805460019290610cad908490611622565b909155505060008181526002602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff86811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610dc8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104c1565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526005602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610e6b848484610acc565b610e7784848484611038565b610864576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104c1565b606081600003610f4657505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b8115610f705780610f5a8161163a565b9150610f699050600a836116a1565b9150610f4a565b60008167ffffffffffffffff811115610f8b57610f8b6113fe565b6040519080825280601f01601f191660200182016040528015610fb5576020820181803683370190505b5090505b8415610ac457610fca60018361160b565b9150610fd7600a866116b5565b610fe2906030611622565b60f81b818381518110610ff757610ff76116c9565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350611031600a866116a1565b9450610fb9565b600073ffffffffffffffffffffffffffffffffffffffff84163b15611220576040517f150b7a0200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063150b7a02906110af9033908990889088906004016116f8565b6020604051808303816000875af1925050508015611108575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261110591810190611741565b60015b6111d5573d808015611136576040519150601f19603f3d011682016040523d82523d6000602084013e61113b565b606091505b5080516000036111cd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104c1565b805181602001fd5b7fffffffff00000000000000000000000000000000000000000000000000000000167f150b7a0200000000000000000000000000000000000000000000000000000000149050610ac4565b506001949350505050565b7fffffffff000000000000000000000000000000000000000000000000000000008116811461096957600080fd5b60006020828403121561126b57600080fd5b81356108d78161122b565b60005b83811015611291578181015183820152602001611279565b838111156108645750506000910152565b600081518084526112ba816020860160208601611276565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006108d760208301846112a2565b60006020828403121561131157600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461133c57600080fd5b919050565b6000806040838503121561135457600080fd5b61135d83611318565b946020939093013593505050565b60008060006060848603121561138057600080fd5b61138984611318565b925061139760208501611318565b9150604084013590509250925092565b6000602082840312156113b957600080fd5b6108d782611318565b600080604083850312156113d557600080fd5b6113de83611318565b9150602083013580151581146113f357600080fd5b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806000806080858703121561144357600080fd5b61144c85611318565b935061145a60208601611318565b925060408501359150606085013567ffffffffffffffff8082111561147e57600080fd5b818701915087601f83011261149257600080fd5b8135818111156114a4576114a46113fe565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156114ea576114ea6113fe565b816040528281528a602084870101111561150357600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561153a57600080fd5b61154383611318565b915061155160208401611318565b90509250929050565b600181811c9082168061156e57607f821691505b6020821081036115a7577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b600083516115bf818460208801611276565b8351908301906115d3818360208801611276565b01949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008282101561161d5761161d6115dc565b500390565b60008219821115611635576116356115dc565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361166b5761166b6115dc565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000826116b0576116b0611672565b500490565b6000826116c4576116c4611672565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600073ffffffffffffffffffffffffffffffffffffffff80871683528086166020840152508360408301526080606083015261173760808301846112a2565b9695505050505050565b60006020828403121561175357600080fd5b81516108d78161122b56fea2646970667358221220ee2295c3ad60cd48e653b95089ae2d2009df4cdeb8d907c5ef8265d97f5a0a9d64736f6c634300080f0033"
};

// src/contracts/ERC721/ERC721.ts
var ERC721 = class extends import_contract2.Contract {
  constructor(wallet, address) {
    super(wallet, address, ERC721_json_default.abi, ERC721_json_default.bytecode);
    this.assign();
  }
  deploy(params) {
    return this.__deploy([params.name, params.symbol]);
  }
  parseApprovalEvent(receipt) {
    return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
  }
  decodeApprovalEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      approved: result.approved,
      tokenId: new import_bignumber4.BigNumber(result.tokenId),
      _event: event
    };
  }
  parseApprovalForAllEvent(receipt) {
    return this.parseEvents(receipt, "ApprovalForAll").map((e) => this.decodeApprovalForAllEvent(e));
  }
  decodeApprovalForAllEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      operator: result.operator,
      approved: result.approved,
      _event: event
    };
  }
  parseTransferEvent(receipt) {
    return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
  }
  decodeTransferEvent(event) {
    let result = event.data;
    return {
      from: result.from,
      to: result.to,
      tokenId: new import_bignumber4.BigNumber(result.tokenId),
      _event: event
    };
  }
  assign() {
    let balanceOf_call = async (owner) => {
      let result = await this.call("balanceOf", [owner]);
      return new import_bignumber4.BigNumber(result);
    };
    this.balanceOf = balanceOf_call;
    let getApproved_call = async (tokenId) => {
      let result = await this.call("getApproved", [utils_exports.toString(tokenId)]);
      return result;
    };
    this.getApproved = getApproved_call;
    let isApprovedForAllParams = (params) => [params.owner, params.operator];
    let isApprovedForAll_call = async (params) => {
      let result = await this.call("isApprovedForAll", isApprovedForAllParams(params));
      return result;
    };
    this.isApprovedForAll = isApprovedForAll_call;
    let name_call = async () => {
      let result = await this.call("name");
      return result;
    };
    this.name = name_call;
    let ownerOf_call = async (tokenId) => {
      let result = await this.call("ownerOf", [utils_exports.toString(tokenId)]);
      return result;
    };
    this.ownerOf = ownerOf_call;
    let supportsInterface_call = async (interfaceId) => {
      let result = await this.call("supportsInterface", [interfaceId]);
      return result;
    };
    this.supportsInterface = supportsInterface_call;
    let symbol_call = async () => {
      let result = await this.call("symbol");
      return result;
    };
    this.symbol = symbol_call;
    let tokenURI_call = async (tokenId) => {
      let result = await this.call("tokenURI", [utils_exports.toString(tokenId)]);
      return result;
    };
    this.tokenURI = tokenURI_call;
    let approveParams = (params) => [params.to, utils_exports.toString(params.tokenId)];
    let approve_send = async (params) => {
      let result = await this.send("approve", approveParams(params));
      return result;
    };
    let approve_call = async (params) => {
      let result = await this.call("approve", approveParams(params));
      return;
    };
    this.approve = Object.assign(approve_send, {
      call: approve_call
    });
    let safeTransferFromParams = (params) => [params.from, params.to, utils_exports.toString(params.tokenId)];
    let safeTransferFrom_send = async (params) => {
      let result = await this.send("safeTransferFrom", safeTransferFromParams(params));
      return result;
    };
    let safeTransferFrom_call = async (params) => {
      let result = await this.call("safeTransferFrom", safeTransferFromParams(params));
      return;
    };
    this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
      call: safeTransferFrom_call
    });
    let safeTransferFrom_1Params = (params) => [params.from, params.to, utils_exports.toString(params.tokenId), utils_exports.stringToBytes(params.data)];
    let safeTransferFrom_1_send = async (params) => {
      let result = await this.send("safeTransferFrom", safeTransferFromParams(params));
      return result;
    };
    let safeTransferFrom_1_call = async (params) => {
      let result = await this.call("safeTransferFrom", safeTransferFromParams(params));
      return;
    };
    this.safeTransferFrom_1 = Object.assign(safeTransferFrom_1_send, {
      call: safeTransferFrom_1_call
    });
    let setApprovalForAllParams = (params) => [params.operator, params.approved];
    let setApprovalForAll_send = async (params) => {
      let result = await this.send("setApprovalForAll", setApprovalForAllParams(params));
      return result;
    };
    let setApprovalForAll_call = async (params) => {
      let result = await this.call("setApprovalForAll", setApprovalForAllParams(params));
      return;
    };
    this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
      call: setApprovalForAll_call
    });
    let transferFromParams = (params) => [params.from, params.to, utils_exports.toString(params.tokenId)];
    let transferFrom_send = async (params) => {
      let result = await this.send("transferFrom", transferFromParams(params));
      return result;
    };
    let transferFrom_call = async (params) => {
      let result = await this.call("transferFrom", transferFromParams(params));
      return;
    };
    this.transferFrom = Object.assign(transferFrom_send, {
      call: transferFrom_call
    });
  }
};

// src/index.ts
init_types();
init_constants();
/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual AGPLv3/commercial license
* https://ijs.network
*-----------------------------------------------------------*/

});