
/*import SleepTracking from './pages/SleepTracking';

function App() {
  return (
    <div className="App">
      <SleepTracking />
    </div>
  );
}*/


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Імпорт твоїх готових сторінок
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import RouteMap from './pages/RouteMap';
import SleepTracking from './pages/SleepTracking';

// Імпорт нових сторінок-заглушок
import TimeWakeUp from './pages/TimeWakeUp';
import WakeAlarm from './pages/WakeAlarm';
import SleepAnalysis from './pages/SleepAnalysis';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Кожна сторінка має свій унікальний шлях (path) */}
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/map" element={<RouteMap />} />
        <Route path="/tracking" element={<SleepTracking />} />
        
        {/* Нові маршрути за твоїм макетом */}
        <Route path="/wake-up" element={<TimeWakeUp />} />
        <Route path="/alarm" element={<WakeAlarm />} />
        <Route path="/analysis" element={<SleepAnalysis />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;