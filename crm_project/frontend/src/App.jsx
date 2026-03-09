import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Visits from './pages/Visits';
import Agents from './pages/Agents';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/agents" element={<Agents />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;