import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./MateriaDetail.css";

interface Etapa {
  id: string;
  nombre: string;
  descripcion?: string;
  numero_orden: number;
  tipo: "documento" | "revision" | "sustentacion" | "correcciones";
  estado: "planificada" | "abierta" | "cerrada" | "archivada";
  fecha_apertura?: string;
  fecha_cierre?: string;
  fecha_limite_entrega?: string;
  permitir_entregas_fuera_tiempo?: boolean;
  descripcion_entrega?: string;
}

interface Materia {
  id: string;
  semestre: number;
  materia: string;
  codigo_materia?: string;
}

interface Gestion {
  nombre: string;
}

interface FormData {
  nombre: string;
  descripcion: string;
  tipo: "documento" | "revision" | "sustentacion" | "correcciones";
  fecha_apertura: string;
  fecha_cierre: string;
  fecha_limite_entrega: string;
  permitir_entregas_fuera_tiempo: boolean;
  descripcion_entrega: string;
}

export default function MateriaDetail() {
  const { gestionId, materiaId } = useParams<{ gestionId: string; materiaId: string }>();
  const navigate = useNavigate();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [gestion, setGestion] = useState<Gestion | null>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    tipo: "documento",
    fecha_apertura: "",
    fecha_cierre: "",
    fecha_limite_entrega: "",
    permitir_entregas_fuera_tiempo: false,
    descripcion_entrega: "",
  });

  useEffect(() => {
    loadData();
  }, [gestionId, materiaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading materia data...');
      console.log('  Gestion ID:', gestionId);
      console.log('  Materia ID:', materiaId);

      const [gestionRes, etapasRes] = await Promise.all([
        api.get(`/gestiones/${gestionId}`),
        api.get(`/materias/${materiaId}/etapas`),
      ]);

      const gestion = gestionRes.data.gestion;
      setGestion({ nombre: gestion.nombre });

      const materia = gestion.materias.find((m: any) => m.id === materiaId);
      if (materia) {
        setMateria(materia);
        console.log('✅ Materia found:', materia);
      } else {
        console.warn('⚠️ Materia not found in gestion');
      }

      console.log('✅ Etapas loaded:', etapasRes.data.etapas?.length || 0);
      setEtapas(etapasRes.data.etapas || []);
    } catch (err: any) {
      console.error("❌ Error loading data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        tipo: formData.tipo,
        fecha_apertura: formData.fecha_apertura || null,
        fecha_cierre: formData.fecha_cierre || null,
        fecha_limite_entrega: formData.fecha_limite_entrega || null,
        permitir_entregas_fuera_tiempo:
          formData.permitir_entregas_fuera_tiempo || false,
        descripcion_entrega: formData.descripcion_entrega || null,
      };

      console.log('📝 Creating/Updating etapa');
      console.log('  Materia ID:', materiaId);
      console.log('  Editing ID:', editingId);
      console.log('  Payload:', payload);

      if (editingId) {
        const response = await api.put(`/materias/${materiaId}/etapas/${editingId}`, payload);
        console.log('✅ Update response:', response);
        setSuccess("Etapa actualizada exitosamente");
      } else {
        const response = await api.post(`/materias/${materiaId}/etapas`, payload);
        console.log('✅ Create response:', response);
        setSuccess("Etapa creada exitosamente");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      console.error('❌ Error:', err);
      console.error('  Response:', err.response?.data);
      console.error('  Message:', err.message);
      setError(err.response?.data?.error || "Error al guardar etapa");
    }
  };

  const handleEdit = (etapa: Etapa) => {
    setFormData({
      nombre: etapa.nombre,
      descripcion: etapa.descripcion || "",
      tipo: etapa.tipo,
      fecha_apertura: etapa.fecha_apertura || "",
      fecha_cierre: etapa.fecha_cierre || "",
      fecha_limite_entrega: etapa.fecha_limite_entrega || "",
      permitir_entregas_fuera_tiempo: etapa.permitir_entregas_fuera_tiempo || false,
      descripcion_entrega: etapa.descripcion_entrega || "",
    });
    setEditingId(etapa.id);
    setShowForm(true);
  };

  const handleDelete = async (etapaId: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta etapa?")) {
      try {
        await api.delete(`/materias/${materiaId}/etapas/${etapaId}`);
        setSuccess("Etapa eliminada exitosamente");
        loadData();
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al eliminar etapa");
      }
    }
  };

  const handleStateChange = async (etapaId: string, newState: string) => {
    try {
      console.log('📝 Changing etapa state:', { materiaId, etapaId, newState });
      const response = await api.patch(`/materias/${materiaId}/etapas/${etapaId}`, {
        estado: newState,
      });
      console.log('✅ State change response:', response.data);
      setSuccess("Estado actualizado exitosamente");
      loadData();
    } catch (err: any) {
      console.error('❌ Error changing state:', err);
      console.error('  Response:', err.response?.data);
      setError(err.response?.data?.error || "Error al actualizar estado de etapa");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      tipo: "documento",
      fecha_apertura: "",
      fecha_cierre: "",
      fecha_limite_entrega: "",
      permitir_entregas_fuera_tiempo: false,
      descripcion_entrega: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getTipoIcon = (tipo: string) => {
    const iconMap: Record<string, string> = {
      documento: "📄",
      revision: "👀",
      sustentacion: "🎤",
      correcciones: "✏️",
    };
    return iconMap[tipo] || "📋";
  };

  const getEstadoBadgeClass = (estado: string) => {
    const classMap: Record<string, string> = {
      planificada: "badge-info",
      abierta: "badge-success",
      cerrada: "badge-warning",
      archivada: "badge-danger",
    };
    return classMap[estado] || "badge-secondary";
  };

  if (loading) {
    return (
      <div className="materia-detail-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (!materia || !gestion) {
    return (
      <div className="materia-detail-container">
        <div className="error-state">
          <p>{error || "Materia no encontrada"}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="materia-detail-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1>{materia.materia}</h1>
        <span className="semestre-info">Semestre {materia.semestre}</span>
      </div>

      <div className="materia-info card">
        <div className="info-row">
          <span className="label">Gestión:</span>
          <span className="value">{gestion.nombre}</span>
        </div>
        {materia.codigo_materia && (
          <div className="info-row">
            <span className="label">Código:</span>
            <span className="value">{materia.codigo_materia}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button className="close-btn" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <strong>Éxito:</strong> {success}
          <button className="close-btn" onClick={() => setSuccess(null)}>
            ✕
          </button>
        </div>
      )}

      <div className="etapas-section">
        <div className="section-header">
          <h2>📋 Gestión de Etapas</h2>
        </div>

        {!showForm && (
          <button
            className="btn-new-etapa"
            onClick={() => setShowForm(true)}
          >
            ➕ NUEVA ETAPA
          </button>
        )}

        {showForm && (
          <div className="form-section card">
            <h3>{editingId ? "Editar Etapa" : "Crear Nueva Etapa"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la Etapa *</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Entrega de propuesta"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipo">Tipo *</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="documento">Documento</option>
                    <option value="revision">Revisión</option>
                    <option value="sustentacion">Sustentación</option>
                    <option value="correcciones">Correcciones</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción de la etapa"
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_apertura">Fecha de Apertura</label>
                  <input
                    id="fecha_apertura"
                    type="datetime-local"
                    name="fecha_apertura"
                    value={formData.fecha_apertura}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_cierre">Fecha de Cierre</label>
                  <input
                    id="fecha_cierre"
                    type="datetime-local"
                    name="fecha_cierre"
                    value={formData.fecha_cierre}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_limite_entrega">Límite de Entrega</label>
                  <input
                    id="fecha_limite_entrega"
                    type="datetime-local"
                    name="fecha_limite_entrega"
                    value={formData.fecha_limite_entrega}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group checkbox">
                <input
                  id="permitir_entregas"
                  type="checkbox"
                  name="permitir_entregas_fuera_tiempo"
                  checked={formData.permitir_entregas_fuera_tiempo}
                  onChange={handleInputChange}
                />
                <label htmlFor="permitir_entregas">
                  Permitir entregas fuera de tiempo
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion_entrega">
                  Descripción de la Entrega
                </label>
                <textarea
                  id="descripcion_entrega"
                  name="descripcion_entrega"
                  value={formData.descripcion_entrega}
                  onChange={handleInputChange}
                  placeholder="Especifica qué deben entregar los estudiantes"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Actualizar" : "Crear"} Etapa
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {etapas.length > 0 ? (
          <div className="etapas-grid">
            {etapas.map((etapa) => (
              <div key={etapa.id} className="etapa-card card">
                <div className="card-header">
                  <div className="etapa-title">
                    <span className="tipo-icon">{getTipoIcon(etapa.tipo)}</span>
                    <h3>{etapa.nombre}</h3>
                  </div>
                  <span className={`badge ${getEstadoBadgeClass(etapa.estado)}`}>
                    {etapa.estado.toUpperCase()}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-item">
                    <label>Número:</label>
                    <span>{etapa.numero_orden}</span>
                  </div>

                  <div className="info-item">
                    <label>Tipo:</label>
                    <span>{etapa.tipo}</span>
                  </div>

                  {etapa.fecha_apertura && (
                    <div className="info-item">
                      <label>Apertura:</label>
                      <span>
                        {new Date(etapa.fecha_apertura).toLocaleString("es-ES")}
                      </span>
                    </div>
                  )}

                  {etapa.fecha_cierre && (
                    <div className="info-item">
                      <label>Cierre:</label>
                      <span>
                        {new Date(etapa.fecha_cierre).toLocaleString("es-ES")}
                      </span>
                    </div>
                  )}

                  {etapa.fecha_limite_entrega && (
                    <div className="info-item highlight">
                      <label>Límite Entrega:</label>
                      <span>
                        {new Date(etapa.fecha_limite_entrega).toLocaleString(
                          "es-ES"
                        )}
                      </span>
                    </div>
                  )}

                  {etapa.descripcion_entrega && (
                    <div className="info-item">
                      <label>A Entregar:</label>
                      <span className="deliver-info">{etapa.descripcion_entrega}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  {etapa.estado === "abierta" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/gestion/${gestionId}/materia/${materiaId}/etapa/${etapa.id}`)}
                    >
                      📋 Entrar a la Etapa
                    </button>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(etapa)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      const nextState =
                        etapa.estado === "planificada"
                          ? "abierta"
                          : etapa.estado === "abierta"
                          ? "cerrada"
                          : "archivada";
                      handleStateChange(etapa.id, nextState);
                    }}
                  >
                    {etapa.estado === "planificada"
                      ? "Abrir"
                      : etapa.estado === "abierta"
                      ? "Cerrar"
                      : "Archivar"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(etapa.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="empty-state card">
              <p>📭 No hay etapas creadas en esta materia</p>
              <p className="subtitle">Crea la primera etapa haciendo clic en "+ NUEVA ETAPA"</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
