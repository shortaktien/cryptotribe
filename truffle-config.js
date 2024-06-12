const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
const mnemonic = secrets.mnemonic;

module.exports = {
  networks: {
    iota: {
      provider: () => new HDWalletProvider(mnemonic, 'https://json-rpc.evm.testnet.iotaledger.net'),
      network_id: 1075, // IOTA EVM Testnet network ID
      gas: 6000000,
      gasPrice: 10000000000, // 10 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.21", // Fetch exact version from solc-bin
    },
  },
};
