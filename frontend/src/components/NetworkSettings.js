import React, { useState } from 'react';
import { setNetworkApiUrl, resetToLocalhost, getCurrentApiUrl, isNetworkAccess } from '../config/networkConfig';
import './NetworkSettings.css';

const NetworkSettings = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('8000');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSetNetwork = () => {
    if (!ipAddress.trim()) {
      setMessage('❌ Please enter IP address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Setting network configuration...');
    setMessageType('info');

    try {
      setNetworkApiUrl(ipAddress, parseInt(port));
    } catch (err) {
      setMessage('❌ Error setting network configuration');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLoading(true);
    setMessage('Resetting to localhost...');
    setMessageType('info');

    try {
      resetToLocalhost();
    } catch (err) {
      setMessage('❌ Error resetting configuration');
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <div className="network-settings-container">
      <button 
        className="network-settings-btn"
        onClick={() => setShowSettings(!showSettings)}
        title="Network Settings"
      >
        🌐
      </button>

      {showSettings && (
        <div className="network-settings-panel">
          <div className="settings-header">
            <h4>🌐 Network Settings</h4>
            <button 
              className="close-btn"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
          </div>

          <div className="settings-body">
            <div className="current-config">
              <p><strong>Current:</strong> {getCurrentApiUrl()}</p>
              <p><strong>Mode:</strong> {isNetworkAccess() ? '🌐 Network Access' : '💻 Localhost'}</p>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>Server IP Address:</label>
                <input
                  type="text"
                  placeholder="192.168.1.100"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Port:</label>
                <input
                  type="number"
                  placeholder="8000"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  disabled={loading}
                />
              </div>

              {message && (
                <div className={`message ${messageType}`}>
                  {message}
                </div>
              )}

              <div className="button-group">
                <button
                  className="btn-apply"
                  onClick={handleSetNetwork}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect to Network'}
                </button>
                <button
                  className="btn-reset"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset to Localhost
                </button>
              </div>

              <div className="help-text">
                <p>💡 <strong>How to find Server IP:</strong></p>
                <code>ipconfig</code>
                <p>Look for IPv4 Address (e.g., 192.168.x.x)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSettings;
