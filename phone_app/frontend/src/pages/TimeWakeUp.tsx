import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TimeWakeUp.css';
import mountainsBg from '../assets/images/TimeWakeUp.png';

const TimeWakeUp: React.FC = () => {
  const navigate = useNavigate();

  const handleStopAlarm = () => {
    // Шлях до наступної сторінки (згідно з твоїм App.tsx це /alarm)
    navigate('/alarm');
  };

  return (
    <div 
      className="wakeup-container" 
      style={{ backgroundImage: `url(${mountainsBg})` }}
    >
      <div className="content-wrapper">
        <h1 className="greeting">Good Morning!</h1>
        
        <div className="divider"></div>
        
        <h2 className="sub-greeting">You are arriving soon</h2>
        <p className="description">Waking you at the optimal time</p>

        {/* Секція з анімованою кнопкою */}
        <div className="action-section">
          <button className="ripple-button-container" onClick={handleStopAlarm}>
            {/* Хвилі, що розходяться (анімуються в CSS) */}
            <div className="ripple-wave wave-1"></div>
            <div className="ripple-wave wave-2"></div>
            <div className="ripple-wave wave-3"></div>
            
            {/* Головне жирне коло в центрі */}
            <div className="button-core"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeWakeUp;