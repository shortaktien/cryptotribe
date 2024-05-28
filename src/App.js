import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Buildings from './components/Buildings';
import Alliance from './components/Alliance';
import Defense from './components/Defense';
import Merchant from './components/Merchant';
import Military from './components/Military';
import Research from './components/Research';
import Shipyard from './components/Shipyard';
import Shop from './components/Shop';
import World from './components/World';
import Header from './components/Header';
import Footer from './components/Footer';
import StartPage from './components/StartPage';
import useResources from './components/SetResources';
import { connectMetaMask } from './components/MetaMask';
import { BuildingsProvider } from './components/BuildingsContext';
import { ResearchProvider } from './components/ResearchContext';
import { getWeb3, getContract, sendTransaction } from './utils/web3';
import './components/App.css';

function App() {
  const { resources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects } = useResources();
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState('');
  const [web3, setWeb3] = useState(null); // Add web3 state
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance); // Set web3 instance
        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]);
        const contractInstance = await getContract(web3Instance);
        setContract(contractInstance);
        console.log('Web3 and contract initialized:', { web3Instance, contractInstance });
      } catch (error) {
        console.error('Error initializing web3 or contract:', error);
        setContractError(error.message);
      }
    };
    initWeb3();
  }, []);

  const handleUpgradeBuilding = async (buildingId, resourceNames, resourceCosts) => {
    if (!contract) {
      console.error('Contract not initialized');
      return;
    }
  
    if (!userAddress) {
      console.error('User address not initialized');
      return;
    }
  
    // Check if resources are sufficient
    const hasEnoughResources = resourceNames.every((resource, index) => {
      return resources[resource] >= resourceCosts[index];
    });
  
    if (!hasEnoughResources) {
      console.error('Not enough resources');
      return;
    }
  
    try {
      console.log('Sending transaction with the following parameters:', { buildingId, resourceNames, resourceCosts });
      await sendTransaction(web3, userAddress, contract, 'upgradeBuilding', [buildingId, resourceNames, resourceCosts]);
    } catch (error) {
      console.error('Error upgrading building:', error);
      if (error.data) {
        console.error('Error data: ', error.data);
      }
    }
  };
  

  return (
    <Router>
      <div className="app">
        {isConnected ? (
          <BuildingsProvider
            spendResources={spendResources}
            updateProductionRate={updateProductionRate}
            updateCapacityRates={updateCapacityRates}
            updatePopulation={updatePopulation}  // <--- Sicherstellen, dass updatePopulation übergeben wird
          >
            <ResearchProvider>
              <Header
                userAddress={userAddress}
                userAvatar={userAvatar}
                userName={userName}
                userBalance={userBalance}
                resources={resources}
              />
              <div className="content">
                <Sidebar />
                {contractError ? (
                  <div className="error">
                    <p>{contractError}</p>
                  </div>
                ) : (
                  <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/overview" element={<MainContent />} />
                    <Route
                      path="/buildings"
                      element={
                        <Buildings
                          resources={resources}
                          spendResources={spendResources}
                          updateProductionRate={updateProductionRate}
                          updateCapacityRates={updateCapacityRates}
                          updatePopulation={updatePopulation}  // <--- Sicherstellen, dass updatePopulation übergeben wird
                          handleUpgradeBuilding={handleUpgradeBuilding}
                        />
                      }
                    />
                    <Route path="/merchant" element={<Merchant />} />
                    <Route
                      path="/research"
                      element={
                        <Research
                          resources={resources}
                          spendResources={spendResources}
                          updateResearchEffects={updateResearchEffects}
                        />
                      }
                    />
                    <Route path="/shipyard" element={<Shipyard />} />
                    <Route path="/defense" element={<Defense />} />
                    <Route path="/military" element={<Military />} />
                    <Route path="/world" element={<World />} />
                    <Route path="/alliance" element={<Alliance />} />
                    <Route path="/shop" element={<Shop />} />
                  </Routes>
                )}
              </div>
              <Footer />
            </ResearchProvider>
          </BuildingsProvider>
        ) : (
          <StartPage onConnect={() => connectMetaMask(setUserAddress, setUserAvatar, setIsConnected, setUserBalance, setUserName)} />
        )}
      </div>
    </Router>
  );
}

export default App;
