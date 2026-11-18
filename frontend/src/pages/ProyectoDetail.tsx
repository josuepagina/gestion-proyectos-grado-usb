import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import api from '../lib/api'
import { hasRole } from '../lib/roles'
import ProyectoEtapasTutor from '../components/ProyectoEtapasTutor'
import './ProyectoDetail.css'

interface Project {
  id: string
  titulo: string
  descripcion: string
  estado: string
  estudiante_id: string
  estudiante_nombre: string
  tutor_id?: string
  tutor_nombre: string
  fecha_entrega: string
}

interface Entrega {
  id: string
  tipo_entrega?: string
  tarea_nombre?: string
  etapa: string
  etapa_nombre?: string
  etapa_estado?: string
  fecha_apertura_efectiva?: string
  fecha_cierre_efectiva?: string
  fecha_limite_efectiva?: string
  archivo_nombre: string
  archivo_url: string
  version: number
  estado_revision: string
  estado_tutor?: string
  estado_revisor?: string
  fecha_subida: string
  total_observaciones: number
  observaciones_pendientes: number
}

interface Observacion {
  id: string
  comentario: string
  seccion_documento: string
  tipo: string
  estado_resuelto: boolean
  usuario_nombre: string
  usuario_rol: string
  fecha: string
}

export default function ProyectoDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const { success, error: showError } = useToastStore()
  const [project, setProject] = useState<Project | null>(null)
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedEntrega, setSelectedEntrega] = useState<string | null>(null)
  const [observaciones, setObservaciones] = useState<Observacion[]>([])
  const [bitacoras, setBitacoras] = useState<any[]>([])
  const [showBitacoras, setShowBitacoras] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [etapasDisponibles, setEtapasDisponibles] = useState<Array<{ id: string; nombre: string; abierta: boolean; codigo?: string; fecha_apertura?: string; fecha_cierre?: string; fecha_limite?: string }>>([])
  const [uploadData, setUploadData] = useState({
    etapa: '',
    archivo: null as File | null,
  })
  // Subida por Tarea (proyecto_tareas)
  const [uploadMode, setUploadMode] = useState<'tarea' | 'archivo'>('tarea')
  const [etapasAlumno, setEtapasAlumno] = useState<Array<{ id: string; nombre: string; estado?: string; fecha_inicio?: string; fecha_cierre?: string; tareas: any[] }>>([])
  const [selectedEtapaAlumno, setSelectedEtapaAlumno] = useState('')
  const [selectedTareaId, setSelectedTareaId] = useState('')
  const [tareaArchivoFile, setTareaArchivoFile] = useState<File | null>(null)
  const [tareaObservaciones, setTareaObservaciones] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [tutores, setTutores] = useState<any[]>([])
  const [showAssignTutor, setShowAssignTutor] = useState(false)
  const [selectedTutorId, setSelectedTutorId] = useState('')
  const [assigningTutor, setAssigningTutor] = useState(false)
  const [assignError, setAssignError] = useState('')
  const [revisores, setRevisores] = useState<any[]>([])
  const [proyectoRevisores, setProyectoRevisores] = useState<any[]>([])
  const [showAssignRevisor, setShowAssignRevisor] = useState(false)
  const [selectedRevisorId, setSelectedRevisorId] = useState('')
  const [assigningRevisor, setAssigningRevisor] = useState(false)
  const [assignRevisorError, setAssignRevisorError] = useState('')
  const [showAddObservacion, setShowAddObservacion] = useState(false)
  const [observacionData, setObservacionData] = useState({
    comentario: '',
    seccion_documento: '',
    tipo: 'observacion' as 'observacion' | 'aprobacion' | 'rechazo',
  })
  const [addingObservacion, setAddingObservacion] = useState(false)
  const [observacionError, setObservacionError] = useState('')
  const [changingStatus, setChangingStatus] = useState(false)
  const [closingProject, setClosingProject] = useState(false)
  const [closeProjectError, setCloseProjectError] = useState('')
  const [closeProjectSuccess, setCloseProjectSuccess] = useState('')
  const [etapasAlumnoError, setEtapasAlumnoError] = useState('')

  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])

  useEffect(() => {
    // Cargar tutores y revisores disponibles si es administrador
    if (user?.rol === 'administrador') {
      loadTutores()
      loadRevisores()
      loadProyectoRevisores()
    }
  }, [user, id])

  useEffect(() => {
    if (user?.rol === 'estudiante' && id) {
      loadEtapasAlumno(id)
    }
  }, [user, id])

  useEffect(() => {
    if (user?.rol !== 'estudiante' || !id) return
    const intervalId = window.setInterval(() => {
      loadEtapasAlumno(id)
    }, 30000)
    return () => window.clearInterval(intervalId)
  }, [user?.rol, id])

  useEffect(() => {
    if (selectedEntrega) {
      loadObservaciones()
      loadBitacoras()
    }
  }, [selectedEntrega])

  const loadProject = async () => {
    try {
      setLoadError(null)
      const projectRes = await api.get(`/proyectos/${id}`)
      setProject(projectRes.data.proyecto)
      
      // Cargar entregas de forma separada (para no bloquear si falla)
      try {
        const entregasRes = await api.get(`/entregas/proyecto/${id}`)
        setEntregas(entregasRes.data.entregas || [])
      } catch (entregasError: any) {
        console.error('Error loading entregas:', entregasError);
        // Si fallan las entregas pero el proyecto cargó, mostrar entregas vacío
        setEntregas([])
      }
      
      // Cargar etapas disponibles
      if (id) {
        loadEtapasDisponibles(id)
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error desconocido';
      const statusCode = error.response?.status;
      
      if (statusCode === 403) {
        setLoadError('No tienes permiso para acceder a este proyecto');
      } else if (statusCode === 404) {
        setLoadError('Proyecto no encontrado');
      } else {
        setLoadError(`Error: ${errorMsg}`);
      }
      console.error('Error loading project:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEtapasDisponibles = async (proyectoId: string) => {
    try {
      const response = await api.get(`/entregas/proyecto/${proyectoId}/etapas-disponibles`)
      const etapas = response.data.etapas || []
      console.log('Etapas disponibles recibidas:', etapas)
      setEtapasDisponibles(etapas)
      
      // Si hay etapas abiertas, seleccionar la primera
      const primeraAbierta = etapas.find((e: any) => e.abierta)
      if (primeraAbierta) {
        console.log('Seleccionando primera etapa abierta:', primeraAbierta)
        setUploadData({ etapa: primeraAbierta.id, archivo: null })
      }
    } catch (error) {
      console.error('Error fetching available stages:', error)
      setEtapasDisponibles([])
    }
  }

  const loadEtapasAlumno = async (proyectoId: string) => {
    try {
      const res = await api.get(`/proyectos/${proyectoId}/mis-tareas`)
        const etapas = (res.data.etapas || []).map((e: any) => ({ 
          id: e.id, 
          nombre: e.nombre,
          descripcion: e.descripcion,
          estado: e.estado,
          fecha_inicio: e.fecha_inicio,
          fecha_cierre: e.fecha_cierre,
          tareas: e.tareas || []
        }))
      setEtapasAlumno(etapas)
      // preselección si existe alguna
      if (etapas.length > 0) {
        setSelectedEtapaAlumno(etapas[0].id)
        // preseleccionar primera tarea entregable y activa si existe
        const primerasTareasActivas = (etapas[0].tareas || []).filter((t: any) => t.es_entregable && (t.estado === 'activa' || t.estado === 'pendiente'))
        if (primerasTareasActivas.length > 0) setSelectedTareaId(primerasTareasActivas[0].id)
      }
      setEtapasAlumnoError('')
    } catch (error) {
      console.error('Error cargando etapas del alumno:', error)
      setEtapasAlumno([])
      setEtapasAlumnoError('No se pudieron cargar las etapas activas')
    }
  }

  const loadObservaciones = async () => {
    if (!selectedEntrega) return

    try {
      // Find the selected entrega to check if it's a task delivery
      const entrega = entregas.find(e => e.id === selectedEntrega)
      const isTareaEntrega = entrega && (entrega as any).tipo_entrega === 'tarea'
      
      // Add tipo parameter for task-based entregas
      const url = isTareaEntrega 
        ? `/observaciones/entrega/${selectedEntrega}?tipo=tarea`
        : `/observaciones/entrega/${selectedEntrega}`
        
      const response = await api.get(url)
      setObservaciones(response.data.observaciones)
    } catch (error) {
      console.error('Error loading observaciones:', error)
    }
  }

  const loadBitacoras = async () => {
    if (!selectedEntrega) return

    try {
      const response = await api.get(`/bitacoras/entrega/${selectedEntrega}`)
      setBitacoras(response.data.bitacoras)
    } catch (error) {
      console.error('Error loading bitacoras:', error)
    }
  }

  const loadTutores = async () => {
    try {
      const response = await api.get('/usuarios/tutores')
      setTutores(response.data.tutores)
    } catch (error) {
      console.error('Error loading tutores:', error)
    }
  }

  const loadRevisores = async () => {
    try {
      const response = await api.get('/usuarios/revisores')
      setRevisores(response.data.revisores)
    } catch (error) {
      console.error('Error loading revisores:', error)
    }
  }

  const loadProyectoRevisores = async () => {
    if (!id) return
    try {
      const response = await api.get(`/proyectos/${id}/revisores`)
      setProyectoRevisores(response.data.revisores || [])
    } catch (error) {
      console.error('Error loading proyecto revisores:', error)
    }
  }

  const handleAssignTutor = async () => {
    if (!selectedTutorId || !id) return

    setAssigningTutor(true)
    setAssignError('')

    try {
      await api.post(`/proyectos/${id}/assign-tutor`, {
        tutor_id: selectedTutorId,
      })

      // Recargar el proyecto para mostrar el tutor asignado
      await loadProject()
      setShowAssignTutor(false)
      setSelectedTutorId('')
      success('Tutor asignado exitosamente')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al asignar tutor'
      setAssignError(errorMsg)
      showError(errorMsg)
    } finally {
      setAssigningTutor(false)
    }
  }

  const handleMarkResolved = async (observacionId: string) => {
    try {
      await api.put(`/observaciones/${observacionId}/resolve`)
      // Recargar observaciones
      await loadObservaciones()
      // Recargar proyecto para actualizar contadores
      await loadProject()
      success('Observación marcada como resuelta')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al marcar observación como resuelta'
      showError(errorMsg)
      console.error('Error marking observacion as resolved:', err)
    }
  }

  const handleAddObservacion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEntrega || !observacionData.comentario.trim()) return

    setAddingObservacion(true)
    setObservacionError('')

    try {
      // Find the selected entrega to check if it's a task delivery
      const entrega = entregas.find(e => e.id === selectedEntrega)
      const isTareaEntrega = entrega && (entrega as any).tipo_entrega === 'tarea'
      
      // Build request body based on entrega type
      const requestBody = isTareaEntrega ? {
        proyecto_entrega_id: selectedEntrega,
        comentario: observacionData.comentario,
        seccion_documento: observacionData.seccion_documento || undefined,
        tipo: observacionData.tipo,
      } : {
        entrega_id: selectedEntrega,
        comentario: observacionData.comentario,
        seccion_documento: observacionData.seccion_documento || undefined,
        tipo: observacionData.tipo,
      }

      await api.post('/observaciones', requestBody)

      // Recargar observaciones
      await loadObservaciones()
      // Recargar proyecto para actualizar contadores
      await loadProject()
      
      setShowAddObservacion(false)
      setObservacionData({
        comentario: '',
        seccion_documento: '',
        tipo: 'observacion',
      })
      success('Observación agregada exitosamente')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al agregar observación'
      setObservacionError(errorMsg)
      showError(errorMsg)
    } finally {
      setAddingObservacion(false)
    }
  }

  const handleChangeEntregaStatus = async (nuevoEstado: string) => {
    if (!selectedEntrega) return

    setChangingStatus(true)

    try {
      // Find the selected entrega to check if it's a task delivery
      const entrega = entregas.find(e => e.id === selectedEntrega)
      const isTareaEntrega = entrega && (entrega as any).tipo_entrega === 'tarea'

      // Use appropriate endpoint based on entrega type
      const endpoint = isTareaEntrega 
        ? `/entregas/tarea/${selectedEntrega}/status`
        : `/entregas/${selectedEntrega}/status`

      await api.put(endpoint, {
        estado_revision: nuevoEstado,
      })

      // Recargar proyecto y entregas
      await loadProject()
      await loadObservaciones()
      
      const estadoLabels: Record<string, string> = {
        aprobado: 'Aprobado',
        rechazado: 'Rechazado',
        en_revision: 'En Revisión',
        observado: 'Observado',
      }
      success(`Estado de entrega actualizado a: ${estadoLabels[nuevoEstado] || nuevoEstado}`)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al cambiar estado de la entrega'
      showError(errorMsg)
      console.error('Error changing entrega status:', err)
    } finally {
      setChangingStatus(false)
    }
  }

  const canAddObservacion = () => {
    if (!user || !selectedEntrega) return false
    return hasRole(user, 'tutor') || hasRole(user, 'revisor') || hasRole(user, 'administrador')
  }

  const canChangeStatus = () => {
    if (!user || !selectedEntrega) return false
    return hasRole(user, 'tutor') || hasRole(user, 'revisor') || hasRole(user, 'administrador')
  }

  const canCloseProject = () => {
    if (!user || !project) return false
    // Solo tutor puede cerrar proyecto
    if (!hasRole(user, 'tutor')) return false
    // Verificar que el tutor asignado sea el usuario actual
    if (project.tutor_id && project.tutor_id !== user.id) return false
    // Verificar que el proyecto tenga tutor asignado
    if (!project.tutor_id && !project.tutor_nombre) return false
    // No puede cerrar si ya está en estado final
    const estadosFinales = ['completado', 'aprobado', 'sustentado', 'rechazado']
    if (estadosFinales.includes(project.estado)) return false
    return true
  }

  const handleCloseProject = async () => {
    if (!id) return

    // Confirmar acción
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas cerrar este proyecto?\n\n' +
      'Esto marcará el proyecto como completado, indicando que ya se cumplió con lo necesario y no requiere más acciones.\n\n' +
      'IMPORTANTE: Asegúrate de que todas las entregas estén aprobadas tanto por el tutor como por el revisor, y que no haya observaciones pendientes.\n\n' +
      'Especialmente verifica que la Versión Final esté aprobada por ambos.'
    )

    if (!confirmar) return

    setClosingProject(true)
    setCloseProjectError('')
    setCloseProjectSuccess('')

    try {
      await api.post(`/proyectos/${id}/close`)
      const successMsg = 'Proyecto cerrado exitosamente. El proyecto ha sido marcado como completado.'
      setCloseProjectSuccess(successMsg)
      success(successMsg)
      // Recargar el proyecto para mostrar el nuevo estado
      await loadProject()
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setCloseProjectSuccess('')
      }, 5000)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al cerrar el proyecto'
      setCloseProjectError(errorMsg)
      showError(errorMsg)
    } finally {
      setClosingProject(false)
    }
  }

  const handleAssignRevisor = async () => {
    if (!selectedRevisorId || !id) return

    setAssigningRevisor(true)
    setAssignRevisorError('')

    try {
      await api.post(`/proyectos/${id}/assign-reviewer`, {
        revisor_id: selectedRevisorId,
      })

      // Recargar revisores asignados
      await loadProyectoRevisores()
      setShowAssignRevisor(false)
      setSelectedRevisorId('')
      success('Revisor asignado exitosamente')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al asignar revisor'
      setAssignRevisorError(errorMsg)
      showError(errorMsg)
    } finally {
      setAssigningRevisor(false)
    }
  }

  const getEtapaLabel = (etapa: string) => {
    const labels: Record<string, string> = {
      anteproyecto: 'Anteproyecto',
      entrega_parcial_1: 'Entrega Parcial 1',
      entrega_parcial_2: 'Entrega Parcial 2',
      entrega_parcial_3: 'Entrega Parcial 3',
      version_final: 'Versión Final',
    }
    return labels[etapa] || etapa
  }

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      registrado: 'badge-info',
      en_proceso: 'badge-info',
      en_desarrollo: 'badge-info',
      en_revision: 'badge-warning',
      correcciones: 'badge-warning',
      completado: 'badge-success',
      aprobado: 'badge-success',
      sustentado: 'badge-success',
      rechazado: 'badge-danger',
      pendiente: 'badge-info',
      observado: 'badge-warning',
    }
    return badges[estado] || 'badge-info'
  }

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      registrado: 'Registrado',
      en_proceso: 'En Proceso',
      en_desarrollo: 'En Desarrollo',
      en_revision: 'En Revisión',
      correcciones: 'Correcciones',
      completado: 'Completado',
      aprobado: 'Aprobado',
      sustentado: 'Sustentado',
      rechazado: 'Rechazado',
      pendiente: 'Pendiente',
      observado: 'Observado',
    }
    return labels[estado] || estado
  }

  const isProjectOwner = () => {
    if (!project || !user) return false
    // Verificar si el usuario es el estudiante dueño del proyecto
    return user.rol === 'estudiante' && project.estudiante_id === user.id
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('El archivo no puede exceder 10MB')
        return
      }
      // Validar tipo
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(file.type)) {
        setUploadError('Solo se permiten archivos PDF o Word (.doc, .docx)')
        return
      }
      setUploadData({ ...uploadData, archivo: file })
      setUploadError('')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadMode === 'archivo') {
      if (!uploadData.archivo || !id) return

      setUploading(true)
      setUploadError('')

      try {
        const formData = new FormData()
        formData.append('archivo', uploadData.archivo)
        formData.append('proyecto_id', id)
        formData.append('etapa', uploadData.etapa)

        await api.post('/entregas', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        await loadProject()
        setShowUploadForm(false)
        setUploadData({ etapa: '', archivo: null })
        const fileInput = document.getElementById('archivo-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        success('Archivo subido exitosamente')
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Error al subir el archivo'
        setUploadError(errorMsg)
        showError(errorMsg)
      } finally {
        setUploading(false)
      }
    } else {
      // upload por tarea entregable
      if (!id || !selectedTareaId || !tareaArchivoFile) {
        setUploadError('Selecciona etapa, tarea y adjunta un archivo')
        return
      }
      setUploading(true)
      setUploadError('')
      try {
        const formData = new FormData()
        formData.append('archivo', tareaArchivoFile)
        formData.append('observaciones', tareaObservaciones.trim() || '')
        
        await api.post(`/proyectos/${id}/tareas/${selectedTareaId}/entregar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        await loadProject()
        // recargar entregas para reflejar la nueva entrega en la lista
        try {
          const entregasRes = await api.get(`/entregas/proyecto/${id}`)
          setEntregas(entregasRes.data.entregas || [])
        } catch (errFetch: any) {
          console.error('Error recargando entregas:', errFetch)
        }
        setShowUploadForm(false)
        setSelectedEtapaAlumno('')
        setSelectedTareaId('')
        setTareaArchivoFile(null)
        setTareaObservaciones('')
        const fileInput = document.getElementById('tarea-archivo-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        success('Entrega registrada correctamente')
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Error al registrar la entrega de la tarea'
        setUploadError(errorMsg)
        showError(errorMsg)
      } finally {
        setUploading(false)
      }
    }
  }

  if (loading) {
    return <div className="loading">Cargando proyecto...</div>
  }

  if (loadError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)' }}>Error</h2>
        <p style={{ marginBottom: '1.5rem' }}>{loadError}</p>
        <Link to="/proyectos" className="btn btn-primary">
          ← Volver a proyectos
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Proyecto no encontrado</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>El proyecto que buscas no existe o no tienes acceso a él.</p>
        <Link to="/proyectos" className="btn btn-primary">
          ← Volver a proyectos
        </Link>
      </div>
    )
  }

  return (
    <div className="proyecto-detail">
      <div className="detail-header">
        <Link to="/proyectos" className="back-link">
          ← Volver a proyectos
        </Link>
        <h1>{project.titulo}</h1>
        <div className="project-info">
          <div>
            <strong>Estudiante:</strong> {project.estudiante_nombre}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <strong>Tutor:</strong> {project.tutor_nombre || 'Sin asignar'}
            {user?.rol === 'administrador' && (
              <button
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => setShowAssignTutor(!showAssignTutor)}
              >
                {project.tutor_nombre ? 'Cambiar Tutor' : 'Asignar Tutor'}
              </button>
            )}
          </div>
          {user?.rol === 'administrador' && (
            <div>
              <strong>Revisores:</strong>{' '}
              {proyectoRevisores.length > 0 ? (
                proyectoRevisores.map((r, idx) => (
                  <span key={r.id}>
                    {r.revisor_nombre}{idx < proyectoRevisores.length - 1 ? ', ' : ''}
                  </span>
                ))
              ) : (
                'Sin asignar'
              )}
              <button
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginLeft: '0.5rem' }}
                onClick={() => setShowAssignRevisor(!showAssignRevisor)}
              >
                {proyectoRevisores.length > 0 ? 'Agregar Revisor' : 'Asignar Revisor'}
              </button>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <strong>Estado:</strong>{' '}
            <span className={`badge ${getEstadoBadge(project.estado)}`}>
              {getEstadoLabel(project.estado)}
            </span>
            {canCloseProject() && (
              <button
                className="btn btn-success"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                onClick={handleCloseProject}
                disabled={closingProject}
                title="Cerrar proyecto cuando todas las entregas estén aprobadas"
              >
                {closingProject ? 'Cerrando...' : '✓ Cerrar Proyecto'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error para cierre de proyecto */}
      {closeProjectSuccess && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#d4edda', borderLeft: '4px solid #28a745' }}>
          <p style={{ margin: 0, color: '#155724' }}>{closeProjectSuccess}</p>
        </div>
      )}
      {closeProjectError && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545' }}>
          <p style={{ margin: 0, color: '#721c24' }}>{closeProjectError}</p>
        </div>
      )}

      {showAssignTutor && user?.rol === 'administrador' && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2>Asignar Tutor</h2>
          {assignError && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {assignError}
            </div>
          )}
          <div className="form-group">
            <label className="label">Seleccionar Tutor</label>
            <select
              className="input"
              value={selectedTutorId}
              onChange={(e) => setSelectedTutorId(e.target.value)}
              disabled={assigningTutor}
            >
              <option value="">Seleccione un tutor...</option>
              {tutores.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nombre} {tutor.apellidos} ({tutor.email})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleAssignTutor}
              disabled={assigningTutor || !selectedTutorId}
            >
              {assigningTutor ? 'Asignando...' : 'Asignar Tutor'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowAssignTutor(false)
                setSelectedTutorId('')
                setAssignError('')
              }}
              disabled={assigningTutor}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showAssignRevisor && user?.rol === 'administrador' && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2>Asignar Revisor</h2>
          {assignRevisorError && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {assignRevisorError}
            </div>
          )}
          <div className="form-group">
            <label className="label">Seleccionar Revisor</label>
            <select
              className="input"
              value={selectedRevisorId}
              onChange={(e) => setSelectedRevisorId(e.target.value)}
              disabled={assigningRevisor}
            >
              <option value="">Seleccione un revisor...</option>
              {revisores
                .filter((r) => !proyectoRevisores.some((pr) => pr.revisor_id === r.id))
                .map((revisor) => (
                  <option key={revisor.id} value={revisor.id}>
                    {revisor.nombre} {revisor.apellidos} ({revisor.email})
                  </option>
                ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleAssignRevisor}
              disabled={assigningRevisor || !selectedRevisorId}
            >
              {assigningRevisor ? 'Asignando...' : 'Asignar Revisor'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowAssignRevisor(false)
                setSelectedRevisorId('')
                setAssignRevisorError('')
              }}
              disabled={assigningRevisor}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {project.descripcion && (
        <div className="card">
          <h2>Descripción</h2>
          <p>{project.descripcion}</p>
        </div>
      )}

      {hasRole(user, 'tutor') && (
        <ProyectoEtapasTutor proyectoId={id!} />
      )}

      {user?.rol === 'estudiante' && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Etapas y tareas del proyecto</h2>
            <button className="btn btn-secondary" onClick={() => id && loadEtapasAlumno(id)} style={{ padding: '0.4rem 0.75rem' }}>
              Recargar
            </button>
          </div>
          {etapasAlumnoError && (
            <div className="error-message" style={{ marginBottom: '0.75rem' }}>{etapasAlumnoError}</div>
          )}
          {etapasAlumno.length === 0 ? (
            <div style={{ color: 'var(--text-light)' }}>No hay etapas registradas para este proyecto.</div>
          ) : (
            etapasAlumno.map((etapa) => (
              <div key={etapa.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700 }}>{etapa.nombre}</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                  {etapa.fecha_inicio && `Inicio: ${new Date(etapa.fecha_inicio).toLocaleDateString()} `}
                  {etapa.fecha_cierre && `| Cierre: ${new Date(etapa.fecha_cierre).toLocaleDateString()}`}
                  {etapa.estado && ` | Estado: ${etapa.estado}`}
                </div>
                {(etapa.tareas || []).length === 0 ? (
                  <div style={{ color: 'var(--text-light)', marginTop: 4 }}>No hay tareas en esta etapa.</div>
                ) : (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '1.1rem' }}>
                    {etapa.tareas.map((t: any) => (
                      <li key={t.id} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{t.nombre}</span>
                        {t.estado && (
                          <span style={{ color: 'var(--text-light)', marginLeft: 8 }}>
                            (Estado: {t.estado})
                          </span>
                        )}
                        {t.fecha_limite && (
                          <span style={{ color: 'var(--text-light)', marginLeft: 8 }}>
                            (Límite: {new Date(t.fecha_limite).toLocaleDateString()})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Entregas</h2>
          {isProjectOwner() && (
            <button
              className="btn btn-primary"
              onClick={() => {
                const next = !showUploadForm
                setShowUploadForm(next)
                if (next) {
                  // Cargar listas necesarias para ambos modos
                  loadEtapasDisponibles(id!)
                  loadEtapasAlumno(id!)
                }
              }}
            >
              {showUploadForm ? 'Cancelar' : 'Subir Entrega'}
            </button>
          )}
        </div>

        {showUploadForm && isProjectOwner() && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Subir Nueva Entrega</h3>
            {uploadError && (
              <div className="error-message" style={{ marginBottom: '1rem' }}>
                {uploadError}
              </div>
            )}
            
            {/* Selector de modo */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                type="button"
                className={`btn ${uploadMode === 'tarea' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUploadMode('tarea')}
                disabled={uploading}
              >
                Entregar por Tarea
              </button>
              <button
                type="button"
                className={`btn ${uploadMode === 'archivo' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUploadMode('archivo')}
                disabled={uploading}
              >
                Subir Archivo (global)
              </button>
            </div>

            {uploadMode === 'tarea' ? (
              etapasAlumno.length === 0 ? (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  borderLeft: '3px solid var(--danger)',
                  borderRadius: '0.25rem',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--danger)' }}>
                    No hay etapas publicadas con tareas disponibles
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUpload}>
                  <div className="form-group">
                    <label className="label">Etapa</label>
                    <select
                      className="input"
                      value={selectedEtapaAlumno}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedEtapaAlumno(val)
                        const etapa = etapasAlumno.find((x) => x.id === val)
                        const entregables = (etapa?.tareas || []).filter((t: any) => t.es_entregable)
                        setSelectedTareaId(entregables[0]?.id || '')
                      }}
                      disabled={uploading}
                      required
                    >
                      {etapasAlumno.map((e) => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Tarea Entregable</label>
                    <select
                      className="input"
                      value={selectedTareaId}
                      onChange={(e) => setSelectedTareaId(e.target.value)}
                      disabled={uploading}
                      required
                    >
                      {(etapasAlumno.find((x) => x.id === selectedEtapaAlumno)?.tareas || [])
                        .filter((t: any) => t.es_entregable && (t.estado === 'activa' || t.estado === 'pendiente'))
                        .map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                            {t.fecha_limite ? ` (Límite: ${new Date(t.fecha_limite).toLocaleDateString()})` : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Archivo (PDF o Word, máx. 10MB)</label>
                    <input
                      id="tarea-archivo-input"
                      type="file"
                      className="input"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          if (file.size > 10 * 1024 * 1024) {
                            setUploadError('El archivo no puede exceder 10MB')
                            return
                          }
                          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                          if (!validTypes.includes(file.type)) {
                            setUploadError('Solo se permiten archivos PDF o Word (.doc, .docx)')
                            return
                          }
                          setTareaArchivoFile(file)
                          setUploadError('')
                        }
                      }}
                      disabled={uploading}
                      required
                    />
                    {tareaArchivoFile && (
                      <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                        Archivo seleccionado: {tareaArchivoFile.name} ({(tareaArchivoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </small>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="label">Observaciones (opcional)</label>
                    <textarea
                      className="input"
                      value={tareaObservaciones}
                      onChange={(e) => setTareaObservaciones(e.target.value)}
                      rows={3}
                      disabled={uploading}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={uploading || !selectedTareaId || !tareaArchivoFile}>
                      {uploading ? 'Enviando...' : 'Registrar Entrega'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowUploadForm(false)
                        setSelectedEtapaAlumno('')
                        setSelectedTareaId('')
                        setTareaArchivoFile(null)
                        setTareaObservaciones('')
                        setUploadError('')
                      }}
                      disabled={uploading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )
            ) : (
              // Modo archivo global (existente)
              <>
              {etapasDisponibles.filter(e => e.abierta).length === 0 ? (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                borderLeft: '3px solid var(--danger)',
                borderRadius: '0.25rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontWeight: '500', color: 'var(--danger)' }}>
                  ⚠️ No hay etapas disponibles para entregas en este momento
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  {etapasDisponibles.length === 0 
                    ? 'No hay etapas configuradas en el sistema'
                    : `Hay ${etapasDisponibles.length} etapa(s) configurada(s) pero ninguna está abierta para entregas. Verifica que el administrador haya abierto una etapa y que las fechas sean válidas.`}
                </p>
                {etapasDisponibles.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>Etapas configuradas:</p>
                    {etapasDisponibles.map((e: any) => (
                      <p key={e.id} style={{ margin: '0.1rem 0' }}>
                        • {e.nombre} - Estado: {e.estado} - Abierta: {e.abierta ? 'Sí' : 'No'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              ) : (
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label className="label">Etapa</label>
                  <select
                    className="input"
                    value={uploadData.etapa}
                    onChange={(e) => setUploadData({ ...uploadData, etapa: e.target.value })}
                    disabled={uploading}
                    required
                  >
                    {etapasDisponibles
                      .filter(e => e.abierta)
                      .map(etapa => (
                        <option key={etapa.id} value={etapa.id}>
                          {etapa.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                {(() => {
                  // Encontrar la etapa seleccionada en la lista de etapas disponibles
                  const etapaSeleccionada = etapasDisponibles.find(e => e.id === uploadData.etapa)
                  const etapaInfo = etapaSeleccionada ? {
                    nombre: etapaSeleccionada.nombre,
                    fechaApertura: etapaSeleccionada.fecha_apertura,
                    fechaCierre: etapaSeleccionada.fecha_cierre,
                    fechaLimite: etapaSeleccionada.fecha_limite
                  } : null

                  return (
                    <>
                      {etapaInfo && (
                        <div style={{ 
                          marginBottom: '1rem', 
                          padding: '0.75rem', 
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          borderLeft: `3px solid var(--success)`,
                          borderRadius: '0.25rem'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                            ✓ Etapa abierta para entregas
                          </p>
                          {etapaInfo.fechaLimite && (
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                              Límite de entrega: {new Date(etapaInfo.fechaLimite).toLocaleString('es-BO')}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}

                <div className="form-group">
                  <label className="label">Archivo (PDF o Word, máx. 10MB)</label>
                  <input
                    id="archivo-input"
                    type="file"
                    className="input"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    disabled={uploading}
                    required
                  />
                  {uploadData.archivo && (
                    <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                      Archivo seleccionado: {uploadData.archivo.name} ({(uploadData.archivo.size / 1024 / 1024).toFixed(2)} MB)
                    </small>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={uploading || !uploadData.archivo}>
                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowUploadForm(false)
                      setUploadData({ etapa: '', archivo: null })
                      setUploadError('')
                    }}
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
              )}
              </>
            )}
          </div>
        )}

        {entregas.length === 0 ? (
          <p className="empty-state">No hay entregas registradas</p>
        ) : (
          <div className="entregas-list">
            {entregas.map((entrega) => (
              <div
                key={entrega.id}
                className={`entrega-item ${
                  selectedEntrega === entrega.id ? 'active' : ''
                }`}
                onClick={() =>
                  setSelectedEntrega(
                    selectedEntrega === entrega.id ? null : entrega.id
                  )
                }
              >
                <div className="entrega-header">
                  <div>
                    <h3>
                      {entrega.tipo_entrega === 'tarea' ? entrega.etapa_nombre : getEtapaLabel(entrega.etapa)}
                      {entrega.tipo_entrega === 'tarea' && entrega.tarea_nombre && (
                        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', marginLeft: '0.5rem', color: 'var(--text-light)' }}>
                          • {entrega.tarea_nombre}
                        </span>
                      )}
                    </h3>
                    <p className="entrega-meta">
                      {entrega.tipo_entrega === 'tarea' ? (
                        <>Entrega de tarea • {new Date(entrega.fecha_subida).toLocaleDateString()}</>
                      ) : (
                        <>Versión {entrega.version} • {new Date(entrega.fecha_subida).toLocaleDateString()}</>
                      )}
                      {entrega.etapa_estado && (
                        <>
                          <br />
                          <span style={{ 
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            color: entrega.etapa_estado === 'abierta' ? 'var(--success)' : 'var(--danger)'
                          }}>
                            Etapa: {entrega.etapa_estado === 'abierta' ? '✓ Abierta' : '✗ Cerrada'}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="entrega-status" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span className={`badge ${getEstadoBadge(entrega.estado_tutor || entrega.estado_revision)}`} style={{ fontSize: '0.75rem' }}>
                        Tutor: {getEstadoLabel(entrega.estado_tutor || entrega.estado_revision)}
                      </span>
                      {entrega.etapa === 'version_final' && (
                        <span className={`badge ${getEstadoBadge(entrega.estado_revisor || 'pendiente')}`} style={{ fontSize: '0.75rem' }}>
                          Revisor: {getEstadoLabel(entrega.estado_revisor || 'pendiente')}
                        </span>
                      )}
                    </div>
                    {entrega.observaciones_pendientes > 0 && (
                      <span className="badge badge-warning">
                        {entrega.observaciones_pendientes} observaciones
                      </span>
                    )}
                  </div>
                </div>
                <div className="entrega-actions">
                  <a
                    href={entrega.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver documento
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEntrega && (
        <>
          {canChangeStatus() && (() => {
            const entregaActual = entregas.find(e => e.id === selectedEntrega)
            const estadoTutor = entregaActual?.estado_tutor || entregaActual?.estado_revision || 'pendiente'
            const estadoRevisor = entregaActual?.estado_revisor || (entregaActual?.etapa === 'version_final' ? 'pendiente' : null)
            const estadoActual = hasRole(user, 'revisor') ? estadoRevisor : estadoTutor
            
            return (
              <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0, marginBottom: '0.75rem' }}>Estado de la Entrega</h2>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500' }}>Estado por Tutor:</span>
                      <span className={`badge ${getEstadoBadge(estadoTutor)}`} style={{ fontSize: '0.875rem' }}>
                        {getEstadoLabel(estadoTutor)}
                      </span>
                    </div>
                    {entregaActual?.etapa === 'version_final' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500' }}>Estado por Revisor:</span>
                        <span className={`badge ${getEstadoBadge(estadoRevisor || 'pendiente')}`} style={{ fontSize: '0.875rem' }}>
                          {getEstadoLabel(estadoRevisor || 'pendiente')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ marginBottom: '1.25rem', color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {hasRole(user, 'tutor') 
                    ? 'Cambia el estado de esta entrega según tu revisión como tutor. Esto afecta el estado de la entrega completa, no las observaciones individuales.'
                    : hasRole(user, 'revisor')
                    ? 'Cambia el estado de esta entrega según tu revisión como revisor. Solo puedes revisar entregas de Versión Final.'
                    : 'Cambia el estado general de esta entrega. Esto afecta el estado de la entrega completa, no las observaciones individuales.'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-success"
                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '500' }}
                    onClick={() => handleChangeEntregaStatus('aprobado')}
                    disabled={changingStatus || estadoActual === 'aprobado'}
                  >
                    ✓ Aprobar Entrega
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '500' }}
                    onClick={() => handleChangeEntregaStatus('rechazado')}
                    disabled={changingStatus || estadoActual === 'rechazado'}
                  >
                    ✗ Rechazar Entrega
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '500' }}
                    onClick={() => handleChangeEntregaStatus('en_revision')}
                    disabled={changingStatus || estadoActual === 'en_revision'}
                  >
                    🔍 En Revisión
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '500' }}
                    onClick={() => handleChangeEntregaStatus('observado')}
                    disabled={changingStatus || estadoActual === 'observado'}
                  >
                    ⚠ Observado
                  </button>
                </div>
                {changingStatus && (
                  <p style={{ marginTop: '0.75rem', color: 'var(--text-light)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                    Actualizando estado...
                  </p>
                )}
              </div>
            )
          })()}

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Observaciones</h2>
              {canAddObservacion() && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddObservacion(!showAddObservacion)}
                >
                  {showAddObservacion ? 'Cancelar' : 'Agregar Observación'}
                </button>
              )}
            </div>

            {showAddObservacion && canAddObservacion() && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Nueva Observación</h3>
                {observacionError && (
                  <div className="error-message" style={{ marginBottom: '1rem' }}>
                    {observacionError}
                  </div>
                )}
                <form onSubmit={handleAddObservacion}>
                  <div className="form-group">
                    <label className="label">Tipo</label>
                    <select
                      className="input"
                      value={observacionData.tipo}
                      onChange={(e) => setObservacionData({ ...observacionData, tipo: e.target.value as any })}
                      disabled={addingObservacion}
                    >
                      <option value="observacion">Observación</option>
                      <option value="aprobacion">Aprobación</option>
                      <option value="rechazo">Rechazo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Sección del Documento (opcional)</label>
                    <input
                      type="text"
                      className="input"
                      value={observacionData.seccion_documento}
                      onChange={(e) => setObservacionData({ ...observacionData, seccion_documento: e.target.value })}
                      placeholder="Ej: Capítulo 1, Introducción, etc."
                      disabled={addingObservacion}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Comentario <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <textarea
                      className="input"
                      value={observacionData.comentario}
                      onChange={(e) => setObservacionData({ ...observacionData, comentario: e.target.value })}
                      placeholder="Escribe tu observación aquí..."
                      rows={4}
                      disabled={addingObservacion}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={addingObservacion || !observacionData.comentario.trim()}>
                      {addingObservacion ? 'Agregando...' : 'Agregar Observación'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAddObservacion(false)
                        setObservacionData({ comentario: '', seccion_documento: '', tipo: 'observacion' })
                        setObservacionError('')
                      }}
                      disabled={addingObservacion}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {observaciones.length === 0 ? (
              <p className="empty-state">No hay observaciones registradas</p>
            ) : (
              <div className="observaciones-list">
                {(() => {
                  // Separar observaciones por rol
                  const tutorObservaciones = observaciones.filter(obs => obs.usuario_rol === 'tutor')
                  const revisorObservaciones = observaciones.filter(obs => obs.usuario_rol === 'revisor')
                  const otrasObservaciones = observaciones.filter(obs => obs.usuario_rol !== 'tutor' && obs.usuario_rol !== 'revisor')

                  return (
                    <>
                      {tutorObservaciones.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            marginBottom: '1rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid var(--primary)'
                          }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>
                              Aprobaciones del Tutor
                            </h3>
                            <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                              {tutorObservaciones.length}
                            </span>
                          </div>
                          {tutorObservaciones.map((obs) => (
                            <div
                              key={obs.id}
                              className={`observacion-item ${
                                obs.estado_resuelto ? 'resolved' : ''
                              }`}
                              style={{ marginBottom: '1rem' }}
                            >
                              <div className="observacion-header">
                                <div>
                                  <strong>{obs.usuario_nombre}</strong>
                                  <span className="observacion-role">({obs.usuario_rol})</span>
                                </div>
                                <span className={`badge ${
                                  obs.tipo === 'aprobacion' ? 'badge-success' :
                                  obs.tipo === 'rechazo' ? 'badge-danger' :
                                  'badge-info'
                                }`}>{obs.tipo}</span>
                              </div>
                              {obs.seccion_documento && (
                                <p className="observacion-section">
                                  Sección: {obs.seccion_documento}
                                </p>
                              )}
                              <p className="observacion-comment">{obs.comentario}</p>
                              <div className="observacion-footer">
                                <span className="observacion-date">
                                  {new Date(obs.fecha).toLocaleDateString()}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {obs.estado_resuelto ? (
                                    <span className="badge badge-success">Resuelta</span>
                                  ) : (
                                    isProjectOwner() && (
                                      <button
                                        className="btn btn-success"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => handleMarkResolved(obs.id)}
                                      >
                                        Marcar como Resuelta
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {revisorObservaciones.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            marginBottom: '1rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid var(--warning)',
                            marginTop: tutorObservaciones.length > 0 ? '2rem' : '0'
                          }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--warning)' }}>
                              Aprobaciones del Revisor
                            </h3>
                            <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                              {revisorObservaciones.length}
                            </span>
                          </div>
                          {revisorObservaciones.map((obs) => (
                            <div
                              key={obs.id}
                              className={`observacion-item ${
                                obs.estado_resuelto ? 'resolved' : ''
                              }`}
                              style={{ marginBottom: '1rem' }}
                            >
                              <div className="observacion-header">
                                <div>
                                  <strong>{obs.usuario_nombre}</strong>
                                  <span className="observacion-role">({obs.usuario_rol})</span>
                                </div>
                                <span className={`badge ${
                                  obs.tipo === 'aprobacion' ? 'badge-success' :
                                  obs.tipo === 'rechazo' ? 'badge-danger' :
                                  'badge-info'
                                }`}>{obs.tipo}</span>
                              </div>
                              {obs.seccion_documento && (
                                <p className="observacion-section">
                                  Sección: {obs.seccion_documento}
                                </p>
                              )}
                              <p className="observacion-comment">{obs.comentario}</p>
                              <div className="observacion-footer">
                                <span className="observacion-date">
                                  {new Date(obs.fecha).toLocaleDateString()}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {obs.estado_resuelto ? (
                                    <span className="badge badge-success">Resuelta</span>
                                  ) : (
                                    isProjectOwner() && (
                                      <button
                                        className="btn btn-success"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => handleMarkResolved(obs.id)}
                                      >
                                        Marcar como Resuelta
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {otrasObservaciones.length > 0 && (
                        <div style={{ marginTop: tutorObservaciones.length > 0 || revisorObservaciones.length > 0 ? '2rem' : '0' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            marginBottom: '1rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid var(--border)'
                          }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                              Otras Observaciones
                            </h3>
                            <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                              {otrasObservaciones.length}
                            </span>
                          </div>
                          {otrasObservaciones.map((obs) => (
                            <div
                              key={obs.id}
                              className={`observacion-item ${
                                obs.estado_resuelto ? 'resolved' : ''
                              }`}
                              style={{ marginBottom: '1rem' }}
                            >
                              <div className="observacion-header">
                                <div>
                                  <strong>{obs.usuario_nombre}</strong>
                                  <span className="observacion-role">({obs.usuario_rol})</span>
                                </div>
                                <span className={`badge ${
                                  obs.tipo === 'aprobacion' ? 'badge-success' :
                                  obs.tipo === 'rechazo' ? 'badge-danger' :
                                  'badge-info'
                                }`}>{obs.tipo}</span>
                              </div>
                              {obs.seccion_documento && (
                                <p className="observacion-section">
                                  Sección: {obs.seccion_documento}
                                </p>
                              )}
                              <p className="observacion-comment">{obs.comentario}</p>
                              <div className="observacion-footer">
                                <span className="observacion-date">
                                  {new Date(obs.fecha).toLocaleDateString()}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {obs.estado_resuelto ? (
                                    <span className="badge badge-success">Resuelta</span>
                                  ) : (
                                    isProjectOwner() && (
                                      <button
                                        className="btn btn-success"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => handleMarkResolved(obs.id)}
                                      >
                                        Marcar como Resuelta
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header-actions">
              <h2>Bitácoras</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setShowBitacoras(!showBitacoras)}
              >
                {showBitacoras ? 'Ocultar' : 'Mostrar'} bitácoras
              </button>
            </div>
            {showBitacoras && (
              <div className="bitacoras-list">
                {bitacoras.length === 0 ? (
                  <p className="empty-state">No hay bitácoras registradas</p>
                ) : (
                  bitacoras.map((bit) => (
                    <div key={bit.id} className="bitacora-item">
                      <div className="bitacora-header">
                        <div>
                          <strong>{bit.usuario_nombre}</strong>
                          <span className="bitacora-role">({bit.usuario_rol})</span>
                        </div>
                        <span className="badge badge-info">{bit.accion}</span>
                      </div>
                      <p className="bitacora-descripcion">{bit.descripcion}</p>
                      {bit.cambios_detectados && (
                        <div className="bitacora-cambios">
                          <strong>Cambios detectados:</strong>
                          <pre>{JSON.stringify(bit.cambios_detectados, null, 2)}</pre>
                        </div>
                      )}
                      {bit.version_anterior && bit.version_actual && (
                        <p className="bitacora-version">
                          Versión {bit.version_anterior} → {bit.version_actual}
                        </p>
                      )}
                      <span className="bitacora-date">
                        {new Date(bit.fecha).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}



