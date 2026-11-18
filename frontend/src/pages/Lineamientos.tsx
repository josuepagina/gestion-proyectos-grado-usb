import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import './Lineamientos.css'

interface Lineamiento {
  id: string
  titulo: string
  archivo_nombre: string
  archivo_mime?: string
  archivo_size?: number
  created_at: string
  updated_at: string
  publicado_por_nombre?: string
  publicado_por_apellidos?: string
}

export default function Lineamientos() {
  const { user } = useAuthStore()
  const { success, error: showError } = useToastStore()
  const [lineamientos, setLineamientos] = useState<Lineamiento[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)

  const isAdmin = user?.rol === 'administrador'

  useEffect(() => {
    loadLineamientos()
  }, [])

  const loadLineamientos = async () => {
    try {
      setLoading(true)
      const response = await api.get('/lineamientos')
      setLineamientos(response.data.lineamientos || [])
    } catch (error) {
      console.error('Error loading lineamientos:', error)
      showError('No se pudieron cargar los lineamientos')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setTitulo('')
    setArchivo(null)
  }

  const handleCreate = () => {
    setEditingId(null)
    setTitulo('')
    setArchivo(null)
    setShowForm(true)
  }

  const handleEdit = (lineamiento: Lineamiento) => {
    setEditingId(lineamiento.id)
    setTitulo(lineamiento.titulo)
    setArchivo(null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim()) {
      showError('Debe ingresar un nombre para la publicacion')
      return
    }

    if (!editingId && !archivo) {
      showError('Debe cargar un archivo para publicar')
      return
    }

    try {
      setSubmitting(true)

      const formData = new FormData()
      formData.append('titulo', titulo.trim())
      if (archivo) {
        formData.append('archivo', archivo)
      }

      if (editingId) {
        await api.put(`/lineamientos/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        success('Lineamiento actualizado correctamente')
      } else {
        await api.post('/lineamientos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        success('Lineamiento publicado correctamente')
      }

      resetForm()
      await loadLineamientos()
    } catch (err: any) {
      const message = err.response?.data?.error || 'No se pudo guardar el lineamiento'
      showError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (lineamientoId: string) => {
    const confirmed = window.confirm('Esta seguro de eliminar este lineamiento?')
    if (!confirmed) return

    try {
      await api.delete(`/lineamientos/${lineamientoId}`)
      success('Lineamiento eliminado correctamente')
      await loadLineamientos()
    } catch (err: any) {
      const message = err.response?.data?.error || 'No se pudo eliminar el lineamiento'
      showError(message)
    }
  }

  const handleDownload = async (lineamiento: Lineamiento) => {
    try {
      const res = await api.get(`/lineamientos/${lineamiento.id}/download`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = lineamiento.archivo_nombre
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      const message = err.response?.data?.error || 'No se pudo descargar el archivo'
      showError(message)
    }
  }

  const formatFileSize = (size?: number) => {
    if (!size) return 'Tamano no disponible'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  if (loading) {
    return (
      <div className="lineamientos-page">
        <div className="loading">Cargando lineamientos...</div>
      </div>
    )
  }

  return (
    <div className="lineamientos-page">
      <div className="lineamientos-header">
        <div>
          <h1>Lineamientos</h1>
          <p>Documentos oficiales con reglas que deben respetar los proyectos de grado.</p>
        </div>
        {isAdmin && !showForm && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Publicar lineamiento
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="lineamientos-form card">
          <h2>{editingId ? 'Editar lineamiento' : 'Nuevo lineamiento'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Nombre de la publicacion</label>
              <input
                id="titulo"
                type="text"
                className="input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Formato oficial de anteproyecto"
                maxLength={255}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="archivo">
                Documento {editingId ? '(opcional para reemplazar)' : '(requerido)'}
              </label>
              <input
                id="archivo"
                type="file"
                className="input"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                required={!editingId}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? 'Guardando...'
                  : editingId
                  ? 'Guardar cambios'
                  : 'Publicar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={submitting}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {lineamientos.length === 0 ? (
        <div className="empty-state card">
          <p>No hay lineamientos publicados por el administrador.</p>
        </div>
      ) : (
        <div className="lineamientos-list">
          {lineamientos.map((lineamiento) => (
            <article className="lineamiento-card card" key={lineamiento.id}>
              <div className="lineamiento-content">
                <h3>{lineamiento.titulo}</h3>
                <p className="lineamiento-file">Archivo: {lineamiento.archivo_nombre}</p>
                <p className="lineamiento-meta">
                  Publicado por:{' '}
                  {lineamiento.publicado_por_nombre
                    ? `${lineamiento.publicado_por_nombre} ${lineamiento.publicado_por_apellidos || ''}`.trim()
                    : 'Administrador'}
                </p>
                <p className="lineamiento-meta">
                  Fecha: {new Date(lineamiento.created_at).toLocaleString()}
                </p>
                <p className="lineamiento-meta">Tamano: {formatFileSize(lineamiento.archivo_size)}</p>
              </div>

              <div className="lineamiento-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleDownload(lineamiento)}
                >
                  Descargar
                </button>
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleEdit(lineamiento)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(lineamiento.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
