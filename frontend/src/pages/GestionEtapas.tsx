import { useState, useEffect } from "react";
import api from "../lib/api";
import "./GestionEtapas.css";

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
  permitir_entregas_fuera_tiempo: boolean;
  descripcion_entrega?: string;
  criterios_evaluacion?: any;
  archivos_plantilla?: any;
  requerimientos?: any;
  created_at: string;
  updated_at: string;
}

interface FormData {
  nombre: string;
  descripcion: string;
  fecha_apertura: string;
  fecha_cierre: string;
  fecha_limite_entrega: string;
  permitir_entregas_fuera_tiempo: boolean;
  descripcion_entrega: string;
}

export default function GestionEtapas() {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    fecha_apertura: "",
    fecha_cierre: "",
    fecha_limite_entrega: "",
    permitir_entregas_fuera_tiempo: false,
    descripcion_entrega: "",
  });

  const [selectedEtapa, setSelectedEtapa] = useState<Etapa | null>(null);

  useEffect(() => {
    loadEtapas();
  }, []);

  const loadEtapas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/etapas");
      setEtapas(res.data.etapas);
    } catch (err) {
      console.error("Error loading etapas:", err);
      setError("Error al cargar las etapas");
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
        fecha_apertura: formData.fecha_apertura || null,
        fecha_cierre: formData.fecha_cierre || null,
        fecha_limite_entrega: formData.fecha_limite_entrega || null,
        permitir_entregas_fuera_tiempo:
          formData.permitir_entregas_fuera_tiempo || false,
        descripcion_entrega: formData.descripcion_entrega || null,
      };

      if (editingId) {
        await api.put(`/etapas/${editingId}`, payload);
        setSuccess("Etapa actualizada exitosamente");
      } else {
        await api.post("/etapas", payload);
        setSuccess("Etapa creada exitosamente");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        nombre: "",
        descripcion: "",
        fecha_apertura: "",
        fecha_cierre: "",
        fecha_limite_entrega: "",
        permitir_entregas_fuera_tiempo: false,
        descripcion_entrega: "",
      });

      setSelectedEtapa(null);

      loadEtapas();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar la etapa");
    }
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingId(etapa.id);
    setFormData({
      nombre: etapa.nombre,
      descripcion: etapa.descripcion || "",
      fecha_apertura: etapa.fecha_apertura
        ? new Date(etapa.fecha_apertura).toISOString().split("T")[0]
        : "",
      fecha_cierre: etapa.fecha_cierre
        ? new Date(etapa.fecha_cierre).toISOString().split("T")[0]
        : "",
      fecha_limite_entrega: etapa.fecha_limite_entrega
        ? new Date(etapa.fecha_limite_entrega).toISOString().split("T")[0]
        : "",
      permitir_entregas_fuera_tiempo: etapa.permitir_entregas_fuera_tiempo,
      descripcion_entrega: etapa.descripcion_entrega || "",
    });
    setSelectedEtapa(etapa);
    setShowForm(true);
  };

  const handleCancelar = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: "",
      descripcion: "",
      fecha_apertura: "",
      fecha_cierre: "",
      fecha_limite_entrega: "",
      permitir_entregas_fuera_tiempo: false,
      descripcion_entrega: "",
    });
    setSelectedEtapa(null);
  };

  const handleCambiarEstado = async (etapaId: string, nuevoEstado: string) => {
    try {
      setError(null);
      await api.put(`/etapas/${etapaId}`, { estado: nuevoEstado });
      setSuccess(`Estado cambiado a: ${nuevoEstado}`);
      loadEtapas();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cambiar el estado");
    }
  };

  const handleEliminar = async (etapaId: string) => {
    if (window.confirm("¿Está seguro de que desea archivar esta etapa?")) {
      try {
        setError(null);
        await api.delete(`/etapas/${etapaId}`);
        setSuccess("Etapa archivada exitosamente");
        loadEtapas();
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al archivar la etapa");
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      planificada: "#FFC107",
      abierta: "#4CAF50",
      cerrada: "#F44336",
      archivada: "#9E9E9E",
    };
    return colors[estado] || "#2196F3";
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      documento: "Documento",
      revision: "Revisión",
      sustentacion: "Sustentación",
      correcciones: "Correcciones",
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return <div className="gestion-etapas loading">Cargando etapas...</div>;
  }

  return (
    <div className="gestion-etapas">
      <h1>Gestión de Etapas</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="actions-bar">
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nueva Etapa
          </button>
        )}
      </div>

      {showForm && (
        <div className="etapa-form-container">
          <form onSubmit={handleSubmit} className="etapa-form">
            <h2>{editingId ? "Editar Etapa" : "Nueva Etapa"}</h2>

            {selectedEtapa && (
              <div className="readonly-meta">
                <p>
                  <strong>Número asignado:</strong> {selectedEtapa.numero_orden}
                </p>
                <p>
                  <strong>Tipo asignado:</strong>{" "}
                  {getTipoLabel(selectedEtapa.tipo)}
                </p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Ej: Anteproyecto"
              />
            </div>

            {/* numero_orden y tipo ahora se asignan automáticamente en backend; no se muestran en el formulario */}

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                placeholder="Descripción general de la etapa"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion_entrega">
                Descripción de Entrega
              </label>
              <textarea
                id="descripcion_entrega"
                name="descripcion_entrega"
                value={formData.descripcion_entrega}
                onChange={handleInputChange}
                rows={3}
                placeholder="¿Qué debe entregarse en esta etapa?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_apertura">Fecha de Apertura</label>
              <input
                type="datetime-local"
                id="fecha_apertura"
                name="fecha_apertura"
                value={formData.fecha_apertura}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_cierre">Fecha de Cierre</label>
              <input
                type="datetime-local"
                id="fecha_cierre"
                name="fecha_cierre"
                value={formData.fecha_cierre}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_limite_entrega">
                Fecha Límite de Entrega
              </label>
              <input
                type="datetime-local"
                id="fecha_limite_entrega"
                name="fecha_limite_entrega"
                value={formData.fecha_limite_entrega}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="permitir_entregas_fuera_tiempo"
                  checked={formData.permitir_entregas_fuera_tiempo}
                  onChange={handleInputChange}
                />
                Permitir entregas fuera del tiempo límite
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="etapas-grid">
        {etapas.map((etapa) => (
          <div key={etapa.id} className="etapa-card">
            <div className="etapa-header">
              <h3>{etapa.nombre}</h3>
              <span
                className="badge"
                style={{ backgroundColor: getEstadoColor(etapa.estado) }}
              >
                {etapa.estado}
              </span>
            </div>

            <div className="etapa-content">
              <p className="etapa-info">
                <strong>Número:</strong> {etapa.numero_orden}
              </p>
              <p className="etapa-info">
                <strong>Tipo:</strong> {getTipoLabel(etapa.tipo)}
              </p>

              {etapa.descripcion && (
                <p className="etapa-description">{etapa.descripcion}</p>
              )}

              <div className="etapa-dates">
                {etapa.fecha_apertura && (
                  <p className="etapa-info">
                    <strong>Apertura:</strong>{" "}
                    {new Date(etapa.fecha_apertura).toLocaleString("es-BO")}
                  </p>
                )}
                {etapa.fecha_cierre && (
                  <p className="etapa-info">
                    <strong>Cierre:</strong>{" "}
                    {new Date(etapa.fecha_cierre).toLocaleString("es-BO")}
                  </p>
                )}
                {etapa.fecha_limite_entrega && (
                  <p className="etapa-info">
                    <strong>Límite Entrega:</strong>{" "}
                    {new Date(etapa.fecha_limite_entrega).toLocaleString(
                      "es-BO",
                    )}
                  </p>
                )}
              </div>

              {etapa.descripcion_entrega && (
                <div className="etapa-entrega-desc">
                  <p>
                    <strong>A Entregar:</strong>
                  </p>
                  <p>{etapa.descripcion_entrega}</p>
                </div>
              )}
            </div>

            <div className="etapa-actions">
              <button
                className="btn btn-sm btn-info"
                onClick={() => handleEdit(etapa)}
              >
                Editar
              </button>

              {etapa.estado === "planificada" && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleCambiarEstado(etapa.id, "abierta")}
                >
                  Abrir
                </button>
              )}

              {etapa.estado === "abierta" && (
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleCambiarEstado(etapa.id, "cerrada")}
                >
                  Cerrar
                </button>
              )}

              {etapa.estado !== "archivada" && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(etapa.id)}
                >
                  Archivar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {etapas.length === 0 && !showForm && (
        <div className="empty-state">
          <p>No hay etapas configuradas aún</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Crear Primera Etapa
          </button>
        </div>
      )}
    </div>
  );
}
