import Web3 from 'web3';
import BuildingManagement from '../BuildingManagement.json';  // Hier den richtigen Namen verwenden

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('Web3 instance initialized with MetaMask.');
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = window.web3;
        console.log('Injected web3 detected.');
        resolve(web3);
      } else {
        const provider = new Web3.providers.HttpProvider('https://json-rpc.evm.testnet.iotaledger.net');
        const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
      }
    });
  });

const getContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  console.log('Current network ID:', networkId);
  
  // Überprüfen, ob networkId ein BigInt ist, und in einen String umwandeln
  if (typeof networkId === 'bigint') {
    networkId = networkId.toString();
  }

  const deployedNetwork = BuildingManagement.networks[networkId];
  console.log('Deployed network details:', deployedNetwork);
  if (!deployedNetwork) {
    console.error('Contract not deployed on this network:', networkId);
    throw new Error('Contract not deployed on this network');
  }
  const contract = new web3.eth.Contract(
    BuildingManagement.abi,
    deployedNetwork && deployedNetwork.address,
  );
  console.log('Contract initialized:', contract);
  return contract;
};

const sendTransaction = async (web3, userAddress, contract, method, params) => {
  const transactionParameters = {
    to: contract.options.address,
    from: userAddress,
    data: contract.methods[method](...params).encodeABI(),
    gas: '6000000',
    gasPrice: web3.utils.toWei('10', 'gwei'),
    type: '0x0' // Ensure legacy transaction
  };

  try {
    const receipt = await web3.eth.sendTransaction(transactionParameters);
    console.log('Transaction receipt: ', receipt);
  } catch (error) {
    console.error('Error in transaction: ', error);
  }
};

export { getWeb3, getContract, sendTransaction };
