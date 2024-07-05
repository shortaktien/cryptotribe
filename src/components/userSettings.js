import React, { useState, useEffect } from 'react';
import './MainContent.css'; // Verwendung derselben CSS-Datei wie bei MainContent
import './userSettings.css'; // Neue CSS-Datei für UserSettings

const UserSettings = () => {
  const [userAddress, setUserAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [savedNickname, setSavedNickname] = useState('');
  const [defaultNickname, setDefaultNickname] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const address = accounts[0];
        setUserAddress(address);
      } catch (error) {
        console.error('Error fetching user address:', error);
      }
    };

    fetchUserAddress();
  }, []);

  useEffect(() => {
    if (userAddress) {
      const loadNickname = async () => {
        try {
          const response = await fetch(`/api/getNickname?user_name=${userAddress}`);
          if (response.ok) {
            const data = await response.json();
            if (data.nickname) {
              setSavedNickname(data.nickname);
              setNickname(data.nickname);
            } else {
              const generatedNickname = userAddress.slice(-5);
              setDefaultNickname(generatedNickname);
              setNickname(generatedNickname);
            }
          } else {
            console.error('Failed to fetch nickname:', response.statusText);
          }
        } catch (error) {
          console.error('Error loading nickname:', error);
        }
      };

      loadNickname();
    }
  }, [userAddress]);

  const handleSave = async () => {
    if (!/^[a-zA-Z]+$/.test(nickname)) {
      setError('Nickname can only contain letters.');
      return;
    }

    setError('');

    try {
      const response = await fetch('/api/saveNickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userAddress, nickname: nickname.toLowerCase() }),
      });

      if (response.ok) {
        setSavedNickname(nickname.toLowerCase());
        setNotification('Nickname saved successfully!');
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Nickname already exists') {
          setNotification('Nickname already exists.');
        } else {
          console.error('Failed to save nickname:', errorData);
          setNotification('Failed to save nickname.');
        }
      }
    } catch (error) {
      console.error('Error saving nickname:', error);
      setNotification('An error occurred while saving the nickname.');
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const isDefaultNickname = nickname === defaultNickname;

  return (
    <div className="main-content-statistic">
      <div className="statistic">
        <div className="box">
          <h2 className="title">User Settings</h2>
          <p>Address: {userAddress || 'Address not available'}</p>
          {savedNickname && !isDefaultNickname ? (
            <p>Nickname: {savedNickname}</p>
          ) : (
            <>
              <label htmlFor="nickname">Nickname:</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Create a unique nickname"
                className={`nickname-input ${nickname === defaultNickname ? 'placeholder-text' : ''}`}
              />
              {error && <p className="error">{error}</p>}
              <button onClick={handleSave} className="save-button">Save</button>
            </>
          )}
        </div>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default UserSettings;
