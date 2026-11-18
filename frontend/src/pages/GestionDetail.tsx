import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./GestionDetail.css";

interface Materia {
  id: string;
  semestre: number;
  materia: string;
  codigo_materia?: string;
}

interface Gestion {
  id: string;
  nombre: string;
  estado: string;
  descripcion?: string;
  materias: Materia[];
  created_at: string;
}

export default function GestionDetail() {
  const { gestionId } = useParams<{ gestionId: string }>();
  const navigate = useNavigate();
  const [gestion, setGestion] = useState<Gestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGestion();
  }, [gestionId]);

  const loadGestion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/gestiones/${gestionId}`);
      setGestion(res.data.gestion);
    } catch (err: any) {
      console.error("Error loading gestion:", err);
      setError("Error al cargar la gestión");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="gestion-detail-container"><div className="loading">Cargando...</div></div>;
  }

  if (!gestion) {
    return (
      <div className="gestion-detail-container">
        <div className="error-state">
          <p>{error || "Gestión no encontrada"}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-detail-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>
        <h1>{gestion.nombre}</h1>
        <span className={`badge ${gestion.estado === 'activa' ? 'badge-success' : 'badge-warning'}`}>
          {gestion.estado === 'activa' ? 'ACTIVA' : 'CERRADA'}
        </span>
      </div>

      {gestion.descripcion && (
        <div className="gestion-info card">
          <p><strong>Descripción:</strong> {gestion.descripcion}</p>
        </div>
      )}

      <div className="materias-section">
        <h2>📚 Materias en esta Gestión</h2>
        {gestion.materias && gestion.materias.length > 0 ? (
          <div className="materias-grid">
            {gestion.materias.map((materia) => (
              <div key={materia.id} className="materia-card card">
                <div className="card-header">
                  <h3>{materia.materia}</h3>
                  <span className="semestre-badge">Semestre {materia.semestre}</span>
                </div>
                <div className="card-body">
                  {materia.codigo_materia && (
                    <p><strong>Código:</strong> {materia.codigo_materia}</p>
                  )}
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/gestion/${gestionId}/materia/${materia.id}`)}
                  >
                    → Entrar a la Materia
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <p>No hay materias asignadas a esta gestión</p>
          </div>
        )}
      </div>
    </div>
  );
}
