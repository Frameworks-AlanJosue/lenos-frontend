import { useState } from 'react';
import './ComentarioForm.css';
import { crearComentario } from '../api';

function ComentarioForm() {
  const [texto, setTexto] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarInseguro, setMostrarInseguro] = useState(false);

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setCargando(true);
    setRespuesta(null);

    try {
      const res = await crearComentario({ texto });
      setRespuesta({ ok: true, ...res.data });
      setTexto('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setRespuesta({ ok: false, error: 'Error al enviar: ' + errorMsg });
    } finally {
      setCargando(false);
    }
  };

  const ejemploXSS = () => {
    setTexto('<script>alert("¡Esto es un ataque XSS!")</script>');
  };

  return (
    <div className="comentarios-page">
      <div className="comentarios-container">
        <header className="comentarios-header">
          <span className="comentarios-icon">🛡️</span>
          <h1>Sistema de Comentarios Seguro</h1>
          <p className="comentarios-subtitle">
            Ejercicio de Seguridad con React y Node.js
          </p>
        </header>

        <div className="comentarios-card">
          <div className="form-section">
            <label htmlFor="comentario" className="form-label">
              ✏️ Escribe tu comentario:
            </label>
            <textarea
              id="comentario"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe algo aquí... Prueba a pegar código HTML o JavaScript para ver cómo React lo sanitiza automáticamente"
              rows={5}
              className="comentarios-textarea"
            />
            <div className="form-actions">
              <button
                type="button"
                onClick={ejemploXSS}
                className="btn-ejemplo"
                disabled={cargando}
              >
                🧪 Insertar ejemplo XSS
              </button>
              <button
                type="submit"
                onClick={enviarComentario}
                disabled={cargando || !texto.trim()}
                className="btn-enviar"
              >
                {cargando ? (
                  <>
                    <span className="spinner"></span>
                    Enviando...
                  </>
                ) : (
                  <>📤 Enviar Comentario</>
                )}
              </button>
            </div>
          </div>

          {respuesta && (
            <div className={`respuesta-section ${respuesta.ok ? 'exito' : 'error'}`}>
              {respuesta.ok ? (
                <>
                  <div className="respuesta-header">
                    <span className="respuesta-icon">✅</span>
                    <h3>Comentario recibido correctamente</h3>
                  </div>

                  <div className="respuesta-detalles">
                    <div className="detalle-item">
                      <span className="detalle-label">Mensaje:</span>
                      <span className="detalle-valor">{respuesta.mensaje}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Fecha:</span>
                      <span className="detalle-valor">
                        {new Date(respuesta.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>

                  <div className="comentario-recibido">
                    <h4>📝 Tu comentario (renderizado de forma segura):</h4>
                    <div className="comentario-box seguro">
                      {respuesta.comentario.texto}
                    </div>
                    <p className="comentario-nota">
                      💡 React escapó automáticamente cualquier código HTML/JavaScript malicioso
                    </p>
                  </div>

                  <div className="reto-seguridad">
                    <button
                      onClick={() => setMostrarInseguro(!mostrarInseguro)}
                      className="btn-reto"
                    >
                      {mostrarInseguro ? '🔒 Ocugar' : '⚠️ Ver demostración insegura (dangerouslySetInnerHTML)'}
                    </button>

                    {mostrarInseguro && (
                      <div className="comentario-inseguro">
                        <h4>🔴 ¡PELIGRO! Renderizado con dangerouslySetInnerHTML:</h4>
                        <div
                          className="comentario-box peligroso"
                          dangerouslySetInnerHTML={{ __html: respuesta.comentario.texto }}
                        />
                        <p className="advertencia">
                          ⚡ Si el comentario contenía código malicioso, podría haberse ejecutado.
                          <br />
                          <strong>NUNCA uses esto en producción con datos de usuarios.</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="error-mensaje">
                  <span className="error-icon">❌</span>
                  <p>{respuesta.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="info-seguridad">
          <h3>🔐 Sobre la Seguridad</h3>
          <ul>
            <li><strong>Helmet:</strong> Protege las cabeceras HTTP de la aplicación</li>
            <li><strong>CORS:</strong> Solo permite peticiones desde http://localhost:5173</li>
            <li><strong>Sanitización React:</strong> Escapa automáticamente el contenido JSX</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ComentarioForm;
