import { useEffect, useState, FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import api from '../lib/api'
import { hasRole } from '../lib/roles'

interface Tarea {
  id: string
  nombre: string
  descripcion?: string
  es_entregable: boolean
  numero_orden: number
  estado: string
  fecha_limite?: string
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
  tareas?: Tarea[]
}

export default function ProyectoEtapaDetail() {
  const { proyectoId, etapaId } = useParams()
  const { user } = useAuthStore()
  const { success, error: showError } = useToastStore()
  const [etapa, setEtapa] = useState<Etapa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState({ nombre: '', descripcion: '', es_entregable: false, fecha_limite: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '', es_entregable: false })
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (proyectoId && etapaId) {
      loadEtapa()
    }
  }, [proyectoId, etapaId])

  const loadEtapa = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/proyectos/${proyectoId}/etapas/${etapaId}`)
      setEtapa(res.data.etapa)
    } catch (err: any) {
      console.error('Error cargando etapa:', err)
      const msg = err.response?.data?.error || 'No se pudo cargar la etapa'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const canManage = () => {
    if (!user) return false
    return hasRole(user, 'tutor') || hasRole(user, 'revisor') || hasRole(user, 'administrador')
  }

  const handleCreateTarea = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setCreateError('El nombre es requerido')
      return
    }

    setCreating(true)
    setCreateError('')
    try {
      await api.post(`/proyectos/${proyectoId}/etapas/${etapaId}/tareas`, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        es_entregable: form.es_entregable,
        fecha_limite: form.fecha_limite ? new Date(form.fecha_limite).toISOString() : null,
      })
      setForm({ nombre: '', descripcion: '', es_entregable: false, fecha_limite: '' })
      success('Tarea creada exitosamente')
      await loadEtapa()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo crear la tarea'
      setCreateError(msg)
      showError(msg)
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (t: Tarea) => {
    setEditId(t.id)
    setEditForm({ nombre: t.nombre, descripcion: t.descripcion || '', es_entregable: t.es_entregable })
  }

  const cancelEdit = () => {
    setEditId(null)
    setSavingEdit(false)
  }

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault()
    if (!proyectoId || !etapaId || !editId) return
    if (!editForm.nombre.trim()) return
    setSavingEdit(true)
    try {
      await api.put(`/proyectos/${proyectoId}/etapas/${etapaId}/tareas/${editId}`, {
        nombre: editForm.nombre.trim(),
        descripcion: editForm.descripcion.trim() || null,
        es_entregable: editForm.es_entregable,
      })
      success('Tarea actualizada exitosamente')
      await loadEtapa()
      setEditId(null)
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error guardando edición de tarea'
      showError(msg)
      console.error('Error guardando edición de tarea:', err)
    } finally {
      setSavingEdit(false)
    }
  }

  const deleteTarea = async (tareaId: string) => {
    if (!proyectoId || !etapaId) return
    const ok = window.confirm('¿Eliminar esta tarea? Esta acción no se puede deshacer.')
    if (!ok) return
    setDeletingId(tareaId)
    try {
      await api.delete(`/proyectos/${proyectoId}/etapas/${etapaId}/tareas/${tareaId}`)
      success('Tarea eliminada exitosamente')
      await loadEtapa()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error eliminando tarea'
      showError(msg)
      console.error('Error eliminando tarea:', err)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="container">Cargando etapa...</div>
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <div style={{ marginTop: 12 }}>
          <Link to={`/proyectos/${proyectoId}`}>Volver al proyecto</Link>
        </div>
      </div>
    )
  }

  if (!etapa) {
    return (
      <div className="container">
        <div className="error">Etapa no encontrada</div>
        <div style={{ marginTop: 12 }}>
          <Link to={`/proyectos/${proyectoId}`}>Volver al proyecto</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>
          Etapa #{etapa.numero_orden}: {etapa.nombre}
        </h2>
        <Link to={`/proyectos/${proyectoId}`} className="btn btn-secondary">← Volver</Link>
      </div>
      {etapa.descripcion && <p style={{ color: '#555' }}>{etapa.descripcion}</p>}
      <div style={{ marginBottom: 16 }}>
        {etapa.fecha_inicio && (
          <span className="pill" style={{ marginRight: 8 }}>Inicio: {new Date(etapa.fecha_inicio).toLocaleDateString()}</span>
        )}
        {etapa.fecha_cierre && (
          <span className="pill">Cierre: {new Date(etapa.fecha_cierre).toLocaleDateString()}</span>
        )}
        {etapa.fecha_publicacion && (
          <span className="pill soft" style={{ marginLeft: 8 }}>
            Publicada: {new Date(etapa.fecha_publicacion).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Tareas (etapas únicas dentro de esta etapa)</h3>
          <span className="pill">{etapa.tareas?.length || 0} tareas</span>
        </div>

        {canManage() && (
        <form onSubmit={handleCreateTarea} className="form-grid" style={{ marginTop: 12 }}>
          <div className="form-row">
            <label>Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Subir borrador de resumen"
              required
            />
          </div>
          <div className="form-row">
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Detalle breve"
              rows={2}
            />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.es_entregable}
              onChange={(e) => setForm({ ...form, es_entregable: e.target.checked })}
            />
            Requiere entrega de archivo
          </label>
          <div className="form-row">
            <label>Fecha límite</label>
            <input
              type="datetime-local"
              value={form.fecha_limite}
              onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
            />
          </div>

          {createError && <div className="error-msg">{createError}</div>}

          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? 'Creando...' : 'Agregar tarea'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm({ nombre: '', descripcion: '', es_entregable: false, fecha_limite: '' })
                setCreateError('')
              }}
              disabled={creating}
            >
              Limpiar
            </button>
          </div>
        </form>
        )}

        <div style={{ marginTop: 16 }}>
          {!etapa.tareas || etapa.tareas.length === 0 ? (
            <p className="muted">No hay tareas creadas en esta etapa.</p>
          ) : (
            <div className="tareas-list">
              {etapa.tareas.map((t) => (
                <div key={t.id} className="tarea-item">
                  {editId === t.id ? (
                    <form onSubmit={saveEdit} className="form-grid" style={{ marginBottom: 8 }}>
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
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={editForm.es_entregable}
                          onChange={(e) => setEditForm({ ...editForm, es_entregable: e.target.checked })}
                        />
                        Requiere entrega de archivo
                      </label>
                      <div className="actions">
                        <button className="btn btn-primary" type="submit" disabled={savingEdit}>
                          {savingEdit ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={cancelEdit} disabled={savingEdit}>
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="tarea-title">
                        <span className="orden">{t.numero_orden}</span>
                        <div className="nombre">{t.nombre}</div>
                        <span className={`pill ${t.es_entregable ? 'entregable' : 'no-entregable'}`}>
                          {t.es_entregable ? 'Entregable' : 'No entregable'}
                        </span>
                      </div>
                      {t.descripcion && <div className="tarea-descripcion">{t.descripcion}</div>}
                      {t.fecha_limite && (
                        <div className="tarea-descripcion" style={{ color: '#666', fontSize: '0.875rem' }}>
                          Límite: {new Date(t.fecha_limite).toLocaleDateString()}
                        </div>
                      )}
                      <div className="tarea-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`estado estado-${t.estado}`}>{t.estado}</span>
                        {canManage() && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-secondary" onClick={() => startEdit(t)}>Editar</button>
                            <button className="btn btn-danger" onClick={() => deleteTarea(t.id)} disabled={deletingId === t.id}>
                              {deletingId === t.id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
