import { useNavigate } from 'react-router-dom';
import './PlanTrip.css';
import logo from '../assets/logo.svg';

const PlanTrip = () => {
  const navigate = useNavigate();

  return (
    <div className="plan-container">
      <header className="plan-header">
        <div className="text-group">
          <h1>Plan Your Trip</h1>
          <p>Set your destination and arrival time</p>
        </div>
        {/* Використовуємо наш універсальний клас */}
        <img src={logo} alt="Logo" className="logo-icon-corner" />
      </header>

      <div className="input-list">
        <div className="input-card">
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none"><circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/><path d="M7 18L26 9L17 28L15 20L7 18Z" stroke="#9FC4FF" strokeWidth="2"/></svg>
          <div className="input-text"><span>From</span><strong>Current location</strong></div>
        </div>
        <div className="input-card">
          <div className="input-text"><span>To</span><strong>Lviv Station</strong></div>
        </div>
        <div className="input-card">
          <div className="input-text"><span>Arrival Time</span><strong>08:10</strong></div>
        </div>
      </div>

      <button className="continue-btn" onClick={() => navigate('/map')}>
        Continue
      </button>
    </div>
  );
};

export default PlanTrip;