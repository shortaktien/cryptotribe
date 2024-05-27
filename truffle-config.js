const HDWalletProvider = require('@truffle/hdwallet-provider');
const { mnemonic, infuraKey } = require('./secrets.json'); // Stellen Sie sicher, dass Sie Ihre Mnemonic und Infura-Key in einer secrets.json-Datei speichern

module.exports = {
  networks: {
    iotaTestnet: {
      provider: () => new HDWalletProvider(mnemonic, 'https://json-rpc.evm.testnet.iotaledger.net'),
      network_id: 1075, // IOTA EVM Testnet network ID
      gas: 5000000,
      gasPrice: 10000000000, // 1 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.21", // Fetch exact version from solc-bin
    },
  },
};
