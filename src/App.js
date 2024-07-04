import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import { BuildingsProvider, initialBuildingsData } from './components/BuildingsContext';
import { ResearchProvider } from './components/ResearchContext';
import { MilitaryProvider } from './components/MilitaryContext';
import { DefenseProvider } from './components/DefenseContext';
import { ShipyardProvider } from './components/ShipyardContext';

import { getWeb3, getContract, sendTransaction } from './utils/web3';
import './components/App.css';

function useCheckAddressChange(userAddress, setIsConnected, setUserAddress) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAddressChange = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const currentAddress = accounts[0];

        if (currentAddress !== userAddress) {
          setIsConnected(false);
          setUserAddress('');
          navigate('/');
        }
      }
    };

    const interval = setInterval(checkAddressChange, 1000); // Überprüft die Adresse alle 1 Sekunde

    return () => clearInterval(interval); // Bereinigt das Intervall beim Unmounting der Komponente
  }, [userAddress, navigate, setIsConnected, setUserAddress]);
}

function AppContent({ resources, setResources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects, capacityRates, getNetProductionRates, refundResources, setCapacityRates }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState('');
  const [loadedBuildings, setLoadedBuildings] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  useCheckAddressChange(userAddress, setIsConnected, setUserAddress);

  const formatTimeDifference = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  const handleLogin = (address, loadedResources, loadedBuildings, loadedCapacities, timeDifferenceInSeconds = 0, gainedResources = {}) => {
    console.log('handleLogin called with:', { address, loadedResources, loadedBuildings, loadedCapacities, timeDifferenceInSeconds, gainedResources });
  
    const defaultResources = {
      water: 250,
      food: 250,
      wood: 300,
      stone: 100,
      knowledge: 0,
      population: 15,
      coal: 0,
      gold: 0,
      military: 0,
    };
  
    const updatedResources = { ...defaultResources, ...(loadedResources || {}) };
    setResources(updatedResources);
  
    if (!loadedCapacities) {
      loadedCapacities = {
        water: 500,
        food: 500,
        wood: 500,
        stone: 500,
        knowledge: 100,
        population: 15,
        coal: 500,
        gold: 500,
        military: 0,
        maxMilitaryCapacity: 0
      };
    }
    setCapacityRates(loadedCapacities);
  
    if (!loadedBuildings) {
      loadedBuildings = initialBuildingsData;
    }
  
    setLoadedBuildings(loadedBuildings);
    setIsConnected(true);
  
    const formattedTime = formatTimeDifference(timeDifferenceInSeconds);
    const formattedResources = Object.keys(gainedResources).length > 0
      ? Object.entries(gainedResources).map(([resource, amount]) => `${Math.ceil(amount)} ${resource}`).join(', ')
      : 'no resources';
  
    console.log(`You were away for ${formattedTime} and produced ${formattedResources}.`);
    setNotificationMessage(`You were away for ${formattedTime} and produced ${formattedResources}.`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 10000);
  };
  
  const handleConnect = async (address) => {
    setUserAddress(address);
    const response = await fetch(`/api/loadGame?user_name=${address}`);
    if (response.ok) {
      const data = await response.json();
      console.log('API response:', data);
      console.log(`User ${address} was away for ${data.timeDifferenceInSeconds || 0} seconds.`);
      console.log(`Resources gained by user ${address} during absence:`, data.gainedResources || {});
      handleLogin(address, data.resources, data.buildings, data.capacities, data.timeDifferenceInSeconds || 0, data.gainedResources || {});
    } else {
      handleLogin(address, null, null, null, 0, {});
    }
  };

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

  return (
    <div className="app">
      {isConnected ? (
        <BuildingsProvider
          initialBuildings={loadedBuildings}
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
                    resources={resources}
                    capacityRates={capacityRates}
                  />
                  <div className="content">
                    <Sidebar userAddress={userAddress} resources={resources} />
                    {showNotification && (
                      <div className="notification">
                        {notificationMessage}
                      </div>
                    )}
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
        <StartPage onConnect={handleConnect} />
      )}
    </div>
  );
}

function App() {
  const { resources, setResources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects, capacityRates, getNetProductionRates, refundResources, setCapacityRates } = useResources(); // Hier sicherstellen, dass setCapacityRates importiert wird

  return (
    <Router>
      <AppContent
        resources={resources}
        setResources={setResources}
        updateProductionRate={updateProductionRate}
        spendResources={spendResources}
        updateCapacityRates={updateCapacityRates}
        updatePopulation={updatePopulation}
        updateResearchEffects={updateResearchEffects}
        capacityRates={capacityRates}
        getNetProductionRates={getNetProductionRates}
        refundResources={refundResources}
        setCapacityRates={setCapacityRates}
      />
    </Router>
  );
}

export default App;
