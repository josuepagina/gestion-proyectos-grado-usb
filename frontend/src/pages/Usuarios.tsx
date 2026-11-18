import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import './Proyectos.css'

interface Usuario {
  id: string
  nombre: string
  apellidos: string
  email: string
  rol: string
  es_tutor?: boolean
  es_revisor?: boolean
  estado: string
  ru?: string
  created_at: string
}

export default function Usuarios() {
  const { user } = useAuthStore()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [rolFilter, setRolFilter] = useState('')
  const [onlyDocentesAmbosRoles, setOnlyDocentesAmbosRoles] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'estudiante' as 'estudiante' | 'docente' | 'administrador' | 'tutor' | 'revisor',
    es_tutor: false,
    es_revisor: false,
    estado: 'activo' as 'activo' | 'inactivo',
    ru: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.rol === 'administrador') {
      loadUsuarios()
    }
  }, [user?.id, user?.rol, rolFilter])

  const loadUsuarios = async () => {
    try {
      const url = rolFilter ? `/usuarios?rol=${rolFilter}` : '/usuarios'
      const response = await api.get(url)
      const normalizedUsuarios = (response.data.usuarios || []).map((u: Usuario) => ({
        ...u,
        // Fallback defensivo para registros antiguos o respuestas parciales
        es_tutor: Boolean(u.es_tutor) || u.rol === 'tutor',
        es_revisor: Boolean(u.es_revisor) || u.rol === 'revisor',
      }))
      setUsuarios(normalizedUsuarios)
    } catch (error) {
      console.error('Error loading usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (formData.rol === 'docente' && !formData.es_tutor && !formData.es_revisor) {
        setError('Para rol Docente debes marcar Tutor, Revisor o ambos.')
        setSaving(false)
        return
      }

      const rolToSave =
        formData.rol === 'docente'
          ? (formData.es_tutor ? 'tutor' : 'revisor')
          : formData.rol

      const createData: any = {
        ...formData,
        rol: rolToSave,
      }
      if (!createData.ru) delete createData.ru
      const response = await api.post('/usuarios', createData)
      const createdUser = response.data?.usuario
        ? {
            ...response.data.usuario,
            es_tutor: formData.rol === 'docente' ? formData.es_tutor : (response.data.usuario.es_tutor ?? formData.es_tutor),
            es_revisor: formData.rol === 'docente' ? formData.es_revisor : (response.data.usuario.es_revisor ?? formData.es_revisor),
          }
        : null

      if (createdUser) {
        setUsuarios((prev) => [createdUser, ...prev])
      } else {
        await loadUsuarios()
      }
      setShowCreateForm(false)
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear usuario')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario)
    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      password: '',
      rol: (usuario.rol === 'tutor' || usuario.rol === 'revisor') ? 'docente' : (usuario.rol as any),
      es_tutor: !!usuario.es_tutor,
      es_revisor: !!usuario.es_revisor,
      estado: usuario.estado as any,
      ru: usuario.ru || '',
    })
    setError('')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setError('')
    setSaving(true)

    try {
      if (formData.rol === 'docente' && !formData.es_tutor && !formData.es_revisor) {
        setError('Para rol Docente debes marcar Tutor, Revisor o ambos.')
        setSaving(false)
        return
      }

      const rolToSave =
        formData.rol === 'docente'
          ? (formData.es_tutor ? 'tutor' : 'revisor')
          : formData.rol

      const updateData: any = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        rol: rolToSave,
        es_tutor: formData.es_tutor,
        es_revisor: formData.es_revisor,
        estado: formData.estado,
        ru: formData.ru || undefined,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await api.put(`/usuarios/${editingUser.id}`, updateData)
      const updatedUser = response.data?.usuario
        ? {
            ...editingUser,
            ...response.data.usuario,
            es_tutor: formData.rol === 'docente' ? formData.es_tutor : (response.data.usuario.es_tutor ?? formData.es_tutor),
            es_revisor: formData.rol === 'docente' ? formData.es_revisor : (response.data.usuario.es_revisor ?? formData.es_revisor),
          }
        : {
            ...editingUser,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            email: formData.email,
            rol: rolToSave,
            es_tutor: formData.es_tutor,
            es_revisor: formData.es_revisor,
            estado: formData.estado,
            ru: formData.ru || undefined,
          }

      setUsuarios((prev) => prev.map((u) => (u.id === editingUser.id ? updatedUser : u)))
      setEditingUser(null)
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar usuario')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      email: '',
      password: '',
      rol: 'estudiante',
      es_tutor: false,
      es_revisor: false,
      estado: 'activo',
      ru: '',
    })
    setError('')
  }

  const getRolBadge = (rol: string) => {
    const badges: Record<string, string> = {
      estudiante: 'badge-info',
      tutor: 'badge-success',
      revisor: 'badge-warning',
      administrador: 'badge-danger',
    }
    return badges[rol] || 'badge-info'
  }

  const getRolLabel = (rol: string) => {
    const labels: Record<string, string> = {
      estudiante: 'Estudiante',
      tutor: 'Tutor',
      revisor: 'Revisor',
      administrador: 'Administrador',
    }
    return labels[rol] || rol
  }

  const filteredUsuarios = usuarios.filter((u) => {
    const tutorActivo = Boolean(u.es_tutor) || u.rol === 'tutor'
    const revisorActivo = Boolean(u.es_revisor) || u.rol === 'revisor'
    const ambosRolesActivos = tutorActivo && revisorActivo

    const matchesFilter = 
      u.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase())

    const matchesAmbosRoles = !onlyDocentesAmbosRoles || ambosRolesActivos

    return matchesFilter && matchesAmbosRoles
  })

  if (user?.rol !== 'administrador') {
    return <div className="error">No tienes permisos para acceder a esta página</div>
  }

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>
  }

  return (
    <div className="proyectos-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateForm(!showCreateForm)
            setEditingUser(null)
            resetForm()
          }}
        >
          {showCreateForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {(showCreateForm || editingUser) && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          {error && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={editingUser ? handleUpdate : handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label">Nombre <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  className="input"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label className="label">Apellidos <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  className="input"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={saving}
              />
            </div>
            {formData.rol === 'estudiante' && (
              <div className="form-group">
                <label className="label">RU (Carnet de Estudiante)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.ru}
                  onChange={(e) => setFormData({ ...formData, ru: e.target.value })}
                  disabled={saving}
                  placeholder="Número único del carnet estudiantil"
                />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label">Rol <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select
                  className="input"
                  value={formData.rol}
                  onChange={(e) => {
                    const nextRol = e.target.value as typeof formData.rol
                    setFormData({
                      ...formData,
                      rol: nextRol,
                      es_tutor: nextRol === 'estudiante' || nextRol === 'administrador' ? false : formData.es_tutor,
                      es_revisor: nextRol === 'estudiante' || nextRol === 'administrador' ? false : formData.es_revisor,
                    })
                  }}
                  required
                  disabled={saving}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              {formData.rol === 'docente' && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Tags de Docente</label>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.es_tutor}
                        disabled={saving}
                        onChange={(e) => setFormData({ ...formData, es_tutor: e.target.checked })}
                      />
                      Tutor
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.es_revisor}
                        disabled={saving}
                        onChange={(e) => setFormData({ ...formData, es_revisor: e.target.checked })}
                      />
                      Revisor
                    </label>
                  </div>
                  <small style={{ color: 'var(--text-light)' }}>
                    El administrador puede activar uno o ambos tags de forma independiente.
                  </small>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge badge-info">
                      Roles activos: {formData.es_tutor && formData.es_revisor ? 'Tutor y Revisor' : formData.es_tutor ? 'Tutor' : formData.es_revisor ? 'Revisor' : 'Ninguno'}
                    </span>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="label">Estado <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select
                  className="input"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                  required
                  disabled={saving}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label">
                Contraseña {editingUser ? '(dejar vacío para no cambiar)' : ''} <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                disabled={saving}
                minLength={6}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingUser(null)
                  resetForm()
                }}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="input"
          placeholder="Buscar por nombre, apellidos o email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          className="input"
          value={rolFilter}
          onChange={(e) => setRolFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">Todos los roles</option>
          <option value="estudiante">Estudiantes</option>
          <option value="tutor">Tutores</option>
          <option value="revisor">Revisores</option>
          <option value="administrador">Administradores</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={onlyDocentesAmbosRoles}
            onChange={(e) => setOnlyDocentesAmbosRoles(e.target.checked)}
          />
          Solo docentes con ambos roles
        </label>
      </div>

      {filteredUsuarios.length === 0 ? (
        <div className="empty-state">
          {filter || rolFilter ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
        </div>
      ) : (
        <div className="card">
          <h2>Lista de Usuarios ({filteredUsuarios.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rol / Roles Activos</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estado</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha Registro</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      {usuario.nombre} {usuario.apellidos}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{usuario.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {(usuario.es_tutor || usuario.es_revisor) ? (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {usuario.es_tutor && <span className="badge badge-success">Tutor</span>}
                          {usuario.es_revisor && <span className="badge badge-warning">Revisor</span>}
                        </div>
                      ) : (
                        <span className={`badge ${getRolBadge(usuario.rol)}`}>
                          {getRolLabel(usuario.rol)}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${usuario.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {new Date(usuario.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleEdit(usuario)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

