//#region > Imports
// Request is designed to be the simplest way possible to make http calls
const request = require("request");
const { Miner } = require("web3-eth-miner");
//#endregion

const options = {
  defaultAccount: "0x4787660f86aa2AE3221399dfdf5a64A00B3420A1",
  defaultBlock: "genesis",
  defaultGas: 1,
  defaultGasPrice: 0,
  transactionBlockTimeout: 50,
  transactionConfirmationBlocks: 24,
  transactionPollingTimeout: 480,
};

//#region > Functions
// Get all foos
function initMiner() {
  // https://web3js.readthedocs.io/en/v2.0.0-alpha/web3-eth-miner.html#startmining
  new Miner("http://localhost:8545", null, options).startMining();
}
//#endregion

//#region > Exports
module.exports.initMiner = initMiner;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
