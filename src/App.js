import React, { useState } from 'react';
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
import './components/App.css';
import { BuildingsProvider } from './components/BuildingsContext';

function App() {
  const { resources, updateProductionRate, spendResources } = useResources();
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState('');

  return (
    <Router>
      <div className="app">
        {isConnected ? (
          <BuildingsProvider>
            <Header
              userAddress={userAddress}
              userAvatar={userAvatar}
              userName={userName}
              userBalance={userBalance}
              resources={resources}
            />
            <div className="content">
              <Sidebar />
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
                    />
                  }
                />
                <Route path="/merchant" element={<Merchant />} />
                <Route path="/research" element={<Research />} />
                <Route path="/shipyard" element={<Shipyard />} />
                <Route path="/defense" element={<Defense />} />
                <Route path="/military" element={<Military />} />
                <Route path="/world" element={<World />} />
                <Route path="/alliance" element={<Alliance />} />
                <Route path="/shop" element={<Shop />} />
              </Routes>
            </div>
            <Footer />
          </BuildingsProvider>
        ) : (
          <StartPage onConnect={() => connectMetaMask(setUserAddress, setUserAvatar, setIsConnected, setUserBalance, setUserName)} />
        )}
      </div>
    </Router>
  );
}

export default App;
