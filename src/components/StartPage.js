import React from 'react';
import './StartPage.css';
import backgroundImage from '../assets/Backgroundimage.webp'; // Pfad zum hochgeladenen Bild

const StartPage = ({ onConnect }) => {
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        console.log('MetaMask address:', address); // Debugging-Information
        onConnect(address); // Übergibt die Adresse an die App, um den Status zu aktualisieren
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  };

  return (
    <div className="start-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
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
        <p>
          Cryptotribe is a browser-based, space-oriented real-time strategy game. Create your own
          Empire, mine resources and develop new technologies. Explore the universe and defend
          yourself against enemy players. Have fun playing!
        </p>
      </div>
    </div>
  );
};

export default StartPage;
