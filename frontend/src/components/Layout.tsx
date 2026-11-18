import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, checkAuth } = useAuthStore()
  const { info } = useToastStore()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = () => {
    logout()
    info('Sesión cerrada correctamente')
    navigate('/login')
  }

  const getRoleLabel = (rol: string, esTutor?: boolean, esRevisor?: boolean) => {
    if (esTutor && esRevisor) return 'Tutor y Revisor'
    const labels: Record<string, string> = {
      estudiante: 'Estudiante',
      tutor: 'Tutor',
      revisor: 'Revisor',
      administrador: 'Administrador',
    }
    return labels[rol] || rol
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <img src="/branding/logo3.png" alt="Logo institucional" className="logo-img" />
              <h1>Proyectos de Grado</h1>
            </Link>
            <nav className="nav">
              <Link to="/">Panel Principal</Link>
              <Link to="/proyectos">Proyectos</Link>
              <Link to="/reportes">Reportes</Link>
              <Link to="/lineamientos">Lineamientos</Link>
              {user?.rol === 'administrador' && (
                <>
                  <Link to="/usuarios">Usuarios</Link>
                  <Link to="/gestiones">Gestiones</Link>
                  <Link to="/etapas">Etapas</Link>
                </>
              )}
            </nav>
            <div className="user-menu">
              <span className="user-info">
                <strong>{user?.nombre} {user?.apellidos}</strong>
                <span className="user-role">{getRoleLabel(user?.rol || '', user?.es_tutor, user?.es_revisor)}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

