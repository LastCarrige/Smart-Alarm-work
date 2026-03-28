import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Обов'язково для відображення карти
import './RouteMap.css';
import logo from '../assets/logo.svg';

const RouteMap = () => {
  // Координати для прикладу (Львів)
  const position: [number, number] = [49.8397, 24.0297];
  const destination: [number, number] = [49.832, 24.04];

  return (
    <div className="map-page-container">
      <header className="map-header">
        <button className="back-btn" onClick={() => window.history.back()}>←</button>
        <h1>Route Map</h1>
        <img src={logo} alt="Logo" className="small-logo-corner" />
      </header>

      <div className="map-wrapper">
        <MapContainer center={position} zoom={13} zoomControl={false} className="leaflet-container-view">
          {/* Це шар самої карти (стиль "Dark Matter" добре підійде під твій дизайн) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position} />
          <Marker position={destination} />
          <Polyline positions={[position, destination]} color="#6188DB" />
        </MapContainer>
        
        {/* Текст поверх карти, як у Figma */}
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

      <button className="sleep-mode-btn">Start sleep mode</button>
    </div>
  );
};

export default RouteMap;