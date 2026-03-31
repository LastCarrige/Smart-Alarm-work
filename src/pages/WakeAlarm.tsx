import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WakeAlarm.css';

// Імпорт асетів
import spaceBg from '../assets/images/background.webp';
import dividerLine from '../assets/images/Header-line.png';
// import awakeDot from '../assets/images/Awake.png';
// import remDot from '../assets/images/REM.png';
// import lightDot from '../assets/images/Light.png';
// import deepDot from '../assets/images/Deep.png';

const WakeAlarm: React.FC = () => {
  const sleepStages = [
    { id: 'awake', label: 'Awake', percentage: 8, color: '#5EEAD4' },
    { id: 'rem', label: 'Rem', percentage: 18, color: '#9333EA' },
    { id: 'light', label: 'Light', percentage: 52, color: '#60A5FA' },
    { id: 'deep', label: 'Deep', percentage: 22, color: '#2563EB' },
  ];

  return (
    <div className="alarm-page" style={{ backgroundImage: `url(${spaceBg})` }}>
      <div className="alarm-content">
        <header className="alarm-header">
          <h1 className="title-big">Wake alarm</h1>
          <img src={dividerLine} className="line-separator" alt="" />
        </header>

        <section className="chart-section">
          <div className="chart-card">
            {/* Сюди ти вставиш свій графік, коли він буде готовий */}
            <div className="chart-placeholder-grid"></div>
          </div>
        </section>

        <section className="stages-section">
          <h2 className="section-title">Sleep Stages</h2>
          <div className="stages-container">
            {sleepStages.map((stage) => (
              <div key={stage.id} className="stage-item">
                <div className="stage-left-part">
                  <div className="icon-glow-wrapper">
                    <div className="glow-sphere" style={{ backgroundColor: stage.color }}></div>
                    <div className="dot-core" style={{ backgroundColor: stage.color }}></div>
                  </div>
                  <span className="stage-label">{stage.label}</span>
                </div>
                <span className="stage-percent">{stage.percentage}%</span>
              </div>
            ))}
          </div>
        </section>

        <button className="btn-view-analysis">View Analysis</button>
      </div>
    </div>
  );
};

export default WakeAlarm;