import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./EtapaDetail.css";

interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: "individual" | "grupal";
  fecha_limite?: string;
  peso_evaluacion?: number;
  estado: "pendiente" | "en_progreso" | "completada" | "cancelada";
  orden: number;
}

interface Etapa {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  estado: string;
  numero_orden: number;
}

export default function EtapaDetail() {
  const { gestionId, materiaId, etapaId } = useParams<{
    gestionId: string;
    materiaId: string;
    etapaId: string;
  }>();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<Etapa | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_limite: "",
  });

  useEffect(() => {
    loadData();
  }, [etapaId, materiaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading etapa and tareas:', { etapaId, materiaId });
      const [etapaRes, tareasRes] = await Promise.all([
        api.get(`/materias/${materiaId}/etapas/${etapaId}`),
        api.get(`/materias/${materiaId}/etapas/${etapaId}/tareas`),
      ]);

      console.log('Etapa response:', etapaRes.data);
      console.log('Tareas response:', tareasRes.data);
      setEtapa(etapaRes.data.etapa || etapaRes.data);
      setTareas(tareasRes.data.tareas || tareasRes.data || []);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!formData.titulo.trim()) {
        setError("El título de la tarea es requerido");
        return;
      }

      console.log('Creating tarea with data:', {
        etapa_id: etapaId,
        titulo: formData.titulo,
        descripcion: formData.descripcion || null,
        fecha_limite: formData.fecha_limite || null,
      });

      await api.post(`/materias/${materiaId}/etapas/${etapaId}/tareas`, {
        titulo: formData.titulo,
        descripcion: formData.descripcion || null,
        fecha_limite: formData.fecha_limite || null,
      });

      setSuccess("Tarea creada exitosamente");
      setFormData({
        titulo: "",
        descripcion: "",
        fecha_limite: "",
      });
      setShowForm(false);
      loadData();
    } catch (err: any) {
      console.error('Error creating tarea:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || "Error al crear la tarea");
    }
  };

  const handleUpdateTarea = async (tareaId: string, nuevoEstado: string) => {
    try {
      await api.patch(`/materias/${materiaId}/etapas/${etapaId}/tareas/${tareaId}`, {
        estado: nuevoEstado,
      });
      setSuccess("Tarea actualizada");
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar la tarea");
    }
  };

  const handleDeleteTarea = async (tareaId: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta tarea?")) {
      try {
        await api.delete(`/materias/${materiaId}/etapas/${etapaId}/tareas/${tareaId}`);
        setSuccess("Tarea eliminada");
        loadData();
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al eliminar la tarea");
      }
    }
  };

  if (loading) {
    return <div className="etapa-detail-container"><div className="loading">Cargando...</div></div>;
  }

  if (!etapa) {
    return (
      <div className="etapa-detail-container">
        <div className="error-state">
          <p>{error || "Etapa no encontrada"}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/gestion/${gestionId}/materia/${materiaId}`)}
          >
            ← Volver a Materia
          </button>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: "status-pendiente",
      en_progreso: "status-progreso",
      completada: "status-completada",
      cancelada: "status-cancelada",
    };
    return colors[estado] || "";
  };

  return (
    <div className="etapa-detail-container">
      <div className="page-header">
        <button
          className="btn-back"
          onClick={() => navigate(`/gestion/${gestionId}/materia/${materiaId}`)}
        >
          ← Volver
        </button>
        <h1>{etapa.nombre}</h1>
      </div>

      <div className="etapa-info card">
        <div className="info-row">
          <span className="label">Tipo:</span>
          <span className="value">{etapa.tipo}</span>
        </div>
        <div className="info-row">
          <span className="label">Estado:</span>
          <span className={`value badge ${etapa.estado === 'activa' ? 'badge-success' : 'badge-warning'}`}>
            {etapa.estado}
          </span>
        </div>
        {etapa.descripcion && (
          <div className="info-row full">
            <span className="label">Descripción:</span>
            <span className="value">{etapa.descripcion}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="close-btn"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          <strong>Éxito:</strong> {success}
          <button
            type="button"
            className="close-btn"
            onClick={() => setSuccess(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="tareas-section">
        <div className="section-header">
          <h2>📝 Tareas de esta Etapa</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              ➕ Nueva Tarea
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-section card">
            <h3>Crear Nueva Tarea</h3>
            <form onSubmit={handleSubmit} className="tarea-form">
              <div className="form-group">
                <label htmlFor="titulo">
                  Título de la Tarea <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Revisar documentación"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe la tarea (opcional)"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_limite">Fecha Límite</label>
                  <input
                    type="date"
                    id="fecha_limite"
                    name="fecha_limite"
                    value={formData.fecha_limite}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Crear Tarea
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {tareas.length > 0 ? (
          <div className="tareas-grid">
            {tareas.map((tarea) => (
              <div key={tarea.id} className="tarea-card card">
                <div className="card-header">
                  <h3>{tarea.titulo}</h3>
                  <div className="badges">
                    <span className={`badge status ${getEstadoColor(tarea.estado)}`}>
                      {tarea.estado.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                {tarea.descripcion && (
                  <div className="card-body">
                    <p>{tarea.descripcion}</p>
                  </div>
                )}

                <div className="tarea-info">

                  {tarea.fecha_limite && (
                    <div className="info-item">
                      <span className="label">Fecha L\u00edmite:</span>
                      <span className="value">
                        {new Date(tarea.fecha_limite).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <select
                    value={tarea.estado}
                    onChange={(e) => handleUpdateTarea(tarea.id, e.target.value)}
                    className="estado-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTarea(tarea.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <p>No hay tareas en esta etapa. Crea la primera tarea.</p>
          </div>
        )}
      </div>
    </div>
  );
}
