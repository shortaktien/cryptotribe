// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Buildings from './components/Buildings';
import Alliance from './components/Alliance';
import Defence from './components/Defence';
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
import { MilitaryProvider } from './components/MilitaryContext';
import { DefenseProvider } from './components/DefenseContext';
import { ShipyardProvider } from './components/ShipyardContext';

import { getWeb3, getContract, sendTransaction } from './utils/web3';
import './components/App.css';

function App() {
  const { resources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects, capacityRates, getNetProductionRates, refundResources } = useResources();
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

  const handleTrainUnit = async (unitId) => {
    console.log(`Train unit with id ${unitId}`);
  };

  const handleDisbandUnit = async (unitId) => {
    console.log(`Disband unit with id ${unitId}`);
  };

  const handleBuildDefense = async (structureId) => {
    console.log(`Build defense structure with id ${structureId}`);
  };

  const handleDemolishDefense = async (structureId) => {
    console.log(`Demolish defense structure with id ${structureId}`);
  };

  const handleBuildShip = async (shipId) => {
    console.log(`Build ship with id ${shipId}`);
  };

  const handleScrapShip = async (shipId) => {
    console.log(`Scrap ship with id ${shipId}`);
  };

  //console.log("Capacity Rates in App:", capacityRates); 

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
              <MilitaryProvider
                spendResources={spendResources}
                updateCapacityRates={updateCapacityRates}
                refundResources={refundResources}
              >
                <DefenseProvider
                  spendResources={spendResources}
                  updateCapacityRates={updateCapacityRates}
                  refundResources={refundResources}
                >
                  <ShipyardProvider
                    spendResources={spendResources}
                    updateCapacityRates={updateCapacityRates}
                    refundResources={refundResources}
                  >
                    <Header
                      userAddress={userAddress}
                      userAvatar={userAvatar}
                      userName={userName}
                      userBalance={userBalance}
                      resources={resources}
                      capacityRates={capacityRates}
                    />
                    <div className="content">
                      <Sidebar userAddress={userAddress} resources={resources} />
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
                          <Route path="/merchant" element={
                            <Merchant
                              resources={resources}
                              spendResources={spendResources}
                              refundResources={refundResources}
                            />
                          } />
                          <Route path="/shipyard" element={
                            <Shipyard
                              resources={resources}
                              spendResources={spendResources}
                              updateCapacityRates={updateCapacityRates}
                              handleBuildShip={handleBuildShip}
                              handleScrapShip={handleScrapShip}
                            />
                          } />
                          <Route
                            path="/defence"
                            element={
                              <Defence
                                resources={resources}
                                spendResources={spendResources}
                                updateCapacityRates={updateCapacityRates}
                                handleBuildDefense={handleBuildDefense}
                                handleDemolishDefense={handleDemolishDefense}
                              />
                            }
                          />
                          <Route
                            path="/military"
                            element={
                              <Military
                                resources={resources}
                                spendResources={spendResources}
                                updateCapacityRates={updateCapacityRates}
                                handleTrainUnit={handleTrainUnit}
                                handleDisbandUnit={handleDisbandUnit}
                              />
                            }
                          />
                          <Route path="/world" element={<World />} />
                          <Route path="/alliance" element={<Alliance />} />
                          <Route path="/shop" element={<Shop />} />
                        </Routes>
                      )}
                    </div>
                    <Footer />
                  </ShipyardProvider>
                </DefenseProvider>
              </MilitaryProvider>
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
