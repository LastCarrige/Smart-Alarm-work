import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';
import logo from '../assets/logo.svg';
// 1. ДОДАЄМО ІМПОРТ:
import { useNavigate } from 'react-router-dom'; 

const RouteMap = () => {
  // 2. АКТИВУЄМО ШТУРМАНА:
  const navigate = useNavigate();

  // Координати для прикладу
  const position: [number, number] = [49.8397, 24.0297];
  const destination: [number, number] = [49.832, 24.04];

  return (
    <div className="map-page-container">
      <header className="map-header">
        {/* Кнопка "назад" вже працює через window.history.back() - це ок */}
        <button className="back-btn" onClick={() => window.history.back()}>←</button>
        <h1>Route Map</h1>
        <img src={logo} alt="Logo" className="logo-icon-corner" />
      </header>

      <div className="map-wrapper">
        <MapContainer center={position} zoom={13} zoomControl={false} className="leaflet-container-view">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position} />
          <Marker position={destination} />
          <Polyline positions={[position, destination]} color="#6188DB" />
        </MapContainer>
        
        <div className="map-overlay-text">
            Тут буде реальна карта, тому я просто накинула макет
        </div>
      </div>

      <div className="info-cards">
        <div className="info-item">
          <span>Distance</span>
          <strong>52 km</strong>
        </div>
        <div className="info-item">
          <span>Arrival</span>
          <strong>08:10</strong>
        </div>
      </div>

      {/* 3. ОНОВЛЮЄМО КНОПКУ: */}
      <button 
        className="sleep-mode-btn"
        onClick={() => navigate('/tracking')} // Кажемо: "лети на екран сну"
      >
        Start sleep mode
      </button>
    </div>
  );
};

export default RouteMap;