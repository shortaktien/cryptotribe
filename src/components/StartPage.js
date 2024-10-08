import React, { useState } from 'react';
import './StartPage.css';

import { calculateNotificationMessage } from '../utils/Notification';

import { getOfflineResources } from '../utils/Notification';

const StartPage = ({ onConnect }) => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [userData, setUserData] = useState(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        setLoading(true); // Ladeanzeige anzeigen
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        console.log('MetaMask address:', address);

        // Speichere die login_time
        await fetch('/api/saveData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });

        const loadResponse = await fetch(`/api/loadGame?user_name=${address}`);
        if (loadResponse.ok) {
        const data = await loadResponse.json();
        const { resources, buildings, productionRates, updated_at } = data; // Verwende updated_at als lastSaveTime
        console.log('Game progress loaded:', data);

        // Hole die bereits berechneten Offline-Ressourcen aus Notification.js
        const offlineResources = getOfflineResources();
        console.log('Offline resources:', offlineResources);

        // Addiere die Offline-Ressourcen zu den bestehenden Ressourcen
        const updatedResources = { ...resources };
        if (offlineResources && offlineResources.resources) {
          Object.keys(offlineResources.resources).forEach(resource => {
            updatedResources[resource] = (updatedResources[resource] || 0) + offlineResources.resources[resource];
          });
        }

        // Übergib die aktualisierten Ressourcen
        onConnect(address, updatedResources, buildings, productionRates);
        setIsConnected(true); // Setze den Verbindungsstatus auf erfolgreich
        setUserStatus('User found');
        setUserData({ resources: updatedResources, buildings, productionRates });
      } else {
        console.log('User not found, starting new game');
        onConnect(address, null); // Starte ein neues Spiel
        setIsConnected(true); // Setze den Verbindungsstatus auf erfolgreich
        setUserStatus('New user loading default');
        setUserData(null);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    } finally {
      setLoading(false); // Ladeanzeige ausblenden
    }
  } else {
    alert('MetaMask is not installed. Please install it to use this app.');
  }
};

  const handleGitHubClick = () => {
    window.open('https://github.com/shortaktien/cryptotribe', '_blank');
  };

  const handleXClick = () => {
    window.open('https://x.com/shortaktien', '_blank');
  };

  return (
    <div className="start-page">
      <div className="headline">
        <h1>Welcome to Cryptotribe</h1>
      </div>
      <div className="button-container">
        <button 
          onClick={connectMetaMask} 
          className={`connect-button ${loading ? 'loading' : ''} ${isConnected ? 'success' : ''}`}
          disabled={loading || isConnected}
        >
          {loading ? 'Loading...' : isConnected ? 'Connected' : 'Login with MetaMask'}
          {loading && <div className="progress-bar"></div>}
        </button>
        <button className="other-button github-button" onClick={handleGitHubClick}>GitHub</button>
        <button className="other-button x-button" onClick={handleXClick}>X/Twitter</button>
        <button className="other-button">Button 4</button>
      </div>
      <div className="description">
        <h2>Welcome to the World of Ealdoria</h2>
        {userStatus && (
          <div className="user-status">
            <p>{userStatus}</p>
            {userData && (
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            )}
          </div>
        )}
        <p>
          In the shadows of bygone ages, where kings and warlords once clashed for supremacy, a new power rises. In Ealdoria, the fate of your realm rests in your hands. You are the architect of your own empire, and only through astute management and strategic thinking will you survive and thrive in this unforgiving world.
        </p>
        <p>
          The paths of trade and economy are the lifeblood of your realm. Wealth and resources must be managed wisely to train a formidable army. But beware, for building your defenses is equally crucial. Enemy hordes will scratch at your gates, and only through shrewd planning and strategic placement of your defenses will you protect your lands.
        </p>
        <p>
          Ealdoria offers you the chance to forge alliances. Join forces with other rulers to pursue common goals and gain powerful bonuses. Yet be vigilant – not all who seek friendship are true allies. Intrigue and betrayal lurk around every corner.
        </p>
        <p>
          Ancient artifacts and forgotten relics, known only as the Threads of Continuity and the Gleam of Eternity, weave through the very essence of this world. Only the knowledgeable, the brave, will understand the hidden powers and possibilities they hold. These enigmatic forces shape the fabric of power and influence in Ealdoria.
        </p>
        <p>
          Are you ready to forge your destiny and lead your realm to immortal glory? Dive into the deep mysteries of Ealdoria and begin your journey today.
        </p>
      </div>
    </div>
  );
};

export default StartPage;
