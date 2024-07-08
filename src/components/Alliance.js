import React, { useEffect, useState } from 'react';
import './MainContent.css'; // Verwende das gleiche CSS wie MainContent

const Alliance = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/getPlayers');
        const data = await response.json();
        const sortedPlayers = data.sort((a, b) => b.economic_points - a.economic_points);
        setPlayers(sortedPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  const renderPlayerName = (player) => {
    if (player.nickname) {
      return player.nickname;
    }
    if (player.user_name) {
      return player.user_name.slice(-5);
    }
    return 'Unknown';
  };

  return (
    <div className="main-content-statistic">
      <div className="statistic">
        <div className="box">
          <h2 className="title">Player Rankings</h2>
          <ul className="production-list">
            {players.map((player, index) => (
              <li key={index} className="production-item">
                <span className="resource-name">{index + 1}. {renderPlayerName(player)}</span>
                <span className="resource-rate">{player.economic_points} Points</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Alliance;
