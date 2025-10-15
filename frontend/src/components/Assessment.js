import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../api';
import './Assessment.css';

function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    age: '',
    gender: '',
    years_smoking: '',
    cigarettes_per_day: '',
    family_history: false,
    persistent_cough: false,
    dyspnea: false,
    hemoptysis: false,
    last_ct: '',
    asbestos_exposure: false,
    copd_emphysema: false,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await assessmentAPI.create(formData);
      const { assessment_id, risk_score, risk_level, recommendation, factors } = response.data;
      
      // Guardar resultado en sessionStorage para la página de resultados
      sessionStorage.setItem('assessmentResult', JSON.stringify({
        risk_score,
        risk_level,
        recommendation,
        factors
      }));
      
      navigate(`/results/${assessment_id}`);
    } catch (error) {
      console.error('Error al crear assessment:', error);
      alert('Hubo un error al procesar tu evaluación. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.patient_name && formData.age && formData.gender;
      case 2:
        return formData.years_smoking !== '' && formData.cigarettes_per_day !== '';
      case 3:
        return true; // Síntomas son opcionales
      case 4:
        return true; // Factores adicionales son opcionales
      default:
        return false;
    }
  };

  return (
    <div className="assessment">
      <div className="container">
        <div className="assessment-header">
          <h1>Evaluación de Riesgo de Cáncer de Pulmón</h1>
          <p>Completa el cuestionario para obtener tu evaluación personalizada</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Paso {step} de {totalSteps}</p>
        </div>

        <div className="card assessment-card">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="step">
                <h2>Información Personal</h2>
                <div className="form-group">
                  <label htmlFor="patient_name">Nombre completo *</label>
                  <input
                    type="text"
                    id="patient_name"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="patient_email">Email (opcional)</label>
                  <input
                    type="email"
                    id="patient_email"
                    name="patient_email"
                    value={formData.patient_email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Edad *</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="120"
                      placeholder="45"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Género *</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step">
                <h2>Historial de Tabaquismo</h2>
                <div className="form-group">
                  <label htmlFor="years_smoking">¿Cuántos años has fumado o fumaste? *</label>
                  <input
                    type="number"
                    id="years_smoking"
                    name="years_smoking"
                    value={formData.years_smoking}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="10"
                    required
                  />
                  <small>Incluye años actuales y pasados. Si nunca fumaste, ingresa 0.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="cigarettes_per_day">¿Cuántos cigarrillos fumabas/fumas por día en promedio? *</label>
                  <input
                    type="number"
                    id="cigarettes_per_day"
                    name="cigarettes_per_day"
                    value={formData.cigarettes_per_day}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="20"
                    required
                  />
                  <small>Promedio durante tu período de mayor consumo. Si nunca fumaste, ingresa 0.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="last_ct">¿Cuándo fue tu última tomografía de tórax?</label>
                  <select
                    id="last_ct"
                    name="last_ct"
                    value={formData.last_ct}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Nunca">Nunca</option>
                    <option value="Menos de 1 año">Menos de 1 año</option>
                    <option value="1-2 años">1-2 años</option>
                    <option value="Más de 2 años">Más de 2 años</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step">
                <h2>Síntomas Actuales</h2>
                <p className="step-description">
                  Marca los síntomas que has experimentado recientemente
                </p>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="persistent_cough"
                      checked={formData.persistent_cough}
                      onChange={handleChange}
                    />
                    <span>Tos persistente (más de 3 semanas)</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="dyspnea"
                      checked={formData.dyspnea}
                      onChange={handleChange}
                    />
                    <span>Dificultad para respirar (disnea)</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hemoptysis"
                      checked={formData.hemoptysis}
                      onChange={handleChange}
                    />
                    <span>Tos con sangre (hemoptisis)</span>
                  </label>
                </div>

                <div className="alert alert-info">
                  <strong>Nota:</strong> Si experimentas hemoptisis (tos con sangre), 
                  busca atención médica inmediata independientemente de los resultados 
                  de esta evaluación.
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step">
                <h2>Factores de Riesgo Adicionales</h2>
                <p className="step-description">
                  Información sobre otros factores de riesgo
                </p>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="family_history"
                      checked={formData.family_history}
                      onChange={handleChange}
                    />
                    <span>Antecedentes familiares de cáncer de pulmón</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="asbestos_exposure"
                      checked={formData.asbestos_exposure}
                      onChange={handleChange}
                    />
                    <span>Exposición a asbestos u otros carcinógenos ocupacionales</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="copd_emphysema"
                      checked={formData.copd_emphysema}
                      onChange={handleChange}
                    />
                    <span>Diagnóstico de EPOC o enfisema</span>
                  </label>
                </div>
              </div>
            )}

            <div className="button-group">
              {step > 1 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePrev}
                  disabled={loading}
                >
                  ← Anterior
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !isStepValid()}
                >
                  {loading ? (
                    <>
                      <span className="loading"></span> Procesando...
                    </>
                  ) : (
                    'Obtener Resultados'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Assessment;

