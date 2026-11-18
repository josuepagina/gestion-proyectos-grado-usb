import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import './Auth.css'

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'estudiante' as 'estudiante' | 'tutor' | 'revisor' | 'administrador',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore((state) => state.register)
  const { success, error: showError, warning } = useToastStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Las contraseñas no coinciden'
      setError(errorMsg)
      warning(errorMsg)
      return
    }

    if (formData.password.length < 6) {
      const errorMsg = 'La contraseña debe tener al menos 6 caracteres'
      setError(errorMsg)
      warning(errorMsg)
      return
    }

    setLoading(true)

    try {
      await register({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
      })
      success('¡Cuenta creada exitosamente! Bienvenido al sistema')
      navigate('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al registrarse'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registro</h1>
        <p className="auth-subtitle">Crea tu cuenta en el sistema</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Nombre</label>
            <input
              type="text"
              className="input"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">Apellidos</label>
            <input
              type="text"
              className="input"
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">Rol</label>
            <select
              className="input"
              value={formData.rol}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rol: e.target.value as typeof formData.rol,
                })
              }
              disabled={loading}
            >
              <option value="estudiante">Estudiante</option>
              <option value="tutor">Tutor</option>
              <option value="revisor">Revisor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Contraseña</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">Confirmar Contraseña</label>
            <input
              type="password"
              className="input"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}

