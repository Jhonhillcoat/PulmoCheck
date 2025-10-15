import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI, doctorAPI } from '../api';
import './Results.css';

function Results() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // En una implementación real, cargaríamos el assessment desde el backend
    // Para este MVP, usamos los datos del localStorage o props
    const savedResult = sessionStorage.getItem('assessmentResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, [assessmentId]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 50MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const response = await assessmentAPI.uploadImage(assessmentId, selectedFile);
      if (response.data.success) {
        setUploadSuccess(true);
        alert('Imagen subida exitosamente. Puedes proceder al análisis.');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Por favor intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await assessmentAPI.analyze(assessmentId);
      if (response.data.success) {
        setAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error('Error al analizar:', error);
      alert('Error al analizar la imagen. Por favor intenta nuevamente.');
    } finally {
      setAnalyzing(false);
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

  const getRiskColor = (level) => {
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

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Bajo':
        return '✅';
      case 'Moderado':
        return '⚠️';
      case 'Alto':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  // Simulación temporal de resultado si no hay en sessionStorage
  const mockResult = {
    risk_score: 65,
    risk_level: 'Moderado',
    recommendation: 'Su riesgo es moderado. Se recomienda consultar con su médico sobre la conveniencia de realizar una tomografía computada de tórax de baja dosis (LDCT).',
    factors: [
      'Edad 55-64 años: +15',
      '20+ años fumando: +15',
      '20+ cigarrillos/día: +20',
      'Antecedentes familiares: +10',
      'EPOC/Enfisema: +10'
    ]
  };

  const displayResult = result || mockResult;

  return (
    <div className="results">
      <div className="container">
        <div className="results-header">
          <h1>Resultados de tu Evaluación</h1>
          <p>Assessment ID: #{assessmentId}</p>
        </div>

        {/* Score y Nivel de Riesgo */}
        <div className={`card risk-card risk-${getRiskColor(displayResult.risk_level)}`}>
          <div className="risk-header">
            <div className="risk-icon">{getRiskIcon(displayResult.risk_level)}</div>
            <div className="risk-info">
              <h2>Nivel de Riesgo: {displayResult.risk_level}</h2>
              <div className="risk-score">
                <span className="score-label">Score de Riesgo:</span>
                <span className="score-value">{displayResult.risk_score}/100</span>
              </div>
            </div>
          </div>
          <div className="score-bar">
            <div 
              className="score-fill"
              style={{ width: `${displayResult.risk_score}%` }}
            ></div>
          </div>
        </div>

        {/* Recomendación */}
        <div className="card">
          <h3>📋 Recomendación</h3>
          <p className="recommendation-text">{displayResult.recommendation}</p>
        </div>

        {/* Factores Evaluados */}
        {displayResult.factors && displayResult.factors.length > 0 && (
          <div className="card">
            <h3>📊 Factores de Riesgo Identificados</h3>
            <ul className="factors-list">
              {displayResult.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Subida de Imagen */}
        {displayResult.risk_level !== 'Bajo' && (
          <div className="card upload-card">
            <h3>🏥 Subir Imagen Médica (DICOM o JPG)</h3>
            <p className="upload-description">
              Si ya cuentas con una tomografía computada de tórax, puedes subirla 
              para obtener un análisis preliminar mediante inteligencia artificial.
            </p>

            <div className="upload-area">
              <input
                type="file"
                id="file-input"
                accept=".dcm,.dicom,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="file-label">
                📁 Seleccionar Archivo
              </label>
              {selectedFile && (
                <div className="file-info">
                  <p>Archivo seleccionado: <strong>{selectedFile.name}</strong></p>
                  <p>Tamaño: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
            </div>

            {selectedFile && !uploadSuccess && (
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="loading"></span> Subiendo...
                  </>
                ) : (
                  '⬆️ Subir Imagen'
                )}
              </button>
            )}

            {uploadSuccess && !analysis && (
              <div>
                <div className="alert alert-success">
                  ✅ Imagen subida exitosamente
                </div>
                <button
                  className="btn-primary"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <span className="loading"></span> Analizando...
                    </>
                  ) : (
                    '🤖 Analizar con IA'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Resultados del Análisis ML */}
        {analysis && (
          <div className={`card analysis-card ${analysis.nodules_detected ? 'alert-warning' : 'alert-success'}`}>
            <h3>🤖 Resultados del Análisis de IA</h3>
            
            <div className="analysis-result">
              <div className="analysis-item">
                <strong>Estado:</strong> {analysis.status === 'completed' ? 'Completado' : 'En proceso'}
              </div>
              <div className="analysis-item">
                <strong>Nódulos detectados:</strong> {analysis.nodules_detected ? 'Sí' : 'No'}
              </div>
              {analysis.nodules_detected && (
                <>
                  <div className="analysis-item">
                    <strong>Cantidad:</strong> {analysis.nodule_count}
                  </div>
                  <div className="analysis-item">
                    <strong>Tamaño del nódulo mayor:</strong> {analysis.largest_nodule_mm} mm
                  </div>
                  <div className="analysis-item">
                    <strong>Riesgo de malignidad:</strong> {(analysis.malignancy_risk * 100).toFixed(0)}%
                  </div>
                </>
              )}
              <div className="analysis-item">
                <strong>Confianza del modelo:</strong> {(analysis.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <div className={`alert ${analysis.nodules_detected ? 'alert-warning' : 'alert-info'}`}>
              <strong>Recomendación IA:</strong> {analysis.recommendation}
            </div>

            <div className="alert alert-info">
              <strong>⚠️ {analysis.note}</strong>
            </div>
          </div>
        )}

        {/* Próximos Pasos */}
        <div className="card next-steps">
          <h3>🎯 Próximos Pasos</h3>
          <ol className="steps-list">
            <li>
              <strong>Consulta Médica:</strong> Programa una cita con tu médico de cabecera 
              o un especialista en neumología para discutir estos resultados.
            </li>
            <li>
              <strong>Descargar Reporte:</strong> Lleva una copia de este reporte a tu consulta médica.
              <button
                className="btn-secondary download-btn"
                onClick={handleDownloadReport}
                disabled={downloading}
              >
                {downloading ? 'Descargando...' : '📥 Descargar Reporte PDF'}
              </button>
            </li>
            {displayResult.risk_level === 'Alto' && (
              <li>
                <strong>Urgente:</strong> Dada tu evaluación de alto riesgo, 
                se recomienda realizar una tomografía LDCT lo antes posible.
              </li>
            )}
            <li>
              <strong>Prevención:</strong> Si actualmente fumas, considera programas 
              de cesación tabáquica. Nunca es tarde para dejar de fumar.
            </li>
          </ol>
        </div>

        {/* Disclaimer */}
        <div className="card disclaimer-card">
          <h4>⚕️ Información Importante</h4>
          <p>
            Esta evaluación es una herramienta de orientación educativa basada en 
            factores de riesgo establecidos. <strong>NO constituye un diagnóstico médico</strong> 
            y no reemplaza la evaluación profesional de un médico especialista.
          </p>
          <p>
            El análisis de imágenes por IA es preliminar y <strong>debe ser confirmado 
            por un radiólogo certificado</strong>. Los resultados pueden tener falsos 
            positivos o falsos negativos.
          </p>
          <p>
            <strong>Si experimentas síntomas graves como dificultad respiratoria severa, 
            tos con sangre o dolor torácico intenso, busca atención médica de emergencia 
            inmediatamente.</strong>
          </p>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            ← Volver al Inicio
          </button>
          <button className="btn-primary" onClick={() => navigate('/assessment')}>
            Nueva Evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;

