import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./GestionGestiones.css";

interface MateriaSemestre {
  semestre: number;
  materia: string;
  codigo_materia: string;
}

interface Gestion {
  id: string;
  nombre: string;
  materias: MateriaSemestre[];
  estado: "activa" | "inactiva";
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  nombre: string;
  materias: MateriaSemestre[];
  descripcion: string;
}

const SEMESTERS = [
  { value: 7, label: "7mo Semestre", materia: "Metodología de Investigación I" },
  { value: 8, label: "8vo Semestre", materia: "Metodología de Investigación II" },
  { value: 9, label: "9no Semestre", materia: "Taller de Grado I" },
  { value: 10, label: "10mo Semestre", materia: "Taller de Grado II" },
];

export default function GestionGestiones() {
  const navigate = useNavigate();
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    materias: [
      {
        semestre: 7,
        materia: "Metodología de Investigación I",
        codigo_materia: "",
      },
    ],
    descripcion: "",
  });

  const [filterSemestre, setFilterSemestre] = useState<number | "">("");
  const [filterEstado, setFilterEstado] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const gestionesRes = await api.get("/gestiones");
      const gestionesApi: Gestion[] = (gestionesRes.data.gestiones || []).map((g: any) => ({
        ...g,
        materias: Array.isArray(g.materias)
          ? g.materias.map((m: any) => ({
              semestre: Number(m.semestre),
              materia: m.materia,
              codigo_materia: m.codigo_materia || "",
            }))
          : [],
      }));
      setGestiones(gestionesApi);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Solo para campos generales (nombre, descripcion)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Para cambios en materias individuales
  const handleMateriaChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const materias = [...prev.materias];
      if (name === "semestre") {
        const semestreNum = Number(value);
        const selectedSemester = SEMESTERS.find((s) => s.value === semestreNum);
        materias[idx] = {
          ...materias[idx],
          semestre: semestreNum,
          materia: selectedSemester?.materia || "",
        };
      } else {
        materias[idx] = {
          ...materias[idx],
          [name]: value,
        };
      }
      return { ...prev, materias };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!formData.nombre.trim()) {
        setError("El nombre es requerido");
        return;
      }
      if (formData.materias.length === 0) {
        setError("Debe agregar al menos una materia");
        return;
      }
      // Validar que todos los semestres sean válidos
      for (const mat of formData.materias) {
        const semestreNum = Number(mat.semestre);
        if (
          ![7, 8, 9, 10].includes(semestreNum)
        ) {
          setError("El semestre es requerido y debe ser válido (7, 8, 9 o 10)");
          return;
        }
      }

      const payload = {
        nombre: formData.nombre,
        materias: formData.materias.map((m) => ({
          semestre: Number(m.semestre),
          materia: m.materia,
          codigo_materia: m.codigo_materia || null,
        })),
        descripcion: formData.descripcion || null,
      };

      if (editingId) {
        await api.put(`/gestiones/${editingId}`, payload);
        setSuccess("Gestión actualizada exitosamente");
      } else {
        await api.post("/gestiones", payload);
        setSuccess("Gestión creada exitosamente");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar la gestión");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: "",
      materias: [
        {
          semestre: 7,
          materia: "Metodología de Investigación I",
          codigo_materia: "",
        },
      ],
      descripcion: "",
    });
  };

  const handleEdit = (gestion: Gestion) => {
    setEditingId(gestion.id);
    setFormData({
      nombre: gestion.nombre,
      materias: gestion.materias.map((m) => ({
        semestre: m.semestre,
        materia: m.materia,
        codigo_materia: m.codigo_materia || "",
      })),
      descripcion: gestion.descripcion || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('¿Seguro que deseas cerrar/eliminar esta gestión?')
    if (!confirmDelete) return

    try {
      await api.delete(`/gestiones/${id}`)
      setSuccess('Gestión cerrada/eliminada correctamente')
      await loadData()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cerrar la gestión')
    }
  }

  const handleAddMateria = () => {
    setFormData((prev) => ({
      ...prev,
      materias: [
        ...prev.materias,
        {
          semestre: 7,
          materia: "Metodología de Investigación I",
          codigo_materia: "",
        },
      ],
    }));
  };

  const handleRemoveMateria = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      materias: prev.materias.filter((_, i) => i !== idx),
    }));
  };

  const getFilteredGestiones = () => {
    return gestiones.filter((g) => {
      if (
        filterSemestre !== "" &&
        !g.materias.some((m) => m.semestre === filterSemestre)
      )
        return false;
      if (filterEstado && g.estado !== filterEstado) return false;
      return true;
    });
  };

  const getSemestreLabel = (semestre: number) => {
    const semester = SEMESTERS.find((s) => s.value === semestre);
    return semester?.label || `Semestre ${semestre}`;
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      activa: "badge-success",
      inactiva: "badge-warning",
    };
    return badges[estado] || "badge-info";
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      activa: "Activa",
      inactiva: "Inactiva",
    };
    return labels[estado] || estado;
  };

  const filteredGestiones = getFilteredGestiones();

  if (loading) {
    return (
      <div className="gestion-gestiones-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="gestion-gestiones-container">
      <div className="page-header">
        <h1>Gestión de Materias</h1>
        <p className="subtitle">
          Configura las materias y semestres para el sistema
        </p>
      </div>

      {/* Mensajes de estado */}
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

      {/* Botón para crear nueva gestión */}
      {!showForm && (
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            ➕ Nueva Gestión
          </button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="form-section card">
          <div className="form-header">
            <h2>{editingId ? "Editar Gestión" : "Crear Nueva Gestión"}</h2>
            <button
              type="button"
              className="close-btn"
              onClick={resetForm}
              aria-label="Cerrar formulario"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="gestion-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre Personalizado <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Gestión de Proyectos 2025-I"
                  required
                />
              </div>
            </div>

            {/* Materias dinámicas */}
            <div className="materias-section">
              <label>
                Materias y Semestres <span className="required">*</span>
              </label>
              {formData.materias.map((mat, idx) => (
                <div className="form-row materias-row" key={idx}>
                  <div className="form-group">
                    <label>Semestre</label>
                    <select
                      name="semestre"
                      value={mat.semestre}
                      onChange={(e) => handleMateriaChange(idx, e)}
                      required
                    >
                      {SEMESTERS.map((sem) => (
                        <option key={sem.value} value={sem.value}>
                          {sem.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Materia</label>
                    <input
                      type="text"
                      name="materia"
                      value={mat.materia}
                      disabled
                      placeholder="Se asigna automáticamente según el semestre"
                    />
                  </div>
                  <div className="form-group">
                    <label>Código de Materia</label>
                    <input
                      type="text"
                      name="codigo_materia"
                      value={mat.codigo_materia}
                      onChange={(e) => handleMateriaChange(idx, e)}
                      placeholder="Ej: MET-101"
                    />
                  </div>
                  {formData.materias.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveMateria(idx)}
                      style={{ marginTop: 28 }}
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddMateria}
                style={{ marginTop: 8 }}
              >
                + Agregar Materia
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción adicional de la gestión (opcional)"
                rows={4}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? "Actualizar" : "Crear"} Gestión
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

      {/* Filtros */}
      {!showForm && gestiones.length > 0 && (
        <div className="filters-section card">
          <div className="filters-header">
            <h3>Filtros</h3>
          </div>
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="filter-semestre">Filtrar por Semestre:</label>
              <select
                id="filter-semestre"
                value={filterSemestre}
                onChange={(e) => setFilterSemestre(e.target.value === "" ? "" : parseInt(e.target.value))}
              >
                <option value="">Todos los semestres</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem.value} value={sem.value}>
                    {sem.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-estado">Filtrar por Estado:</label>
              <select
                id="filter-estado"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setFilterSemestre("");
                setFilterEstado("");
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de gestiones */}
      <div className="gestiones-list">
        {filteredGestiones.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📋</div>
            <h3>No hay gestiones</h3>
            <p>
              {gestiones.length === 0
                ? "Crea la primera gestión para comenzar"
                : "No se encontraron gestiones con los filtros seleccionados"}
            </p>
            {gestiones.length === 0 && !showForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Crear Primera Gestión
              </button>
            )}
          </div>
        ) : (
          <div className="gestiones-grid">
            {filteredGestiones.map((gestion) => (
              <div key={gestion.id} className="gestion-card card">
                <div className="card-header">
                  <div>
                    <h3 className="gestion-nombre">{gestion.nombre}</h3>
                    {/* Mostrar todas las materias/semestres */}
                    <ul className="gestion-semestres-list">
                      {(Array.isArray(gestion.materias) ? gestion.materias : []).map((mat, idx) => (
                        <li key={idx} className="gestion-semestre">
                          {getSemestreLabel(mat.semestre)}
                        </li>
                      ))}
                      {/* Si no hay materias, muestra advertencia */}
                      {!Array.isArray(gestion.materias) && (
                        <li className="gestion-semestre" style={{color: "red"}}>
                          Error: gestión sin materias
                        </li>
                      )}
                    </ul>
                  </div>
                  <span className={`badge ${getEstadoBadge(gestion.estado)}`}>
                    {getEstadoLabel(gestion.estado)}
                  </span>
                </div>

                <div className="card-body">
                  {(Array.isArray(gestion.materias) ? gestion.materias : []).map((mat, idx) => (
                    <div key={idx} className="gestion-detail-materia">
                      <div className="gestion-detail">
                        <span className="label">Materia:</span>
                        <span className="value">{mat.materia}</span>
                      </div>
                      {mat.codigo_materia && (
                        <div className="gestion-detail">
                          <span className="label">Código:</span>
                          <span className="value">{mat.codigo_materia}</span>
                        </div>
                      )}
                      <div className="gestion-detail">
                        <span className="label">Semestre:</span>
                        <span className="value">{getSemestreLabel(mat.semestre)}</span>
                      </div>
                      <hr />
                    </div>
                  ))}
                  {/* Si no hay materias, muestra advertencia */}
                  {!Array.isArray(gestion.materias) && (
                    <div className="gestion-detail-materia" style={{color: "red"}}>
                      Error: gestión sin materias
                    </div>
                  )}

                  {gestion.descripcion && (
                    <div className="gestion-detail full">
                      <span className="label">Descripción:</span>
                      <span className="value">{gestion.descripcion}</span>
                    </div>
                  )}

                  <div className="gestion-detail">
                    <span className="label">Creado:</span>
                    <span className="value">
                      {new Date(gestion.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                <div className="card-footer">
                  {gestion.estado === 'activa' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => navigate(`/gestion/${gestion.id}`)}
                    >
                      ➜ Entrar
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleEdit(gestion)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(gestion.id)}
                  >
                    🗑️ Cerrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info adicional */}
      <div className="info-section card">
        <h3>📌 Información Importante</h3>
        <ul>
          <li>
            <strong>Materias Disponibles:</strong>
            <ul>
              <li>7mo Semestre: Metodología de Investigación I</li>
              <li>8vo Semestre: Metodología de Investigación II</li>
              <li>9no Semestre: Taller de Grado I</li>
              <li>10mo Semestre: Taller de Grado II</li>
            </ul>
          </li>
          <li>
            <strong>Estados de Gestión:</strong> Activa (en uso), Inactiva
            (temporalmente deshabilitada), Cerrada (histórica/no editable)
          </li>
          <li>
            El <strong>nombre personalizado</strong> permite identificar
            gestiones por año y semestre (ej: Gestión 2025-I)
          </li>
        </ul>
      </div>
    </div>
  );
}
