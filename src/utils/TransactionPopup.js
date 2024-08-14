import React from 'react';
import '../components/App.css'; // Stelle sicher, dass deine CSS-Dateien korrekt importiert sind

const TransactionPopup = ({ transactionHash, message, show }) => {
  const explorerUrl = `https://explorer.evm.testnet.iotaledger.net/tx/${transactionHash}`;

  if (!show) return null;

  return (
    <div className="notification-container">
      <div className="transaction-popup">
        <div className="transaction-message">{message}</div>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          View on Explorer
        </a>
      </div>
    </div>
  );
};

export default TransactionPopup;
