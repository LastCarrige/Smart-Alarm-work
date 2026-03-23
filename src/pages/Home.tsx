// src/pages/Home.tsx
import './Home.css';
import logo from '../assets/logo.svg';

const Home = () => {
  return (
    <div className="home-container">
      {/* 1. Наш логотип */}
      <img src={logo} alt="WayWake Logo" className="logo-img" />
      
      {/* 2. Текстові заголовки */}
      <h1 className="main-title">WayWake</h1>
      <p className="sub-title">Smart Wake for Travelers</p>
      
      {/* 3. Кнопка "Get started" */}
      <button className="start-button">
        Get started
      </button>
    </div>
  );
};

export default Home;