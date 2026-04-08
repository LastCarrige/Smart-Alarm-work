import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

// Іконки
import SunIcon from '../assets/images/sun-icon.svg'; 
import MoonIcon from '../assets/images/moon-icon.svg'; 
import WatchIcon from '../assets/images/watch-icon.svg'; 

// Кружечки
import CyanCircle from '../assets/images/Light.png';
import BlueCircle from '../assets/images/Awake.png';
import PurpleCircle from '../assets/images/REM.png';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  // Стан для випадаючих списків
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [alarmSound, setAlarmSound] = useState('Gentle Chime');
  const [language, setLanguage] = useState('English');

  const toggleSelect = (name: string) => {
    setOpenSelect(openSelect === name ? null : name);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <button className="back-arrow-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="settings-title">Settings</h2>
        </div>

        <div className="settings-content">
          
          {/* Theme Section */}
          <div className="settings-card">
            <div className="card-row">
              <div className="card-info">
                <h3>Theme</h3>
                <p>Choose your preferred theme</p>
              </div>
              <div className="theme-toggle-group">
                <button className="theme-btn active">
                  <img src={SunIcon} alt="Light" />
                </button>
                <button className="theme-btn" onClick={() => alert('Coming soon!')}>
                  <img src={MoonIcon} alt="Dark" />
                </button>
              </div>
            </div>
          </div>

          {/* Accent Color Section */}
          <div className="settings-card">
            <h3>Accent Color</h3>
            <div className="color-options">
              <div className="color-item">
                <img src={CyanCircle} alt="Cyan" className="color-circle active" />
                <span>Cyan</span>
              </div>
              <div className="color-item">
                <img src={BlueCircle} alt="Electric Blue" className="color-circle" />
                <span>Electric Blue</span>
              </div>
              <div className="color-item">
                <img src={PurpleCircle} alt="Purple" className="color-circle" />
                <span>Purple</span>
              </div>
            </div>
          </div>

          {/* Alarm Sound Section */}
          <div className="settings-card">
            <h3>Alarm Sound</h3>
            <div className="custom-select-wrapper">
              <div 
                className={`custom-select-trigger ${openSelect === 'alarm' ? 'open' : ''}`}
                onClick={() => toggleSelect('alarm')}
              >
                <span>{alarmSound}</span>
                <div className="arrow-down"></div>
              </div>
              {openSelect === 'alarm' && (
                <div className="custom-options">
                  {['Gentle Chime', 'Birds Morning', 'Classic Bell'].map(option => (
                    <div key={option} className="option" onClick={() => { setAlarmSound(option); setOpenSelect(null); }}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Smartwatch Section */}
          <div className="settings-card">
            <h3>Smartwatch</h3>
            <div className="watch-row">
              <div className="watch-info">
                <img src={WatchIcon} alt="Watch" className="watch-icon" />
                <div>
                  <p className="watch-name">Samsung Watch</p>
                  <p className="watch-status">Connected</p>
                </div>
              </div>
              <div className="status-dot"></div>
            </div>
          </div>

          {/* Language Section */}
          <div className="settings-card">
            <h3>Language</h3>
            <div className="custom-select-wrapper">
              <div 
                className={`custom-select-trigger ${openSelect === 'lang' ? 'open' : ''}`}
                onClick={() => toggleSelect('lang')}
              >
                <span>{language}</span>
                <div className="arrow-down"></div>
              </div>
              {openSelect === 'lang' && (
                <div className="custom-options">
                  {['English', 'Ukrainian', 'French'].map(option => (
                    <div key={option} className="option" onClick={() => { setLanguage(option); setOpenSelect(null); }}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="settings-card about-section">
            <h3>About WayWake</h3>
            <p>Version 1.0.0</p>
            <p>Smart Wake for Travelers</p>
          </div>

          <button className="btn-settings-main" onClick={() => navigate('/')}>
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;