// src/components/StartPage.js
import React from 'react';
import './StartPage.css';
import backgroundImage from '../assets/Backgroundimage.webp'; // Pfad zum hochgeladenen Bild

const StartPage = ({ onConnect }) => {
  return (
    <div className="start-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="headline">
        <h1>Welcome to Cryptotribe</h1>
      </div>
      <div className="button-container">
        <button onClick={onConnect} className="connect-button">Mit MetaMask verbinden</button>
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
