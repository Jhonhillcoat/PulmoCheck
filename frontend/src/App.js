import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Assessment from './components/Assessment';
import Results from './components/Results';
import DoctorLogin from './components/DoctorLogin';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorDetail from './components/DoctorDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo">
                <span className="logo-icon">🫁</span>
                <span className="logo-text">PulmoCheck</span>
              </Link>
              <nav className="nav">
                <Link to="/" className="nav-link">Inicio</Link>
                <Link to="/assessment" className="nav-link">Evaluación</Link>
                <Link to="/doctor" className="nav-link">Portal Médico</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results/:assessmentId" element={<Results />} />
            <Route path="/doctor" element={<DoctorLogin />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/assessment/:assessmentId" element={<DoctorDetail />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>🫁 PulmoCheck - Detección temprana del cáncer de pulmón</p>
            <p className="footer-disclaimer">
              <strong>IMPORTANTE:</strong> Esta herramienta es de carácter educativo y orientativo. 
              No reemplaza el diagnóstico médico profesional. Consulte siempre con un especialista.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

