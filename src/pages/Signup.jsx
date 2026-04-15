import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../api'
import './Auth.css'

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setError('Las contraseñas no coinciden')
    }
    
    setLoading(true)
    setError('')
    try {
      const { data } = await signup({
        username: form.username,
        password: form.password
      })
      if (data.ok) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta. El usuario podría ya existir.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <span className="auth-logo">📝</span>
          <h1>Crear Cuenta</h1>
          <p>Únete como administrador de Leños Rellenos</p>
        </div>

        {success ? (
          <div className="auth-success">
            <span className="success-icon">✅</span>
            <h3>¡Registro exitoso!</h3>
            <p>Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nombre de Usuario</label>
              <input 
                type="text" 
                placeholder="Ej: nuevo_admin"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input 
                type="password" 
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
          <Link to="/" className="back-link">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
