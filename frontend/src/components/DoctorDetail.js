import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../api';
import './DoctorDetail.css';

function DoctorDetail() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const doctorData = sessionStorage.getItem('doctor');
    if (!doctorData) {
      navigate('/doctor');
      return;
    }
    setDoctor(JSON.parse(doctorData));

    // Cargar detalles del assessment
    loadAssessmentDetail();
  }, [assessmentId, navigate]);

  const loadAssessmentDetail = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getAssessmentDetail(assessmentId);
      if (response.data.success) {
        setAssessment(response.data.assessment);
      }
    } catch (error) {
      console.error('Error al cargar assessment:', error);
      alert('Error al cargar los datos. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await doctorAPI.addComment({
        assessment_id: assessmentId,
        doctor_name: doctor.name,
        comment: comment
      });

      if (response.data.success) {
        alert('Comentario agregado exitosamente');
        setComment('');
        loadAssessmentDetail(); // Recargar para mostrar el nuevo comentario
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      alert('Error al agregar comentario. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const response = await doctorAPI.downloadReport(assessmentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_pulmocheck_${assessmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      alert('Error al descargar el reporte. Por favor intenta nuevamente.');
    } finally {
      setDownloading(false);
    }
  };

  const getRiskClass = (level) => {
    switch (level) {
      case 'Bajo':
        return 'success';
      case 'Moderado':
        return 'warning';
      case 'Alto':
        return 'danger';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <div className="doctor-detail">
        <div className="container">
          <div className="loading-container">
            <span className="loading"></span>
            <p>Cargando detalles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="doctor-detail">
        <div className="container">
          <div className="error-container">
            <p>Assessment no encontrado</p>
            <button className="btn-primary" onClick={() => navigate('/doctor/dashboard')}>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-detail">
      <div className="container">
        <div className="detail-header">
          <div>
            <button className="btn-back" onClick={() => navigate('/doctor/dashboard')}>
              ← Volver al Dashboard
            </button>
            <h1>Detalle de Evaluación #{assessmentId}</h1>
          </div>
          <button
            className="btn-secondary"
            onClick={handleDownloadReport}
            disabled={downloading}
          >
            {downloading ? 'Descargando...' : '📥 Descargar Reporte'}
          </button>
        </div>

        <div className="detail-grid">
          {/* Información del Paciente */}
          <div className="card patient-info">
            <h3>👤 Información del Paciente</h3>
            <div className="info-row">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{assessment.patient_name}</span>
            </div>
            {assessment.patient_email && (
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{assessment.patient_email}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Edad:</span>
              <span className="info-value">{assessment.age} años</span>
            </div>
            <div className="info-row">
              <span className="info-label">Género:</span>
              <span className="info-value">{assessment.gender}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Fecha de evaluación:</span>
              <span className="info-value">
                {new Date(assessment.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Score de Riesgo */}
          <div className={`card risk-summary risk-${getRiskClass(assessment.risk_level)}`}>
            <h3>📊 Evaluación de Riesgo</h3>
            <div className="risk-display">
              <div className="risk-score-big">{assessment.risk_score}/100</div>
              <div className="risk-level-big">{assessment.risk_level}</div>
            </div>
            <div className="score-bar">
              <div
                className="score-fill"
                style={{ width: `${assessment.risk_score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Factores de Riesgo */}
        <div className="card">
          <h3>🚬 Factores de Riesgo</h3>
          <div className="factors-grid">
            <div className="factor-item">
              <strong>Años fumando:</strong> {assessment.years_smoking}
            </div>
            <div className="factor-item">
              <strong>Cigarrillos/día:</strong> {assessment.cigarettes_per_day}
            </div>
            <div className="factor-item">
              <strong>Antecedentes familiares:</strong> {assessment.family_history ? 'Sí' : 'No'}
            </div>
            <div className="factor-item">
              <strong>Tos persistente:</strong> {assessment.persistent_cough ? 'Sí' : 'No'}
            </div>
            <div className="factor-item">
              <strong>Disnea:</strong> {assessment.dyspnea ? 'Sí' : 'No'}
            </div>
            <div className="factor-item">
              <strong>Hemoptisis:</strong> {assessment.hemoptysis ? 'Sí' : 'No'}
            </div>
            <div className="factor-item">
              <strong>Exposición a asbestos:</strong> {assessment.asbestos_exposure ? 'Sí' : 'No'}
            </div>
            <div className="factor-item">
              <strong>EPOC/Enfisema:</strong> {assessment.copd_emphysema ? 'Sí' : 'No'}
            </div>
            {assessment.last_ct && (
              <div className="factor-item">
                <strong>Última TC:</strong> {assessment.last_ct}
              </div>
            )}
          </div>
        </div>

        {/* Recomendación */}
        <div className="card">
          <h3>📋 Recomendación Automática</h3>
          <p className="recommendation-text">{assessment.recommendation}</p>
        </div>

        {/* Análisis de Imagen */}
        {assessment.image_path && (
          <div className="card">
            <h3>🖼️ Imagen Médica</h3>
            <div className="image-info">
              <p>✅ Imagen cargada: <strong>{assessment.image_path.split('/').pop()}</strong></p>
            </div>

            {assessment.ml_analysis && (
              <div className="ml-analysis">
                <h4>🤖 Análisis de IA</h4>
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <strong>Nódulos detectados:</strong>
                    <span className={assessment.ml_analysis.nodules_detected ? 'text-warning' : 'text-success'}>
                      {assessment.ml_analysis.nodules_detected ? 'Sí' : 'No'}
                    </span>
                  </div>
                  {assessment.ml_analysis.nodules_detected && (
                    <>
                      <div className="analysis-item">
                        <strong>Cantidad:</strong> {assessment.ml_analysis.nodule_count}
                      </div>
                      <div className="analysis-item">
                        <strong>Tamaño mayor:</strong> {assessment.ml_analysis.largest_nodule_mm} mm
                      </div>
                      <div className="analysis-item">
                        <strong>Riesgo de malignidad:</strong>{' '}
                        {(assessment.ml_analysis.malignancy_risk * 100).toFixed(0)}%
                      </div>
                    </>
                  )}
                  <div className="analysis-item">
                    <strong>Confianza:</strong> {(assessment.ml_analysis.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="alert alert-info">
                  <strong>Nota:</strong> {assessment.ml_analysis.note}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comentarios Previos */}
        {assessment.comments && assessment.comments.length > 0 && (
          <div className="card">
            <h3>💬 Comentarios Previos</h3>
            <div className="comments-list">
              {assessment.comments.map((c, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <strong>{c.doctor_name}</strong>
                    <span className="comment-date">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agregar Comentario */}
        <div className="card">
          <h3>✍️ Agregar Comentario Médico</h3>
          <form onSubmit={handleCommentSubmit}>
            <div className="form-group">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tus observaciones y recomendaciones para el paciente..."
                rows="6"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !comment.trim()}
            >
              {submitting ? (
                <>
                  <span className="loading"></span> Guardando...
                </>
              ) : (
                'Guardar Comentario'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetail;

