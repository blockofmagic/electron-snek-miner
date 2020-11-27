const web3 = require("./web3");

//Your contract address
const address = "0x17B6c2bDCff5779930Bc61dD9768773d4F8CD629";
//Your contract ABI
const abi = [
  {
    constant: false,
    inputs: [{ name: "x", type: "string" }],
    name: "sendHash",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getHash",
    outputs: [{ name: "x", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

module.exports = new web3.eth.Contract(abi, address);
