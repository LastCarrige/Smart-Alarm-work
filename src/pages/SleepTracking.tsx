import { useState, useEffect } from 'react';
// 1. Додаємо імпорт штурмана
import { useNavigate } from 'react-router-dom'; 
import './SleepTracking.css';

const SleepTracking = () => {
  const [time, setTime] = useState(new Date());
  // 2. Активуємо штурмана
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  return (
    <div className="sleep-container">
      <header className="sleep-header">
        <button className="back-btn" onClick={() => window.history.back()}>←</button>
        <h1>Sleep Tracking</h1>
      </header>

      <div className="clock-section">
        <h2 className="current-time">{formatTime(time)}</h2>
        <p className="status-text">Tracking Sleep...</p>
      </div>

      <div className="wave-section">
        <div className="wave-placeholder">
          <svg width="350" height="72" viewBox="0 0 350 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path className="wave-line-1" d="M45.5928 49.3033C45.5928 49.3033 92.252 20.4818 117.493 24.138C142.735 27.7942 140.87 45.9287 165.77 49.3033C190.669 52.6778 208.241 22.9111 235.616 24.138C262.991 25.365 296.732 49.3033 296.732 49.3033" stroke="#8E1EC6" strokeWidth="3"/>
            </g>
            <g>
              <path className="wave-line-2" d="M20.9412 28.791C20.9412 28.791 61.5875 45.4471 84.1111 44.7119C106.635 43.9767 117.042 28.9529 139.577 28.791C162.112 28.6292 173.47 44.7119 196.584 44.7119C219.699 44.7119 230.492 29.6346 253.591 28.791C276.69 27.9475 319.843 44.7119 319.843 44.7119" stroke="#7DE7EE" strokeWidth="2.05431"/>
            </g>
            <g>
              <path className="wave-line-3" d="M20.9412 44.768C20.9412 44.768 79.8933 19.9216 108.763 21.657C137.632 23.3925 150.203 44.465 179.123 44.768C208.043 45.0709 222.177 22.0629 252.051 21.657C281.924 21.2511 328.574 44.768 328.574 44.768" stroke="#435AB4" strokeWidth="2.05431"/>
            </g>
          </svg>
        </div>
      </div>

      <div className="arrival-info">
        <span>Arrival In</span>
        <strong className="time-remaining">45 min</strong>
      </div>

      {/* 3. Додаємо перехід при кліку */}
      <button className="stop-btn" onClick={() => navigate('/wake-up')}>
        Stop
      </button>
    </div>
  );
};

export default SleepTracking;