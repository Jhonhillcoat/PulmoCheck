import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <div className="hero-icon">🫁</div>
          <h1 className="hero-title">Bienvenido a PulmoCheck</h1>
          <p className="hero-subtitle">
            Plataforma de detección temprana del cáncer de pulmón
          </p>
          <p className="hero-description">
            La detección temprana salva vidas. Evalúa tu riesgo en minutos 
            mediante nuestro cuestionario clínico basado en guías internacionales.
          </p>
          <button 
            className="btn-primary btn-large"
            onClick={() => navigate('/assessment')}
          >
            Evaluá tu Riesgo Ahora
          </button>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Cuestionario Clínico</h3>
            <p>
              Basado en guías NCCN/USPSTF. Evaluamos factores de riesgo 
              como edad, historial de tabaquismo y síntomas.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Análisis con IA</h3>
            <p>
              Procesamiento de imágenes médicas con modelos de Machine Learning 
              para identificar posibles nódulos pulmonares.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Revisión Médica</h3>
            <p>
              Los profesionales de la salud pueden revisar los resultados 
              y proporcionar recomendaciones personalizadas.
            </p>
          </div>
        </div>

        <div className="info-section">
          <h2>¿Por qué es importante la detección temprana?</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-number">90%</div>
              <p>Tasa de supervivencia cuando se detecta en etapa temprana</p>
            </div>
            <div className="info-item">
              <div className="info-number">1.8M</div>
              <p>Nuevos casos de cáncer de pulmón cada año en el mundo</p>
            </div>
            <div className="info-item">
              <div className="info-number">20%</div>
              <p>Reducción de mortalidad con detección temprana por LDCT</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>¿Listo para comenzar?</h2>
          <p>
            Completa nuestra evaluación de riesgo en solo 5 minutos y obtén 
            recomendaciones personalizadas basadas en tus factores de riesgo.
          </p>
          <button 
            className="btn-primary btn-large"
            onClick={() => navigate('/assessment')}
          >
            Comenzar Evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

