import { useState, useEffect } from 'react'
import api from '../lib/api'
import './ProyectoTareas.css'

interface Tarea {
  id: string
  nombre: string
  descripcion?: string
  es_entregable: boolean
  numero_orden: number
  estado: string
  completada: boolean
}

interface Etapa {
  id: string
  nombre: string
  descripcion?: string
  numero_orden: number
  permitir_entregas_fuera_tiempo: boolean
  tareas: Tarea[]
}

interface Props {
  proyectoId: string
}

export default function ProyectoTareas({ proyectoId }: Props) {
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedEtapa, setExpandedEtapa] = useState<string | null>(null)
  const [entregaForm, setEntregaForm] = useState<{ [key: string]: { archivo: string; observaciones: string } }>({})

  useEffect(() => {
    loadTareas()
  }, [proyectoId])

  const loadTareas = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/proyectos/${proyectoId}/mis-tareas`)
      setEtapas(res.data.etapas || [])
      setError(null)
    } catch (err: any) {
      console.error('Error loading tareas:', err)
      setError('No hay tareas activas en este proyecto')
      setEtapas([])
    } finally {
      setLoading(false)
    }
  }

  const handleCompletarTarea = async (tareaId: string) => {
    try {
      await api.post(`/proyectos/${proyectoId}/tareas/${tareaId}/completar`)
      loadTareas()
    } catch (err) {
      console.error('Error completando tarea:', err)
    }
  }

  const handleDescompletarTarea = async (tareaId: string) => {
    try {
      await api.post(`/proyectos/${proyectoId}/tareas/${tareaId}/descompletar`)
      loadTareas()
    } catch (err) {
      console.error('Error descompletando tarea:', err)
    }
  }

  const handleEntregarTarea = async (tareaId: string) => {
    try {
      const form = entregaForm[tareaId]
      if (!form || !form.archivo) {
        alert('Debes adjuntar un archivo')
        return
      }

      await api.post(`/proyectos/${proyectoId}/tareas/${tareaId}/entregar`, {
        archivo_url: form.archivo,
        observaciones: form.observaciones
      })

      setEntregaForm((prev) => {
        const updated = { ...prev }
        delete updated[tareaId]
        return updated
      })

      loadTareas()
      alert('Entrega registrada correctamente')
    } catch (err: any) {
      console.error('Error entregando tarea:', err)
      alert('Error al registrar la entrega')
    }
  }

  if (loading) {
    return <div className="tareas-loading">Cargando tareas...</div>
  }

  if (error && etapas.length === 0) {
    return <div className="tareas-empty">{error}</div>
  }

  return (
    <div className="proyecto-tareas">
      <h2>📋 Mis Tareas Activas</h2>

      {etapas.length === 0 ? (
        <p className="tareas-empty">No hay tareas publicadas aún</p>
      ) : (
        <div className="etapas-list">
          {etapas.map((etapa) => (
            <div key={etapa.id} className="etapa-card">
              <div
                className="etapa-header"
                onClick={() => setExpandedEtapa(expandedEtapa === etapa.id ? null : etapa.id)}
              >
                <div className="etapa-title">
                  <h3>
                    <span className="etapa-numero">{etapa.numero_orden}</span>
                    {etapa.nombre}
                  </h3>
                  {etapa.descripcion && (
                    <p className="etapa-desc">{etapa.descripcion}</p>
                  )}
                </div>
                <div className="etapa-info">
                  <span className="tareas-count">
                    {etapa.tareas.filter((t) => t.completada).length}/{etapa.tareas.length}
                  </span>
                  <span className={`expand-icon ${expandedEtapa === etapa.id ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {expandedEtapa === etapa.id && (
                <div className="etapa-content">
                  {etapa.tareas.length === 0 ? (
                    <p className="tareas-empty">Sin tareas en esta etapa</p>
                  ) : (
                    <div className="tareas-grid">
                      {etapa.tareas.map((tarea) => (
                        <div key={tarea.id} className="tarea-card">
                          <div className="tarea-header">
                            <h4>{tarea.nombre}</h4>
                            {tarea.descripcion && (
                              <p className="tarea-desc">{tarea.descripcion}</p>
                            )}
                          </div>

                          {tarea.es_entregable ? (
                            // TAREA ENTREGABLE
                            <div className="tarea-entregable">
                              <div className="tarea-badge">📄 Entregable</div>

                              {entregaForm[tarea.id] ? (
                                <div className="entrega-form">
                                  <input
                                    type="text"
                                    placeholder="URL del archivo o nombre"
                                    value={entregaForm[tarea.id].archivo}
                                    onChange={(e) =>
                                      setEntregaForm((prev) => ({
                                        ...prev,
                                        [tarea.id]: { ...prev[tarea.id], archivo: e.target.value }
                                      }))
                                    }
                                    className="form-input"
                                  />
                                  <textarea
                                    placeholder="Observaciones (opcional)"
                                    value={entregaForm[tarea.id].observaciones}
                                    onChange={(e) =>
                                      setEntregaForm((prev) => ({
                                        ...prev,
                                        [tarea.id]: { ...prev[tarea.id], observaciones: e.target.value }
                                      }))
                                    }
                                    className="form-textarea"
                                  />
                                  <div className="form-buttons">
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => handleEntregarTarea(tarea.id)}
                                    >
                                      ✓ Entregar
                                    </button>
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() => {
                                        setEntregaForm((prev) => {
                                          const updated = { ...prev }
                                          delete updated[tarea.id]
                                          return updated
                                        })
                                      }}
                                    >
                                      ✕ Cancelar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    setEntregaForm((prev) => ({
                                      ...prev,
                                      [tarea.id]: { archivo: '', observaciones: '' }
                                    }))
                                  }
                                >
                                  + Entregar Archivo
                                </button>
                              )}
                            </div>
                          ) : (
                            // TAREA NO ENTREGABLE (CHECKBOX)
                            <div className="tarea-no-entregable">
                              <div className="tarea-badge">✓ Completable</div>
                              <div className="checkbox-container">
                                <input
                                  type="checkbox"
                                  id={`tarea-${tarea.id}`}
                                  checked={tarea.completada}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleCompletarTarea(tarea.id)
                                    } else {
                                      handleDescompletarTarea(tarea.id)
                                    }
                                  }}
                                  className="tarea-checkbox"
                                />
                                <label htmlFor={`tarea-${tarea.id}`} className="checkbox-label">
                                  {tarea.completada ? '✓ Completada' : 'Marcar como completada'}
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
