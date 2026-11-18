import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import api from '../lib/api'
import './Proyectos.css'

interface UsuarioAsignable {
  id: string
  nombre: string
  apellidos: string
  email: string
}

export default function NuevoProyecto() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { success, error: showError, warning } = useToastStore()
  const [estudiantes, setEstudiantes] = useState<UsuarioAsignable[]>([])
  const [tutores, setTutores] = useState<UsuarioAsignable[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estudiante_id: '',
    tutor_id: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.rol === 'administrador') {
      loadAssignableUsers()
    }
  }, [user?.rol])

  const loadAssignableUsers = async () => {
    setLoadingUsers(true)
    try {
      const [estudiantesRes, tutoresRes] = await Promise.all([
        api.get('/usuarios/estudiantes'),
        api.get('/usuarios/tutores'),
      ])
      setEstudiantes(estudiantesRes.data.estudiantes || [])
      setTutores(tutoresRes.data.tutores || [])
    } catch (err) {
      console.error('Error loading assignable users:', err)
      showError('No se pudieron cargar estudiantes y tutores')
    } finally {
      setLoadingUsers(false)
    }
  }

  if (user?.rol !== 'administrador') {
    return (
      <div className="error">
        No tienes permisos para crear proyectos
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.titulo.length < 5) {
      const errorMsg = 'El título debe tener al menos 5 caracteres'
      setError(errorMsg)
      warning(errorMsg)
      return
    }

    if (formData.titulo.length > 500) {
      const errorMsg = 'El título no puede exceder 500 caracteres'
      setError(errorMsg)
      warning(errorMsg)
      return
    }

    if (!formData.estudiante_id) {
      const errorMsg = 'Debes seleccionar un estudiante'
      setError(errorMsg)
      warning(errorMsg)
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/proyectos', {
        titulo: formData.titulo,
        descripcion: formData.descripcion || undefined,
        estudiante_id: formData.estudiante_id,
        tutor_id: formData.tutor_id || undefined,
      })

      success('¡Proyecto creado exitosamente!')
      // Redirigir al proyecto recién creado
      navigate(`/proyectos/${response.data.proyecto.id}`)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al crear el proyecto'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="proyectos-page">
      <div className="page-header">
        <h1>Nuevo Proyecto</h1>
        <Link to="/proyectos" className="btn btn-secondary">
          Cancelar
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

        {loadingUsers ? (
          <div className="loading">Cargando estudiantes y tutores...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">
                Estudiante asignado <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                className="input"
                value={formData.estudiante_id}
                onChange={(e) => setFormData({ ...formData, estudiante_id: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Selecciona un estudiante</option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre} {estudiante.apellidos} ({estudiante.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Tutor asignado (opcional)</label>
              <select
                className="input"
                value={formData.tutor_id}
                onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
                disabled={loading}
              >
                <option value="">Sin tutor asignado</option>
                {tutores.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.nombre} {tutor.apellidos} ({tutor.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">
                Título del Proyecto <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Sistema de Gestión de Proyectos de Grado"
                required
                disabled={loading}
                minLength={5}
                maxLength={500}
              />
              <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                Mínimo 5 caracteres, máximo 500 caracteres
              </small>
            </div>

            <div className="form-group">
              <label className="label">Descripción</label>
              <textarea
                className="input"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe brevemente el proyecto de grado..."
                rows={6}
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Proyecto'}
              </button>
              <Link to="/proyectos" className="btn btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

