module.exports = {
    networks: {
      iotaTestnet: {
        provider: () => new HDWalletProvider({
          mnemonic: {
            phrase: "throw deer cute shuffle era cover shoot toddler annual year country link" // Ersetze dies durch deinen Seed-Phrase oder private keys
          },
          providerOrUrl: "https://json-rpc.evm.testnet.iotaledger.net", // RPC URL des IOTA EVM Testnet
        }),
        network_id: 1075,      // Chain ID des IOTA EVM Testnet
        confirmations: 0,      // Anzahl der Bestätigungen, die für die Transaktion abgewartet werden sollen
        timeoutBlocks: 1000,    // Anzahl der Blöcke, die gewartet werden, bevor die Verbindung abbricht
        networkCheckTimeout: 200000,
        skipDryRun: true       // Überspringt den Dry-Run vor der Migration
      },
    },
    compilers: {
      solc: {
        version: "0.8.21",    // Die Version von Solidity, die verwendet werden soll
      }
    }
  };