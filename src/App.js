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
import UserSettings from "./components/userSettings";
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

    const interval = setInterval(checkAddressChange, 1000);

    return () => clearInterval(interval);
  }, [userAddress, navigate, setIsConnected, setUserAddress]);
}

function AppContent({
  resources, setResources, updateProductionRate, spendResources,
  updateCapacityRates, updatePopulation, updateResearchEffects, 
  capacityRates, getNetProductionRates, getProductionRates, 
  refundResources, setCapacityRates
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState('');
  const [loadedBuildings, setLoadedBuildings] = useState(initialBuildingsData); // Default initialBuildingsData
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(false);
  const [economicPoints, setEconomicPoints] = useState(0);
  const [military, setMilitary] = useState({});
  const { setLoadedProductionRates } = useResources();

  useCheckAddressChange(userAddress, setIsConnected, setUserAddress);

  const formatTimeDifference = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  const handleLogin = (address, loadedResources, loadedBuildings, loadedCapacities, timeDifferenceInSeconds = 0, gainedResources = {}, nickname = '', economic_points = 0, productionRates = {}, military = {}) => {
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
        maxMilitaryCapacity: 0,
      };
    }
    setCapacityRates(loadedCapacities);

    console.log('Loaded Buildings:', loadedBuildings);
    if (!loadedBuildings || Object.keys(loadedBuildings).length === 0) {
      loadedBuildings = initialBuildingsData;
    } else {
      // Transform the loaded buildings into the format expected by the BuildingsContext
      loadedBuildings = initialBuildingsData.map(building => ({
        ...building,
        currentLevel: loadedBuildings[building.name.toLowerCase()] || 0
      }));
    }

    setLoadedBuildings(loadedBuildings);
    setIsConnected(true);
    setEconomicPoints(economic_points);
    setLoadedProductionRates(productionRates);

    if (nickname) {
      setNickname(nickname);
    }

    setMilitary(military);

    if (timeDifferenceInSeconds > 0 && Object.keys(gainedResources).length > 0) {
      const formattedTime = formatTimeDifference(timeDifferenceInSeconds);
      const formattedResources = Object.entries(gainedResources)
        .map(([resource, amount]) => `${Math.ceil(amount)} ${resource}`)
        .join(', ');

      console.log(`You were away for ${formattedTime} and produced ${formattedResources}.`);
      setNotificationMessage(`You were away for ${formattedTime} and produced ${formattedResources}.`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 10000);
    }
  };

  const handleConnect = async (address) => {
    try {
      setUserAddress(address);
      console.log('Connecting with address:', address); // Log the address

      const response = await fetch(`/api/loadGame?user_name=${address}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded data:', data); // Log the loaded data

        const isExistingPlayer = data.resources || data.buildings || data.capacities;
        handleLogin(
          address,
          data.resources,
          data.buildings,
          data.capacities,
          data.timeDifferenceInSeconds || 0,
          data.gainedResources || {},
          data.nickname,
          data.economic_points,
          data.productionRates,
          data.military
        );

        if (!data.nickname && !isExistingPlayer) {
          setShowNicknamePrompt(true);
        } else {
          setShowNicknamePrompt(false);
        }
      } else {
        console.error('Failed to load game data:', response.statusText); // Log the error response
        handleLogin(address, null, null, null, 0, {}, '');
        setNickname('');
        setShowNicknamePrompt(true);
      }
    } catch (error) {
      console.error('Error connecting to load game API:', error); // Log the error
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
      } catch (error) {
        setContractError(error.message);
      }
    };
    initWeb3();
  }, []);

  const handleUpgradeBuilding = async (buildingId, resourceNames, resourceCosts) => {
    if (!contract) {
      return;
    }

    if (!userAddress) {
      return;
    }

    const hasEnoughResources = resourceNames.every((resource, index) => {
      return resources[resource] >= resourceCosts[index];
    });

    if (!hasEnoughResources) {
      return;
    }

    try {
      await sendTransaction(web3, userAddress, contract, 'upgradeBuilding', [buildingId, resourceNames, resourceCosts]);
    } catch (error) {
      if (error.data) {
        console.error('Error data: ', error.data);
      }
    }
  };

  const handleUpgradeResearch = async (researchId, cost) => {
    if (!contract) {
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
      return;
    }

    try {
      await sendTransaction(web3, userAddress, contract, 'upgradeResearch', [researchId, Object.keys(cost), Object.values(cost)]);
    } catch (error) {
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
                    userName={nickname} 
                    resources={resources}
                    capacityRates={capacityRates}
                    military={military} 
                  />
                  <div className="content">
                    <Sidebar userAddress={userAddress} resources={resources} economicPoints={economicPoints} military={military} />
                    {showNotification && (
                      <div className="notification-container">
                        <div className="notification">
                          {notificationMessage}
                        </div>
                        {showNicknamePrompt && (
                          <div className="notification">
                            Go to profile settings and create a nickname
                          </div>
                        )}
                      </div>
                    )}
                    {contractError ? (
                      <div className="error">
                        <p>{contractError}</p>
                      </div>
                    ) : (
                      <Routes>
                        <Route path="/" element={<MainContent userAddress={userAddress} getNetProductionRates={getNetProductionRates} getProductionRates={getProductionRates} capacityRates={capacityRates} economicPoints={economicPoints} military={military} />} />
                        <Route path="/overview" element={<MainContent userAddress={userAddress} getNetProductionRates={getNetProductionRates} getProductionRates={getProductionRates} capacityRates={capacityRates} economicPoints={economicPoints} military={military} />} />
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
                              setEconomicPoints={setEconomicPoints}
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
                        <Route path="/settings" element={<UserSettings userAddress={userAddress} />} /> 
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
  const { resources, setResources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects, capacityRates, getNetProductionRates, getProductionRates, refundResources, setCapacityRates, setLoadedProductionRates } = useResources();

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
        getProductionRates={getProductionRates}
        refundResources={refundResources}
        setCapacityRates={setCapacityRates}
        setLoadedProductionRates={setLoadedProductionRates}
      />
    </Router>
  );
}

export default App;
