import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../api';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Verificar autenticación
    const doctorData = sessionStorage.getItem('doctor');
    if (!doctorData) {
      navigate('/doctor');
      return;
    }
    setDoctor(JSON.parse(doctorData));

    // Cargar assessments
    loadAssessments();
  }, [navigate]);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getAssessments();
      if (response.data.success) {
        setAssessments(response.data.assessments);
      }
    } catch (error) {
      console.error('Error al cargar assessments:', error);
      alert('Error al cargar los datos. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('doctor');
    navigate('/doctor');
  };

  const getRiskClass = (level) => {
    switch (level) {
      case 'Bajo':
        return 'risk-low';
      case 'Moderado':
        return 'risk-moderate';
      case 'Alto':
        return 'risk-high';
      default:
        return '';
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    if (filter === 'all') return true;
    return assessment.risk_level === filter;
  });

  return (
    <div className="doctor-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Panel Médico</h1>
            <p>Bienvenido, {doctor?.name}</p>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{assessments.length}</div>
              <div className="stat-label">Total Evaluaciones</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <div className="stat-number">
                {assessments.filter(a => a.risk_level === 'Alto').length}
              </div>
              <div className="stat-label">Riesgo Alto</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <div className="stat-number">
                {assessments.filter(a => a.risk_level === 'Moderado').length}
              </div>
              <div className="stat-label">Riesgo Moderado</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">
                {assessments.filter(a => a.risk_level === 'Bajo').length}
              </div>
              <div className="stat-label">Riesgo Bajo</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-header">
            <h2>Evaluaciones de Pacientes</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todas
              </button>
              <button
                className={`filter-btn ${filter === 'Alto' ? 'active' : ''}`}
                onClick={() => setFilter('Alto')}
              >
                Alto Riesgo
              </button>
              <button
                className={`filter-btn ${filter === 'Moderado' ? 'active' : ''}`}
                onClick={() => setFilter('Moderado')}
              >
                Moderado
              </button>
              <button
                className={`filter-btn ${filter === 'Bajo' ? 'active' : ''}`}
                onClick={() => setFilter('Bajo')}
              >
                Bajo
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <span className="loading"></span>
              <p>Cargando evaluaciones...</p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="empty-state">
              <p>No hay evaluaciones que mostrar</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="assessments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Edad</th>
                    <th>Score</th>
                    <th>Riesgo</th>
                    <th>Imagen</th>
                    <th>Comentarios</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map(assessment => (
                    <tr key={assessment.id}>
                      <td>#{assessment.id}</td>
                      <td><strong>{assessment.patient_name}</strong></td>
                      <td>{assessment.age}</td>
                      <td><strong>{assessment.risk_score}</strong></td>
                      <td>
                        <span className={`risk-badge ${getRiskClass(assessment.risk_level)}`}>
                          {assessment.risk_level}
                        </span>
                      </td>
                      <td>
                        {assessment.image_path ? '✅' : '❌'}
                      </td>
                      <td>
                        {assessment.comment_count > 0 ? (
                          <span className="comment-badge">{assessment.comment_count}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{new Date(assessment.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/doctor/assessment/${assessment.id}`)}
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;

