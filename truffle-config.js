const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
const mnemonic = secrets.mnemonic;

module.exports = {
  networks: {
    iotaTestnet: {
      provider: () => new HDWalletProvider(mnemonic, 'https://json-rpc.evm.testnet.iotaledger.net'),
      network_id: 1075, // IOTA EVM Testnet network ID
      gas: 6000000,
      gasPrice: 10000000000, // 10 Gwei, kein Bedarf an `web3.utils.toWei`
      //type: "0x0"
    },
    try {
      const receipt = await web3.eth.sendTransaction(transactionParameters);
      console.log('Transaction receipt: ', receipt);
    } catch (error) {
      console.error('Error in transaction: ', error);
      if (error.data) {
        console.error('Error data: ', error.data);
      }
    }
    };
    
  },
  compilers: {
    solc: {
      version: "0.8.21", // Fetch exact version from solc-bin
    },
  },
};

