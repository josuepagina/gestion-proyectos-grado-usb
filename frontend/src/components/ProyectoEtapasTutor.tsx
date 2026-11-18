import { useEffect, useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import './ProyectoEtapasTutor.css'

interface Tarea {
  id: string
  nombre: string
  descripcion?: string
  es_entregable: boolean
  numero_orden: number
  estado: string
  fecha_limite?: string | null
}

interface Etapa {
  id: string
  nombre: string
  descripcion?: string
  numero_orden: number
  estado: string
  fecha_publicacion?: string
  fecha_inicio?: string
  fecha_cierre?: string
  permitir_entregas_fuera_tiempo?: boolean
  total_tareas: number
  tareas?: Tarea[]
  loadingTareas?: boolean
}

interface Props {
  proyectoId: string
}

export default function ProyectoEtapasTutor({ proyectoId }: Props) {
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [editEtapaId, setEditEtapaId] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [estadoEdit, setEstadoEdit] = useState<Record<string, string>>({})
  const [estadoLoading, setEstadoLoading] = useState<Record<string, boolean>>({})
  const [estadoError, setEstadoError] = useState<Record<string, string>>({})
  const [editForm, setEditForm] = useState({
    nombre: '',
    descripcion: '',
    permitir_entregas_fuera_tiempo: false,
    fecha_inicio: '',
    fecha_cierre: ''
  })
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    permitir_entregas_fuera_tiempo: false,
    fecha_inicio: '',
    fecha_cierre: ''
  })

  useEffect(() => {
    loadEtapas()
  }, [proyectoId])

  const loadEtapas = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/proyectos/${proyectoId}/etapas`)
      const etapasApi = res.data.etapas || []
      setEtapas(etapasApi)
      setEstadoEdit((prev) => {
        const next = { ...prev }
        etapasApi.forEach((e: Etapa) => {
          next[e.id] = next[e.id] || e.estado
        })
        return next
      })
    } catch (err: any) {
      console.error('Error cargando etapas:', err)
      setError('No se pudieron cargar las etapas del proyecto')
    } finally {
      setLoading(false)
    }
  }

  const formatDateForInput = (value?: string | null) => {
    if (!value) return ''
    const d = new Date(value)
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
    return iso.slice(0, 16)
  }

  const startEditEtapa = (etapa: Etapa) => {
    setEditEtapaId(etapa.id)
    setEditError('')
    setEditForm({
      nombre: etapa.nombre,
      descripcion: etapa.descripcion || '',
      permitir_entregas_fuera_tiempo: etapa.permitir_entregas_fuera_tiempo || false,
      fecha_inicio: formatDateForInput(etapa.fecha_inicio),
      fecha_cierre: formatDateForInput(etapa.fecha_cierre)
    })
    setExpanded(etapa.id)
  }

  const cancelEditEtapa = () => {
    setEditEtapaId(null)
    setEditError('')
    setEditLoading(false)
  }

  const saveEditEtapa = async (e: FormEvent) => {
    e.preventDefault()
    if (!editEtapaId) return
    if (!editForm.nombre.trim()) {
      setEditError('El nombre es requerido')
      return
    }
    setEditLoading(true)
    setEditError('')
    try {
      await api.put(`/proyectos/${proyectoId}/etapas/${editEtapaId}`, {
        nombre: editForm.nombre.trim(),
        descripcion: editForm.descripcion.trim() || null,
        permitir_entregas_fuera_tiempo: editForm.permitir_entregas_fuera_tiempo,
        fecha_inicio: editForm.fecha_inicio ? new Date(editForm.fecha_inicio).toISOString() : null,
        fecha_cierre: editForm.fecha_cierre ? new Date(editForm.fecha_cierre).toISOString() : null
      })
      setEditEtapaId(null)
      await loadEtapas()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo actualizar la etapa'
      setEditError(msg)
    } finally {
      setEditLoading(false)
    }
  }

  const updateEstado = async (etapaId: string) => {
    const nuevoEstado = estadoEdit[etapaId]
    if (!nuevoEstado) return
    const etapaActual = etapas.find((e) => e.id === etapaId)
    if (!etapaActual || etapaActual.estado === nuevoEstado) return
    setEstadoLoading((prev) => ({ ...prev, [etapaId]: true }))
    setEstadoError((prev) => ({ ...prev, [etapaId]: '' }))
    try {
      await api.patch(`/proyectos/${proyectoId}/etapas/${etapaId}/estado`, {
        estado: nuevoEstado
      })
      await loadEtapas()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo actualizar el estado'
      setEstadoError((prev) => ({ ...prev, [etapaId]: msg }))
    } finally {
      setEstadoLoading((prev) => ({ ...prev, [etapaId]: false }))
    }
  }

  const getAllowedStates = (estado: string) => {
    const map: Record<string, string[]> = {
      borrador: ['borrador', 'publicada'],
      publicada: ['publicada', 'cerrada'],
      cerrada: ['cerrada']
    }
    return map[estado] || [estado]
  }

  const loadTareas = async (etapaId: string) => {
    setEtapas((prev) =>
      prev.map((e) => (e.id === etapaId ? { ...e, loadingTareas: true } : e))
    )
    try {
      const res = await api.get(`/proyectos/${proyectoId}/etapas/${etapaId}`)
      const etapa = res.data.etapa
      setEtapas((prev) =>
        prev.map((e) =>
          e.id === etapaId ? { ...e, tareas: etapa.tareas || [], loadingTareas: false } : e
        )
      )
    } catch (err: any) {
      console.error('Error cargando tareas:', err)
      setEtapas((prev) =>
        prev.map((e) => (e.id === etapaId ? { ...e, loadingTareas: false } : e))
      )
    }
  }

  const toggleEtapa = (etapaId: string, hasTareasLoaded: boolean) => {
    setExpanded((prev) => (prev === etapaId ? null : etapaId))
    if (!hasTareasLoaded) {
      loadTareas(etapaId)
    }
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setCreateError('El nombre es requerido')
      return
    }

    setCreateLoading(true)
    setCreateError('')
    try {
      await api.post(`/proyectos/${proyectoId}/etapas`, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        permitir_entregas_fuera_tiempo: form.permitir_entregas_fuera_tiempo,
        fecha_inicio: form.fecha_inicio ? new Date(form.fecha_inicio).toISOString() : null,
        fecha_cierre: form.fecha_cierre ? new Date(form.fecha_cierre).toISOString() : null
      })
      setShowCreate(false)
      setForm({ nombre: '', descripcion: '', permitir_entregas_fuera_tiempo: false, fecha_inicio: '', fecha_cierre: '' })
      loadEtapas()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo crear la etapa'
      setCreateError(msg)
    } finally {
      setCreateLoading(false)
    }
  }

  if (loading) {
    return <div className="etapas-tutor-card">Cargando etapas...</div>
  }

  if (error) {
    return <div className="etapas-tutor-card error">{error}</div>
  }

  return (
    <div className="etapas-tutor-card">
      <div className="etapas-tutor-header">
        <h2>Etapas del Proyecto</h2>
        <div className="header-actions">
          <span className="badge badge-info">Tutor</span>
          <button className="btn btn-primary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancelar' : 'Nueva etapa'}
          </button>
        </div>
      </div>

      {showCreate && (
        <form className="create-form" onSubmit={handleCreate}>
          <div className="form-row">
            <label>Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Revisión de perfil"
              required
            />
          </div>
          <div className="form-row">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Detalle breve de la etapa"
              rows={2}
            />
          </div>
          <div className="form-row two-cols">
            <div className="col">
              <label>Fecha inicio</label>
              <input
                type="datetime-local"
                value={form.fecha_inicio}
                onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
              />
            </div>
            <div className="col">
              <label>Fecha fin</label>
              <input
                type="datetime-local"
                value={form.fecha_cierre}
                onChange={(e) => setForm({ ...form, fecha_cierre: e.target.value })}
              />
            </div>
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.permitir_entregas_fuera_tiempo}
              onChange={(e) =>
                setForm({ ...form, permitir_entregas_fuera_tiempo: e.target.checked })
              }
            />
            Permitir entregas fuera de tiempo
          </label>

          {createError && <div className="error-msg">{createError}</div>}

          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={createLoading}>
              {createLoading ? 'Creando...' : 'Crear etapa'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowCreate(false)
                setCreateError('')
                setForm({ nombre: '', descripcion: '', permitir_entregas_fuera_tiempo: false, fecha_inicio: '', fecha_cierre: '' })
              }}
              disabled={createLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {etapas.length === 0 ? (
        <p className="empty">Aún no hay etapas creadas para este proyecto.</p>
      ) : (
        <div className="etapas-list">
          {etapas.map((etapa) => {
            const isExpanded = expanded === etapa.id
            const tareasCargadas = Array.isArray(etapa.tareas)
            const allowedStates = getAllowedStates(etapa.estado)
            return (
              <div key={etapa.id} className="etapa-item">
                <div className="etapa-row" onClick={() => toggleEtapa(etapa.id, tareasCargadas)}>
                  <div className="etapa-main">
                    <div className="etapa-title">
                      <span className="orden">#{etapa.numero_orden}</span>
                      <div>
                        <div className="nombre">{etapa.nombre}</div>
                        {etapa.descripcion && <div className="descripcion">{etapa.descripcion}</div>}
                      </div>
                    </div>
                    <div className="meta">
                      <span className="pill">{etapa.total_tareas} tareas</span>
                      <span className="pill soft">Estado: {etapa.estado}</span>
                      {etapa.fecha_inicio && (
                        <span className="pill soft">Inicio: {new Date(etapa.fecha_inicio).toLocaleDateString()}</span>
                      )}
                      {etapa.fecha_cierre && (
                        <span className="pill soft">Cierre: {new Date(etapa.fecha_cierre).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <span className={`chevron ${isExpanded ? 'open' : ''}`}>▾</span>
                </div>

                {isExpanded && (
                  <div className="tareas-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                      <p className="muted" style={{ margin: 0 }}>Gestiona tareas únicas dentro de esta etapa.</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-secondary"
                          onClick={(ev) => {
                            ev.stopPropagation()
                            startEditEtapa(etapa)
                          }}
                        >
                          Editar etapa
                        </button>
                        <Link className="btn btn-secondary" to={`/proyectos/${proyectoId}/etapas/${etapa.id}`}>Entrar</Link>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Estado:</label>
                      <select
                        className="input"
                        value={estadoEdit[etapa.id] || etapa.estado}
                        onChange={(e) =>
                          setEstadoEdit((prev) => ({ ...prev, [etapa.id]: e.target.value }))
                        }
                        onClick={(ev) => ev.stopPropagation()}
                        style={{ maxWidth: 180 }}
                        disabled={allowedStates.length === 1}
                      >
                        {allowedStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <button
                        className="btn btn-secondary"
                        onClick={(ev) => {
                          ev.stopPropagation()
                          updateEstado(etapa.id)
                        }}
                        disabled={
                          estadoLoading[etapa.id] ||
                          (estadoEdit[etapa.id] || etapa.estado) === etapa.estado
                        }
                      >
                        {estadoLoading[etapa.id] ? 'Actualizando...' : 'Actualizar estado'}
                      </button>
                      {estadoError[etapa.id] && (
                        <span className="error-msg" style={{ margin: 0 }}>{estadoError[etapa.id]}</span>
                      )}
                    </div>

                    {editEtapaId === etapa.id && (
                      <form className="edit-etapa-form" onSubmit={saveEditEtapa} style={{ marginBottom: 12 }}>
                        <div className="form-row">
                          <label>Nombre *</label>
                          <input
                            type="text"
                            value={editForm.nombre}
                            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-row">
                          <label>Descripción</label>
                          <textarea
                            value={editForm.descripcion}
                            onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div className="form-row two-cols">
                          <div className="col">
                            <label>Fecha inicio</label>
                            <input
                              type="datetime-local"
                              value={editForm.fecha_inicio}
                              onChange={(e) => setEditForm({ ...editForm, fecha_inicio: e.target.value })}
                            />
                          </div>
                          <div className="col">
                            <label>Fecha fin</label>
                            <input
                              type="datetime-local"
                              value={editForm.fecha_cierre}
                              onChange={(e) => setEditForm({ ...editForm, fecha_cierre: e.target.value })}
                            />
                          </div>
                        </div>
                        <label className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={editForm.permitir_entregas_fuera_tiempo}
                            onChange={(e) =>
                              setEditForm({ ...editForm, permitir_entregas_fuera_tiempo: e.target.checked })
                            }
                          />
                          Permitir entregas fuera de tiempo
                        </label>

                        {editError && <div className="error-msg">{editError}</div>}

                        <div className="actions" style={{ marginTop: 4 }}>
                          <button className="btn btn-primary" type="submit" disabled={editLoading}>
                            {editLoading ? 'Guardando...' : 'Guardar cambios'}
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={cancelEditEtapa} disabled={editLoading}>
                            Cancelar
                          </button>
                        </div>
                      </form>
                    )}
                    {etapa.loadingTareas && <p className="muted">Cargando tareas...</p>}
                    {!etapa.loadingTareas && (!etapa.tareas || etapa.tareas.length === 0) && (
                      <p className="muted">No hay tareas en esta etapa.</p>
                    )}
                    {!etapa.loadingTareas && etapa.tareas && etapa.tareas.length > 0 && (
                      <div className="tareas-list">
                        {etapa.tareas.map((tarea) => (
                          <div key={tarea.id} className="tarea-item">
                            <div className="tarea-title">
                              <span className="orden">{tarea.numero_orden}</span>
                              <div className="nombre">{tarea.nombre}</div>
                              <span className={`pill ${tarea.es_entregable ? 'entregable' : 'no-entregable'}`}>
                                {tarea.es_entregable ? 'Entregable' : 'No entregable'}
                              </span>
                            </div>
                            {tarea.descripcion && <div className="tarea-descripcion">{tarea.descripcion}</div>}
                            <div className="tarea-meta">
                              <span className={`estado estado-${tarea.estado}`}>{tarea.estado}</span>
                              {tarea.fecha_limite && (
                                <span className="pill soft">Límite: {new Date(tarea.fecha_limite).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
