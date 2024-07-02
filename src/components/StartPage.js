import React from 'react';
import './StartPage.css';

const StartPage = ({ onConnect }) => {
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        console.log('MetaMask address:', address);
  
        const saveResponse = await fetch('/api/saveData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });
  
        if (saveResponse.ok) {
          const saveMessage = await saveResponse.text();
          console.log(saveMessage);
  
          const loadResponse = await fetch(`/api/loadGame?user_name=${address}`);
          if (loadResponse.ok) {
            const { resources, buildings } = await loadResponse.json();
            console.log('Game progress loaded:', resources, buildings);
            onConnect(address, resources, buildings); // Pass buildings to the onConnect function
          } else {
            console.log('User not found, starting new game');
            onConnect(address, null); // Start with new game
          }
        } else {
          console.error('Failed to save address:', saveResponse.statusText);
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  };

  return (
    <div className="start-page">
      <div className="headline">
        <h1>Welcome to Cryptotribe</h1>
      </div>
      <div className="button-container">
        <button onClick={connectMetaMask} className="connect-button">Mit MetaMask verbinden</button>
        <button className="other-button">Button 2</button>
        <button className="other-button">Button 3</button>
        <button className="other-button">Button 4</button>
      </div>
      <div className="description">
        <h2>Welcome to the World of Ealdoria</h2>
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
