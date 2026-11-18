import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import api from '../lib/api'
import './Proyectos.css'

interface Project {
  id: string
  titulo: string
  descripcion: string
  estado: string
  estudiante_nombre: string
  tutor_nombre: string
  fecha_entrega: string
  created_at: string
}

export default function Proyectos() {
  const { user } = useAuthStore()
  const { success, error: showError, warning } = useToastStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingTitulo, setEditingTitulo] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await api.get('/proyectos')
      setProjects(response.data.proyectos)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      registrado: 'badge-info',
      en_desarrollo: 'badge-info',
      en_revision: 'badge-warning',
      correcciones: 'badge-warning',
      aprobado: 'badge-success',
      sustentado: 'badge-success',
      rechazado: 'badge-danger',
    }
    return badges[estado] || 'badge-info'
  }

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      registrado: 'Registrado',
      en_desarrollo: 'En Desarrollo',
      en_revision: 'En Revisión',
      correcciones: 'Correcciones',
      aprobado: 'Aprobado',
      sustentado: 'Sustentado',
      rechazado: 'Rechazado',
    }
    return labels[estado] || estado
  }

  const filteredProjects = projects.filter((p) => {
    const term = filter.toLowerCase()
    return (
      p.titulo.toLowerCase().includes(term) ||
      (p.estudiante_nombre || '').toLowerCase().includes(term)
    )
  })

  const startEdit = (project: Project) => {
    setEditingProjectId(project.id)
    setEditingTitulo(project.titulo)
  }

  const cancelEdit = () => {
    setEditingProjectId(null)
    setEditingTitulo('')
  }

  const handleSaveTitle = async (projectId: string) => {
    const titulo = editingTitulo.trim()
    if (titulo.length < 5) {
      warning('El título debe tener al menos 5 caracteres')
      return
    }

    try {
      setActionLoadingId(projectId)
      await api.put(`/proyectos/${projectId}`, { titulo })
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, titulo } : p)))
      setEditingProjectId(null)
      setEditingTitulo('')
      success('Nombre del proyecto actualizado')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'No se pudo actualizar el proyecto'
      showError(errorMsg)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteProject = async (projectId: string, titulo: string) => {
    const confirmed = window.confirm(`¿Deseas eliminar el proyecto "${titulo}"? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    try {
      setActionLoadingId(projectId)
      await api.delete(`/proyectos/${projectId}`)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      success('Proyecto eliminado correctamente')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'No se pudo eliminar el proyecto'
      showError(errorMsg)
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return <div className="loading">Cargando proyectos...</div>
  }

  return (
    <div className="proyectos-page">
      <div className="page-header">
        <h1>Proyectos de Grado</h1>
        {user?.rol === 'administrador' && (
          <Link to="/proyectos/nuevo" className="btn btn-primary">
            Nuevo Proyecto
          </Link>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          className="input"
          placeholder="Buscar proyectos..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          {filter ? 'No se encontraron proyectos' : 'No hay proyectos disponibles'}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
            >
              <div className="project-header">
                {editingProjectId === project.id ? (
                  <input
                    type="text"
                    className="input"
                    value={editingTitulo}
                    onChange={(e) => setEditingTitulo(e.target.value)}
                    minLength={5}
                    maxLength={500}
                    disabled={actionLoadingId === project.id}
                  />
                ) : (
                  <h2>{project.titulo}</h2>
                )}
                <span className={`badge ${getEstadoBadge(project.estado)}`}>
                  {getEstadoLabel(project.estado)}
                </span>
              </div>
              {project.descripcion && (
                <p className="project-description">{project.descripcion}</p>
              )}
              <div className="project-footer">
                <div className="project-meta">
                  <span>
                    {user?.rol === 'estudiante'
                      ? `Tutor: ${project.tutor_nombre || 'Sin asignar'}`
                      : `Estudiante: ${project.estudiante_nombre}`}
                  </span>
                  <span>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="project-actions" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/proyectos/${project.id}`} className="btn btn-secondary">
                    Ver detalle
                  </Link>

                  {user?.rol === 'administrador' && editingProjectId !== project.id && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => startEdit(project)}
                      disabled={actionLoadingId === project.id}
                    >
                      Editar nombre
                    </button>
                  )}

                  {user?.rol === 'administrador' && editingProjectId === project.id && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleSaveTitle(project.id)}
                        disabled={actionLoadingId === project.id}
                      >
                        {actionLoadingId === project.id ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                        disabled={actionLoadingId === project.id}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {user?.rol === 'administrador' && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteProject(project.id, project.titulo)}
                      disabled={actionLoadingId === project.id}
                    >
                      {actionLoadingId === project.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

