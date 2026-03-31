// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../assets/logo.svg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img src={logo} alt="WayWake Logo" className="logo-img" />
      <h1 className="main-title">WayWake</h1>
      <p className="sub-title">Smart Wake for Travelers</p>
      
      <button className="start-button" onClick={() => navigate('/plan')}>
        Get started
      </button>

      <div className="top-nav-icons">
        <button className="icon-btn" onClick={() => navigate('/settings')}>⚙️</button>
        <button className="icon-btn" onClick={() => navigate('/analysis')}>📊</button>
      </div>
    </div>
  );
};

export default Home;