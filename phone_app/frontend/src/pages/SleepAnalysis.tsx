import React from "react";
import { useNavigate } from "react-router-dom";
import "./SleepAnalysis.css";
import dividerLine from "../assets/images/Header-line.png";
import arrowSvg from "../assets/images/arrow-back.svg";
import moonIcon from "../assets/images/moon-icon.svg";
import chartIcon from "../assets/images/quality-icon.svg"; // Додали іконку графіка
import spaceBg from "../assets/images/background.webp";

const SleepAnalysis: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="analysis-page"
      style={{ backgroundImage: `url(${spaceBg})` }}
    >
      <div className="analysis-content">
        {/* ШАПКА */}
        <header className="analysis-header">
          <div className="header-row">
            <button className="back-btn-wrapper" onClick={() => navigate(-1)}>
              <div className="back-btn-circle">
                <img src={arrowSvg} alt="Back" className="back-arrow-img" />
              </div>
            </button>
            <h1 className="title-text">Sleep analysis</h1>
          </div>
          <img src={dividerLine} className="line-separator-analysis" alt="" />
        </header>

        {/* КАРТКИ СТАТИСТИКИ */}
        <div className="stats-row">
          {/* Картка 1: Тривалість сну */}
          <div className="stat-card">
            <div className="stat-card-inner">
              <img src={moonIcon} className="stat-icon-moon-simple" alt="Moon" />
              <div className="stat-text">
                <span className="stat-label">Sleep Duration</span>
                <strong className="stat-value">3h 25m</strong>
              </div>
            </div>
          </div>

          {/* Картка 2: Якість сну */}
          <div className="stat-card">
            <div className="stat-card-inner">
              {/* Додав іконку графіка сюди */}
              <img src={chartIcon} className="stat-icon-quality" alt="Quality" /> 
              <div className="stat-text">
                <span className="stat-label">Sleep Quality</span>
                <strong className="stat-value-percent">82%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ГРАФІК (Sleep Pattern) */}
        <section className="pattern-section">
          <div className="pattern-card-bg">
            <span className="pattern-title">Sleep Pattern</span>
            <div className="wave-placeholder">
              <svg viewBox="0 0 200 40">
                <path
                  className="wave-line-1"
                  d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20"
                  fill="none"
                  strokeWidth="2"
                />
                <path
                  className="wave-line-2"
                  d="M0 20 Q 25 35, 50 20 T 100 20 T 150 20 T 200 20"
                  fill="none"
                  strokeWidth="2"
                />
                <path
                  className="wave-line-3"
                  d="M0 20 Q 25 15, 50 20 T 100 20 T 150 20 T 200 20"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* ІНСАЙТИ */}
        <section className="insights-container">
          <h2 className="insights-title">Insights</h2>
          <div className="insight-box">
            <p>
              <span className="text-cyan">Good job!</span> You got 22% deep
              sleep.
            </p>
          </div>
          <div className="insight-box">
            <p>
              Your REM sleep was <span className="text-purple">18%</span> of
              total sleep time.
            </p>
          </div>
        </section>

        {/* КНОПКИ ДІЙ */}
        <div className="analysis-actions">
        <button className="btn-settings" onClick={() => navigate('/settings')}>Settings</button>
          <button className="btn-new-trip" onClick={() => navigate("/plan")}>
          New trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepAnalysis;