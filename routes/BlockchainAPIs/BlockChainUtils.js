const Web3 = require("web3");
const contractJSON = require("../../client/src/contracts/ideaTribe.json");
const tribeGoldJSON = require("../../client/src/contracts/tribeGold.json");
const privateKey = process.env.TRIBE_GOLD_TREASURER;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _ = require("lodash");
let hdWallet = new HDWalletProvider({
  privateKeys: [privateKey],
  providerOrUrl: process.env.NETWORK_URL,
  pollingInterval: 2000000,
});
const web3Instance = new Web3(hdWallet);
const publicKey =
  web3Instance.eth.accounts.privateKeyToAccount(privateKey).address;

  const ideaTribeContract = new web3Instance.eth.Contract(
    contractJSON.abi,
    contractJSON.address,
    {
      gas: 3000000,
    }
  );

  const tribeGoldContract = new web3Instance.eth.Contract(
    tribeGoldJSON.abi,
    tribeGoldJSON.address,
    {
      gas: 3000000,
    }
  );

module.exports = {
  ideaTribeContract,
  tribeGoldContract,
  publicKey,
  web3Instance,
};
