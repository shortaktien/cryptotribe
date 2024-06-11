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
  const { resources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects, capacityRates, getNetProductionRates } = useResources();
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);
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

  const handleUpgradeResearch = async (researchId, cost) => {
    if (!contract) {
      console.error('Contract not initialized');
      return;
    }

    if (!userAddress) {
      console.error('User address not initialized');
      return;
    }

    const hasEnoughResources = Object.entries(cost).every(([resource, amount]) => {
      return resources[resource] >= amount;
    });

    if (!hasEnoughResources) {
      console.error('Not enough resources');
      return;
    }

    try {
      console.log('Sending transaction with the following parameters:', { researchId, cost });
      await sendTransaction(web3, userAddress, contract, 'upgradeResearch', [researchId, Object.keys(cost), Object.values(cost)]);
    } catch (error) {
      console.error('Error upgrading research:', error);
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
            refundResources={updatePopulation} 
          >
            <ResearchProvider
              spendResources={spendResources}
              updateResearchEffects={updateResearchEffects}
            >
              <Header
                userAddress={userAddress}
                userAvatar={userAvatar}
                userName={userName}
                userBalance={userBalance}
                resources={resources}
                capacityRates={capacityRates} // Füge dies hinzu
              />
              <div className="content">
                <Sidebar />
                {contractError ? (
                  <div className="error">
                    <p>{contractError}</p>
                  </div>
                ) : (
                  <Routes>
                    <Route path="/" element={<MainContent getNetProductionRates={getNetProductionRates} />} />
                    <Route path="/overview" element={<MainContent getNetProductionRates={getNetProductionRates} />} />
                    <Route
                      path="/buildings"
                      element={
                        <Buildings
                          resources={resources}
                          spendResources={spendResources}
                          updateProductionRate={updateProductionRate}
                          updateCapacityRates={updateCapacityRates}
                          handleUpgradeBuilding={handleUpgradeBuilding}
                          handleDemolishBuilding={handleUpgradeResearch}
                        />
                      }
                    />
                    <Route
                      path="/research"
                      element={
                        <Research
                          resources={resources}
                          spendResources={spendResources}
                          updateResearchEffects={updateResearchEffects}
                          handleUpgradeResearch={handleUpgradeResearch}
                        />
                      }
                    />
                    <Route path="/merchant" element={<Merchant />} />
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
