import React, { useState } from 'react';
import './Merchant.css';

const resourceValues = {
  wood: 0.5,
  stone: 0.7,
  coal: 0.85,
  gold: 5
};

const Merchant = ({ resources, spendResources, refundResources }) => {
  const [selectedResource, setSelectedResource] = useState('wood');
  const [amount, setAmount] = useState(0);

  const handleBuy = () => {
    const cost = amount * resourceValues[selectedResource];
    if (resources.gold >= cost) {
      spendResources({ gold: cost });
      refundResources({ [selectedResource]: amount });
      console.log(`Bought ${amount} ${selectedResource} for ${cost} gold`);
    } else {
      console.log('Not enough gold');
    }
  };

  const handleSell = () => {
    if (resources[selectedResource] >= amount) {
      const gain = amount * resourceValues[selectedResource];
      spendResources({ [selectedResource]: amount });
      refundResources({ gold: gain });
      console.log(`Sold ${amount} ${selectedResource} for ${gain} gold`);
    } else {
      console.log(`Not enough ${selectedResource}`);
    }
  };

  return (
    <div className="merchant">
      <h1>Merchant</h1>
      <div className="resource-selection">
        <label htmlFor="resource">Resource:</label>
        <select id="resource" value={selectedResource} onChange={(e) => setSelectedResource(e.target.value)}>
          {Object.keys(resourceValues).map(resource => (
            <option key={resource} value={resource}>
              {resource.charAt(0).toUpperCase() + resource.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="amount-selection">
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
        />
      </div>
      <div className="actions">
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>
    </div>
  );
};

export default Merchant;
