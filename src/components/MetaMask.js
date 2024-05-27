import detectEthereumProvider from '@metamask/detect-provider';
import md5 from 'crypto-js/md5';
import Web3 from 'web3';

const IOTA_EVM_NETWORK_PARAMS = {
  chainId: '0x433', // Hexadecimal value of the Chain ID
  chainName: 'IOTA EVM Testnet',
  nativeCurrency: {
    name: 'IOTA',
    symbol: 'IOTA',
    decimals: 18,
  },
  rpcUrls: ['https://json-rpc.evm.testnet.iotaledger.net'],
  blockExplorerUrls: ['https://explorer.evm.testnet.iotaledger.net'],
};

export const connectMetaMask = async (setUserAddress, setUserAvatar, setIsConnected, setUserName, setUserBalance) => {
    const provider = await detectEthereumProvider();
    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
        setUserAddress(userAddress);

        // Create a Web3 instance
        const web3 = new Web3(provider);

        // !!!!!!!!!Get the balance change to IOTA and not ETH!!!!!!!!!!!!!!!!!!
        const balance = await web3.eth.getBalance(userAddress);
        setUserBalance(web3.utils.fromWei(balance, 'ether'));

        // Get the avatar (using gravatar)
        const avatarUrl = `https://www.gravatar.com/avatar/${md5(userAddress)}?d=identicon`;
        setUserAvatar(avatarUrl);

        // Set the username (for demonstration, use the address as the username)
        //setUserName(userName);
        
        console.log('MetaMask connected');
        await switchToIotaEvmNetwork();
        setIsConnected(true);
      } catch (error) {
        console.error('User rejected the request or an error occurred.', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  };

const switchToIotaEvmNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: IOTA_EVM_NETWORK_PARAMS.chainId }],
    });
    console.log('Switched to IOTA EVM network');
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [IOTA_EVM_NETWORK_PARAMS],
        });
        console.log('Added and switched to IOTA EVM network');
      } catch (addError) {
        console.error('Failed to add the IOTA EVM network to MetaMask', addError);
      }
    } else {
      console.error('Failed to switch to the IOTA EVM network', switchError);
    }
  }
};
