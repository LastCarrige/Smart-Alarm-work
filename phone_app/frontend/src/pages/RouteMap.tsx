import React, { useEffect, useState } from 'react'; 
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';
import logo from '../assets/logo.svg';
import dividerLine from "../assets/images/Header-line.png";
import arrowSvg from "../assets/images/arrow-back.svg";
import { useNavigate } from 'react-router-dom';

const RecenterMap = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  map.setView(coords, 15);
  return null;
};

const RouteMap = () => {
  const navigate = useNavigate();

  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.log("Користувач заборонив доступ або помилка")
    );
  }, []);

  return (
    <div className="map-page-container">
      <header className="map-header">
        <button className="back-btn-wrapper" onClick={() => navigate(-1)}>
          <div className="back-btn-circle">
            <img src={arrowSvg} alt="Back" className="back-arrow-img" />
          </div>
        </button>
        <h1>Route Map</h1>
        <img src={logo} alt="Logo" className="small-logo-top" />
        <img src={dividerLine} className="line-separator-analysis" alt="" />
      </header>

      <div className="map-wrapper">
        <MapContainer 
          center={position || [48.3794, 31.1656]} 
          zoom={13} 
          zoomControl={false} 
          className="leaflet-container-view"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          
          {position && (
            <>
              <RecenterMap coords={position} />
              <Marker position={position} />
            </>
          )}
        </MapContainer>
        
        <div className="map-overlay-text">
            {position ? "Ваша геопозиція знайдена" : "Шукаємо ваше місцезнаходження..."}
        </div>
      </div>

      <div className="info-cards">
        <div className="info-item">
          <span>Distance</span>
          <strong>— km</strong> 
        </div>
        <div className="info-item">
          <span>Arrival</span>
          <strong>— : —</strong> 
        </div>
      </div>

      <button className="sleep-mode-btn" onClick={() => navigate('/tracking')}>
        Start sleep mode
      </button>
    </div>
  );
};

export default RouteMap;