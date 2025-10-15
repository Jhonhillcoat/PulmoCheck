import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../api';
import './DoctorLogin.css';

function DoctorLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await doctorAPI.login(credentials);
      if (response.data.success) {
        // Guardar info del doctor en sessionStorage
        sessionStorage.setItem('doctor', JSON.stringify(response.data.doctor));
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales inválidas. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-login">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <div className="login-icon">👨‍⚕️</div>
            <h1>Portal Médico</h1>
            <p>Acceso para profesionales de la salud</p>
          </div>

          <div className="card login-card">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading"></span> Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="demo-info">
              <h4>🔐 Credenciales de Demo</h4>
              <p><strong>Usuario:</strong> doctor</p>
              <p><strong>Contraseña:</strong> doctor123</p>
            </div>
          </div>

          <div className="info-card">
            <h3>Acerca del Portal Médico</h3>
            <p>
              El portal médico permite a los profesionales de la salud:
            </p>
            <ul>
              <li>Revisar evaluaciones de riesgo de pacientes</li>
              <li>Ver resultados de análisis de imágenes por IA</li>
              <li>Dejar comentarios y recomendaciones</li>
              <li>Generar reportes en PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;

