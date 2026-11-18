import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { hasRole } from '../lib/roles'
import './Dashboard.css'

interface Project {
  id: string
  titulo: string
  estado: string
  estudiante_nombre: string
  tutor_nombre: string
  created_at: string
}

interface Notification {
  id: string
  tipo: string
  mensaje: string
  leida: boolean
  fecha_creacion: string
}

interface Materia {
  id: string
  semestre: number
  nombre: string
  codigo_materia: string | null
  etapas: Array<{
    id: string
    nombre: string
    tipo: string
    estado: string
    fecha_apertura?: string
    fecha_cierre?: string
    fecha_limite_entrega?: string
    tareas?: Array<{
      id: string
      nombre: string
      estado: string
      prioridad?: string | null
      fecha_limite?: string | null
    }>
  }>
}

interface Gestion {
  id: string
  nombre: string
  estado: string
  descripcion?: string
  materias: Array<any>
}

interface Etapa {
  id: string
  nombre: string
  estado: string
  tipo: string
  fecha_apertura?: string
  fecha_cierre?: string
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const isAdmin = hasRole(user, 'administrador')
  const isStudent = hasRole(user, 'estudiante')
  const isTutor = hasRole(user, 'tutor')
  const [projects, setProjects] = useState<Project[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [openEtapas, setOpenEtapas] = useState<Array<{ proyecto_id: string; titulo: string; etapas: Array<any> }>>([])
  const [openProyectoEtapas, setOpenProyectoEtapas] = useState<Array<{ proyecto_id: string; titulo: string; etapas: Array<any> }>>([])
  const [activeGestiones, setActiveGestiones] = useState<Gestion[]>([])
  const [activeEtapas, setActiveEtapas] = useState<Etapa[]>([])
  const [gestionesConEtapasAbiertas, setGestionesConEtapasAbiertas] = useState<Array<{ id: string; nombre: string; materias: Materia[] }>>([])
  const [gestionesPorProyecto, setGestionesPorProyecto] = useState<
    Array<{ proyecto_id: string; titulo: string; gestiones: Array<{ id: string; nombre: string; materias: Materia[] }> }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!isStudent) return
    const intervalId = window.setInterval(() => {
      refreshEtapasProyecto()
    }, 30000)
    return () => window.clearInterval(intervalId)
  }, [isStudent])

  const refreshEtapasProyecto = async () => {
    try {
      const etapasProyectoRes = await api.get('/proyectos/mis-etapas-abiertas')
      setOpenProyectoEtapas(etapasProyectoRes.data.proyectos || [])
    } catch (err) {
      console.error('Error loading etapas abiertas por proyecto:', err)
    }
  }

  const loadData = async () => {
    try {
      const [projectsRes, notificationsRes, unreadRes, gestionsRes, etapasRes] = await Promise.all([
        api.get('/proyectos'),
        api.get('/notificaciones'),
        api.get('/notificaciones/unread'),
        api.get('/gestiones').catch(() => ({ data: { gestiones: [] } })),
        api.get('/etapas').catch(() => ({ data: { etapas: [] } })),
      ])

      setProjects(projectsRes.data.proyectos.slice(0, 5))
      setNotifications(notificationsRes.data.notificaciones.slice(0, 5))
      setUnreadCount(unreadRes.data.count)

      const gestiones = gestionsRes.data.gestiones || []
      const active = gestiones.filter((g: Gestion) => g.estado === 'activa')
      setActiveGestiones(active.slice(0, 3))

      const etapas = etapasRes.data.etapas || []
      const activeStages = etapas.filter((e: Etapa) => e.estado !== 'archivada' && e.estado !== 'planificada')
      setActiveEtapas(activeStages.slice(0, 5))

      if (isAdmin) {
        try {
          const etapasAbiertasRes = await api.get('/gestiones/admin/etapas-abiertas-por-materias')
          setGestionesConEtapasAbiertas(etapasAbiertasRes.data.gestiones || [])
        } catch (err) {
          console.error('Error loading etapas abiertas por materias:', err)
          setGestionesConEtapasAbiertas([])
        }
      }

      if (isStudent || isTutor) {
        try {
          const gestionesUserRes = await api.get('/gestiones/usuario/activas-por-proyectos')
          setGestionesPorProyecto(gestionesUserRes.data.proyectos || [])
        } catch (err) {
          console.error('Error loading gestiones activas por proyectos:', err)
          setGestionesPorProyecto([])
        }

        await refreshEtapasProyecto()
      }

      if (isStudent) {
        try {
          const openRes = await api.get('/entregas/mis-proyectos/etapas-abiertas')
          setOpenEtapas(openRes.data.proyectos || [])
        } catch (err) {
          console.error('Error loading open stages for projects:', err)
          setOpenEtapas([])
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
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
      activa: 'Activa',
      inactiva: 'Inactiva',
      archivada: 'Archivada',
      planificada: 'Planificada',
    }
    return labels[estado] || estado
  }

  const getRoleTitle = () => {
    const titles: Record<string, string> = {
      estudiante: 'Mis Proyectos',
      tutor: 'Proyectos Asignados',
      revisor: 'Proyectos para Revisar',
      administrador: 'Todos los Proyectos',
    }
    return titles[user?.rol || ''] || 'Proyectos'
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Panel de control - {user?.rol}</p>
      </div>

      <div className="dashboard-grid">
        {isAdmin && (
          <>
            <div className="dashboard-card" style={{ gridColumn: '1', order: 1 }}>
              <h2>Gestiones Activas</h2>
              {activeGestiones.length === 0 ? (
                <p className="empty-state">No hay gestiones activas</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeGestiones.map((gestion) => (
                    <div
                      key={gestion.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        borderLeft: '3px solid var(--color-success)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{gestion.nombre}</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                            {gestion.materias.length} materia{gestion.materias.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="badge badge-success">{getEstadoLabel(gestion.estado)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/gestion-gestiones" className="btn btn-secondary" style={{ marginTop: '0.75rem', width: '100%' }}>
                Ver todas las gestiones
              </Link>
            </div>

            <div className="dashboard-card" style={{ gridColumn: '2', order: 2 }}>
              <h2>Etapas Activas</h2>
              {activeEtapas.length === 0 ? (
                <p className="empty-state">No hay etapas activas</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeEtapas.map((etapa) => (
                    <div
                      key={etapa.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        borderLeft: '3px solid var(--color-info)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{etapa.nombre}</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                            Tipo: {etapa.tipo}
                          </p>
                        </div>
                        <span className="badge badge-info">{getEstadoLabel(etapa.estado)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/gestion-etapas" className="btn btn-secondary" style={{ marginTop: '0.75rem', width: '100%' }}>
                Ver todas las etapas
              </Link>
            </div>

            <div className="dashboard-card" style={{ gridColumn: '1 / -1', order: 3 }}>
              <h2>📚 Etapas Abiertas por Materia</h2>
              {gestionesConEtapasAbiertas.length === 0 ? (
                <p className="empty-state">No hay etapas abiertas en las gestiones activas</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {gestionesConEtapasAbiertas.map((gestion) => (
                    <div key={gestion.id} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--color-success)' }}>
                        🎯 {gestion.nombre}
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {gestion.materias.map((materia) => (
                          <div
                            key={materia.id}
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              padding: '1rem',
                              overflow: 'hidden',
                            }}
                          >
                            <div style={{ marginBottom: '0.75rem' }}>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                                {materia.nombre}
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                Semestre {materia.semestre}
                                {materia.codigo_materia && ` • ${materia.codigo_materia}`}
                              </p>
                            </div>

                            {materia.etapas.length === 0 ? (
                              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                Sin etapas abiertas
                              </p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                                {materia.etapas.map((etapa) => (
                                  <div
                                    key={etapa.id}
                                    style={{
                                      padding: '0.65rem',
                                      backgroundColor: 'var(--bg-primary)',
                                      borderLeft: '3px solid var(--color-warning)',
                                      borderRadius: '3px',
                                      fontSize: '0.85rem',
                                    }}
                                  >
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                      {etapa.nombre}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                      Tipo: <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{etapa.tipo}</span>
                                    </div>
                                    {etapa.fecha_cierre && (
                                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                                        Cierra: <span style={{ fontWeight: '500' }}>
                                          {new Date(etapa.fecha_cierre).toLocaleDateString('es-ES')}
                                        </span>
                                      </div>
                                    )}
                                    <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', padding: '0.25rem 0.5rem', borderRadius: '3px', fontWeight: '500' }}>
                                      {getEstadoLabel(etapa.estado)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/gestion-gestiones" className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>
                Gestionar Gestiones
              </Link>
            </div>
          </>
        )}

        {(isStudent || isTutor) && (
          <div className="dashboard-card" style={{ order: isTutor ? (gestionesPorProyecto.length > 0 ? 2 : 1) : 1 }}>
            <h2>Etapas del Proyecto</h2>
            {openProyectoEtapas.length === 0 ? (
              <p className="empty-state">No hay etapas en tus proyectos</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {openProyectoEtapas.map((p) => (
                  <div key={p.proyecto_id} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: 'var(--color-info)' }}>
                      📌 {p.titulo}
                    </h4>
                    {p.etapas.length === 0 ? (
                      <p className="empty-state">Sin etapas registradas</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {p.etapas.map((e: any) => (
                          <div
                            key={e.id}
                            style={{
                              padding: '0.75rem',
                              backgroundColor: 'var(--bg-secondary)',
                              borderRadius: '4px',
                              borderLeft: '3px solid var(--color-warning)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{e.nombre}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                  {e.fecha_inicio && `Inicio: ${new Date(e.fecha_inicio).toLocaleDateString('es-ES')}`}
                                  {e.fecha_cierre && ` • Cierre: ${new Date(e.fecha_cierre).toLocaleDateString('es-ES')}`}
                                </p>
                              </div>
                              <span className="badge badge-success">{e.estado}</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                              {(() => {
                                const total = typeof e.tareas_abiertas === 'number'
                                  ? e.tareas_abiertas
                                  : Array.isArray(e.tareas)
                                    ? e.tareas.length
                                    : 0
                                return total === 0
                                  ? 'No hay tareas en esta etapa.'
                                  : `${total} tarea${total !== 1 ? 's' : ''} abierta${total !== 1 ? 's' : ''}`
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link to="/proyectos" className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>Ver Proyectos</Link>
          </div>
        )}

        {isStudent && openEtapas.length > 0 && (
          <div className="dashboard-card" style={{ order: openProyectoEtapas.length > 0 ? 2 : 1 }}>
            <h2>Etapas Abiertas (Entregas)</h2>
            <p className="small">Tienes etapas abiertas donde puedes subir entregas:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {openEtapas.map((p) => (
                <Link key={p.proyecto_id} to={`/proyectos/${p.proyecto_id}`} className="project-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <strong>{p.titulo}</strong>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        {p.etapas.map((e: any) => e.nombre).join(', ')}
                      </div>
                    </div>
                    <span className="badge badge-success">{p.etapas.length} abierta{p.etapas.length > 1 ? 's' : ''}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/proyectos" className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>Ver Proyectos</Link>
          </div>
        )}

        <div className="dashboard-card" style={{ order: isAdmin ? 4 : (isTutor ? (gestionesPorProyecto.length > 0 ? 3 : openProyectoEtapas.length > 0 ? 2 : 1) : (openProyectoEtapas.length > 0 ? 2 : 1)) }}>
          <h2>{getRoleTitle()}</h2>
          {projects.length === 0 ? (
            <p className="empty-state">No hay proyectos disponibles</p>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/proyectos/${project.id}`}
                  className="project-item"
                >
                  <div className="project-info">
                    <h3>{project.titulo}</h3>
                    <p className="project-meta">
                      {isStudent
                        ? `Tutor: ${project.tutor_nombre || 'Sin asignar'}`
                        : `Estudiante: ${project.estudiante_nombre}`}
                    </p>
                  </div>
                  <span className={`badge ${getEstadoBadge(project.estado)}`}>
                    {getEstadoLabel(project.estado)}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/proyectos" className="btn btn-primary">
            Ver todos los proyectos
          </Link>
        </div>

        <div className="dashboard-card" style={{ order: isAdmin ? 5 : (isTutor ? (gestionesPorProyecto.length > 0 ? 4 : openProyectoEtapas.length > 0 ? 3 : 2) : (openProyectoEtapas.length > 0 ? 3 : 2)) }}>
          <div className="card-header">
            <h2>Notificaciones</h2>
            {unreadCount > 0 && (
              <span className="badge badge-danger">{unreadCount} nuevas</span>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="empty-state">No hay notificaciones</p>
          ) : (
            <div className="notification-list">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.leida ? '' : 'unread'}`}
                >
                  <p>{notif.mensaje}</p>
                  <span className="notification-time">
                    {new Date(notif.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
