// src/components/StartPage.js
import React from 'react';
import './App.css';

const StartPage = ({ onConnect }) => {
  return (
    <div className="start-page">
      <h1>Welcome to Cryptotribe</h1>
      <p>
        Cryptotribe is a browser-based, space-oriented real-time strategy game. Create your own
        Empire, mine resources and develop new technologies. Explore the universe and defend
        yourself against enemy players. Have fun playing!
      </p>
      <button onClick={onConnect} className="connect-button">Mit MetaMask verbinden</button>
    </div>
  );
};

export default StartPage;
