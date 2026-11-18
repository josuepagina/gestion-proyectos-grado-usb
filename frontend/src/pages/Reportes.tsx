import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import './Reportes.css'

interface Tarea {
  tipo_tarea: string
  tarea_id: string
  descripcion: string
  proyecto_titulo: string
  etapa?: string
  estado?: string
  fecha_creacion: string
  fecha_completada?: string
  completada: boolean
}

interface Estadisticas {
  proyectos: {
    total: number
    por_estado: Array<{ estado: string; cantidad: number }>
    sin_tutor: number
    en_revision: number
  }
  entregas: {
    total: number
    por_estado: Array<{ estado_revision: string; cantidad: number }>
    por_etapa: Array<{ etapa: string; cantidad: number }>
  }
  observaciones: {
    total: number
    pendientes: number
  }
  usuarios: {
    por_rol: Array<{ rol: string; cantidad: number }>
  }
}

export default function Reportes() {
  const { user } = useAuthStore()
  const [tareasPendientes, setTareasPendientes] = useState<Tarea[]>([])
  const [tareasCumplidas, setTareasCumplidas] = useState<Tarea[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pendientes' | 'cumplidas' | 'estadisticas'>('pendientes')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [pendientesRes, cumplidasRes] = await Promise.all([
        api.get('/reportes/tareas-pendientes'),
        api.get('/reportes/tareas-cumplidas'),
      ])

      setTareasPendientes(pendientesRes.data.tareas)
      setTareasCumplidas(cumplidasRes.data.tareas)

      // Load statistics if admin
      if (user?.rol === 'administrador') {
        try {
          const statsRes = await api.get('/reportes/estadisticas')
          setEstadisticas(statsRes.data.estadisticas)
        } catch (err) {
          console.error('Error loading statistics:', err)
        }
      }
    } catch (error) {
      console.error('Error loading reportes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTipoTareaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      observacion: 'Observación',
      entrega_revision: 'Entrega en Revisión',
      revisar_entrega: 'Revisar Entrega',
      observaciones_pendientes: 'Observaciones Pendientes',
      revisar_proyecto: 'Revisar Proyecto',
      asignar_tutor: 'Asignar Tutor',
      proyecto_revision: 'Proyecto en Revisión',
      entrega_aprobada: 'Entrega Aprobada',
      entrega_revisada: 'Entrega Revisada',
      observacion_resuelta: 'Observación Resuelta',
      proyecto_revisado: 'Proyecto Revisado',
      proyecto_completado: 'Proyecto Completado',
    }
    return labels[tipo] || tipo
  }

  if (loading) {
    return <div className="loading">Cargando reportes...</div>
  }

  return (
    <div className="reportes">
      <div className="reportes-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Reportes y Tareas</h1>
            <p>Gestión de tareas pendientes y cumplidas</p>
          </div>
          {user?.rol === 'administrador' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    const res = await api.get('/reportes/export/lista-docentes/pdf', { responseType: 'blob' })
                    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'lista_docentes.pdf'
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    window.URL.revokeObjectURL(url)
                  } catch (err) {
                    console.error('Error descargando reporte:', err)
                    alert('Error al descargar el reporte')
                  }
                }}
                style={{ marginTop: '0' }}
              >
                Descargar lista (PDF)
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    const res = await api.get('/reportes/export/lista-docentes/xlsx', { responseType: 'blob' })
                    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'lista_docentes.xlsx'
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    window.URL.revokeObjectURL(url)
                  } catch (err) {
                    console.error('Error descargando XLSX:', err)
                    alert('Error al descargar el archivo XLSX')
                  }
                }}
                style={{ marginTop: '0' }}
              >
                Descargar lista (XLSX)
              </button>

              <button
                className="btn btn-secondary"
                onClick={async () => {
                  try {
                    const res = await api.get('/reportes/export/lista-docentes/preview')
                    const preview = res.data.data || []
                    // show simple preview in a new window as a table
                    const w = window.open('', '_blank')
                    if (!w) return
                    let html = '<html><head><meta charset="utf-8"><title>Preview</title></head><body>'
                    html += '<h2>Vista previa - Lista Docentes</h2>'
                    html += '<table border="1" style="border-collapse:collapse">'
                    html += '<tr>' + Object.keys(preview[0] || {}).map(k => `<th>${k}</th>`).join('') + '</tr>'
                    preview.forEach((row: any) => {
                      html += '<tr>' + Object.values(row).map((v: any) => `<td>${String(v || '')}</td>`).join('') + '</tr>'
                    })
                    html += '</table></body></html>'
                    w.document.write(html)
                    w.document.close()
                  } catch (err) {
                    console.error('Error cargando preview:', err)
                    alert('Error al cargar la vista previa')
                  }
                }}
                style={{ marginTop: '0' }}
              >
                Vista previa
              </button>
            </div>
          )}
          <button
            className="btn btn-secondary"
            onClick={loadData}
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Cargando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pendientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('pendientes')}
        >
          Tareas Pendientes ({tareasPendientes.length})
        </button>
        <button
          className={`tab ${activeTab === 'cumplidas' ? 'active' : ''}`}
          onClick={() => setActiveTab('cumplidas')}
        >
          Tareas Cumplidas ({tareasCumplidas.length})
        </button>
        {user?.rol === 'administrador' && (
          <button
            className={`tab ${activeTab === 'estadisticas' ? 'active' : ''}`}
            onClick={() => setActiveTab('estadisticas')}
          >
            Estadísticas
          </button>
        )}
      </div>

      {activeTab === 'pendientes' && (
        <div className="tareas-section">
          <h2>Tareas Pendientes</h2>
          {tareasPendientes.length === 0 ? (
            <p className="empty-state">No hay tareas pendientes</p>
          ) : (
            <div className="tareas-list">
              {tareasPendientes.map((tarea) => (
                <div key={tarea.tarea_id} className="tarea-card">
                  <div className="tarea-header">
                    <span className="tarea-tipo">{getTipoTareaLabel(tarea.tipo_tarea)}</span>
                    <span className="badge badge-warning">Pendiente</span>
                  </div>
                  <h3>{tarea.descripcion}</h3>
                  <p className="tarea-proyecto">Proyecto: {tarea.proyecto_titulo}</p>
                  {tarea.etapa && <p className="tarea-etapa">Etapa: {tarea.etapa}</p>}
                  <p className="tarea-fecha">
                    Creada: {new Date(tarea.fecha_creacion).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'cumplidas' && (
        <div className="tareas-section">
          <h2>Tareas Cumplidas</h2>
          {tareasCumplidas.length === 0 ? (
            <p className="empty-state">No hay tareas cumplidas</p>
          ) : (
            <div className="tareas-list">
              {tareasCumplidas.map((tarea) => (
                <div key={tarea.tarea_id} className="tarea-card completed">
                  <div className="tarea-header">
                    <span className="tarea-tipo">{getTipoTareaLabel(tarea.tipo_tarea)}</span>
                    <span className="badge badge-success">Completada</span>
                  </div>
                  <h3>{tarea.descripcion}</h3>
                  <p className="tarea-proyecto">Proyecto: {tarea.proyecto_titulo}</p>
                  {tarea.etapa && <p className="tarea-etapa">Etapa: {tarea.etapa}</p>}
                  <p className="tarea-fecha">
                    Completada: {tarea.fecha_completada 
                      ? new Date(tarea.fecha_completada).toLocaleString()
                      : new Date(tarea.fecha_creacion).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'estadisticas' && estadisticas && (
        <div className="estadisticas-section">
          <h2>Estadísticas del Sistema</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Proyectos</h3>
              <p className="stat-value">{estadisticas.proyectos.total}</p>
              <div className="stat-details">
                <p>Sin tutor: {estadisticas.proyectos.sin_tutor}</p>
                <p>En revisión: {estadisticas.proyectos.en_revision}</p>
              </div>
            </div>
            <div className="stat-card">
              <h3>Entregas</h3>
              <p className="stat-value">{estadisticas.entregas.total}</p>
            </div>
            <div className="stat-card">
              <h3>Observaciones</h3>
              <p className="stat-value">{estadisticas.observaciones.total}</p>
              <div className="stat-details">
                <p>Pendientes: {estadisticas.observaciones.pendientes}</p>
              </div>
            </div>
            <div className="stat-card">
              <h3>Usuarios</h3>
              <div className="stat-details">
                {estadisticas.usuarios.por_rol.map((rol) => (
                  <p key={rol.rol}>
                    {rol.rol}: {rol.cantidad}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

