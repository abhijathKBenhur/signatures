const Web3 = require("web3");
const contractJSON = require("../../client/src/contracts/ideaTribe.json");
const contractJTestSON = require("../../client/src/contracts/ideaTribe_test.json");
const tribeGoldJSON = require("../../client/src/contracts/tribeGold.json");
const tribeGoldTestJSON = require("../../client/src/contracts/tribeGold_test.json");
const goldTreasurerKey = process.env.TRIBE_GOLD_TREASURER;
const maticTreasurerKey = process.env.MATIC_TREASURER;
const programmerKey = process.env.PROGRAMMER_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _ = require("lodash");
let hdWallet = new HDWalletProvider({
  privateKeys: [programmerKey, goldTreasurerKey, maticTreasurerKey],
  providerOrUrl: process.env.NETWORK_URL,
  pollingInterval: 2000000,
  networkCheckTimeout: 2000000,
});
const web3Instance = new Web3(hdWallet);

const ideaTribeContract = new web3Instance.eth.Contract(
  process.env.CHAIN_ENV == "mainnet" ? contractJSON.abi : contractJTestSON.abi,
  process.env.CHAIN_ENV == "mainnet"
    ? contractJSON.address
    : contractJTestSON.address
);

const tribeGoldContract = new web3Instance.eth.Contract(
  process.env.CHAIN_ENV == "mainnet"
    ? tribeGoldJSON.abi
    : tribeGoldTestJSON.abi,
  process.env.CHAIN_ENV == "mainnet"
    ? tribeGoldJSON.address
    : tribeGoldTestJSON.address
);

const getDedicatedGoldContract = (fromAddress) => {
  let dedicatedInstance = new Web3(
    new HDWalletProvider({
      privateKeys: [fromAddress.pKey],
      providerOrUrl: process.env.NETWORK_URL,
      pollingInterval: 2000000,
      networkCheckTimeout: 2000000,
    })
  )
  return new dedicatedInstance.eth.Contract(
    process.env.CHAIN_ENV == "mainnet"
      ? tribeGoldJSON.abi
      : tribeGoldTestJSON.abi,
    process.env.CHAIN_ENV == "mainnet"
      ? tribeGoldJSON.address
      : tribeGoldTestJSON.address
  )
};

module.exports = {
  ideaTribeContract,
  tribeGoldContract,
  web3Instance,
  getDedicatedGoldContract,
};
