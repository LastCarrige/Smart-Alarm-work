import React from "react";
import { useNavigate } from "react-router-dom";
import "./WakeAlarm.css";

// Додаємо імпорти для графіка
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

// Імпорт асетів
import spaceBg from "../assets/images/background.webp";
import dividerLine from "../assets/images/Header-line.png";

const WakeAlarm: React.FC = () => {
  const navigate = useNavigate();

  // Дані для графіка (можеш змінювати значення value, щоб міняти висоту стовпчиків)
  const chartData = [
    { time: "00:00", value: 10, stage: "deep" },
    { time: "00:30", value: 0, stage: "none" },
    { time: "01:00", value: 30, stage: "light" },
    { time: "01:30", value: 0, stage: "none" },
    { time: "02:00", value: 45, stage: "deep" },
    { time: "02:30", value: 0, stage: "none" },
    { time: "03:00", value: 25, stage: "awake" },
    { time: "03:30", value: 70, stage: "rem" },
  ];

  const sleepStages = [
    { id: "awake", label: "Awake", percentage: 25, color: "#5EEAD4" },
    { id: "rem", label: "Rem", percentage: 70, color: "#9333EA" },
    { id: "light", label: "Light", percentage: 27, color: "#60A5FA" },
    { id: "deep", label: "Deep", percentage: 45, color: "#2563EB" },
  ];

  // Функція для підбору кольору стовпчика залежно від фази
  const getBarColor = (stageId: string) => {
    const stage = sleepStages.find((s) => s.id === stageId);
    return stage ? stage.color : "#1a448b"; // дефолтний колір, якщо фаза не знайдена
  };

  return (
    <div className="alarm-page" style={{ backgroundImage: `url(${spaceBg})` }}>
      <div className="alarm-content">
        <header className="alarm-header">
          <h1 className="title-big">Wake alarm</h1>
          <img src={dividerLine} className="line-separator" alt="" />
        </header>

        <section className="chart-section">
          <div className="chart-card">
            {/* Графік розтягується на всю ширину картки завдяки ResponsiveContainer */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -30, bottom: 0 }}
              >
                {/* Сітка на фоні (опціонально) */}
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  // ГОРОВНЕ ВИПРАВЛЕННЯ ТУТ:
                  interval={0} // Показувати ВСІ підписи часу без винятку
                  padding={{ left: 10, right: 10 }} // Додаємо відступи по боках, щоб текст не злипався
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  domain={[0, 100]}
                />

                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.stage)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="stages-section">
          <h2 className="section-title">Sleep Stages</h2>
          <div className="stages-container">
            {sleepStages.map((stage) => (
              <div key={stage.id} className="stage-item">
                <div className="stage-left-part">
                  <div className="icon-glow-wrapper">
                    <div
                      className="glow-sphere"
                      style={{ backgroundColor: stage.color }}
                    ></div>
                    <div
                      className="dot-core"
                      style={{ backgroundColor: stage.color }}
                    ></div>
                  </div>
                  <span className="stage-label">{stage.label}</span>
                </div>
                <span className="stage-percent">{stage.percentage}%</span>
              </div>
            ))}
          </div>
        </section>

        <button 
  className="btn-view-analysis" 
  onClick={() => navigate('/analysis')}
>
  View Analysis
</button>
      </div>
    </div>
  );
};

export default WakeAlarm;
