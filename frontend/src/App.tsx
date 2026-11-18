import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Proyectos from './pages/Proyectos'
import NuevoProyecto from './pages/NuevoProyecto'
import ProyectoDetail from './pages/ProyectoDetail'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios'
import Lineamientos from './pages/Lineamientos'
import GestionEtapas from './pages/GestionEtapas'
import GestionGestiones from './pages/GestionGestiones'
import GestionDetail from './pages/GestionDetail'
import MateriaDetail from './pages/MateriaDetail'
import EtapaDetail from './pages/EtapaDetail'
import ProyectoEtapaDetail from './pages/ProyectoEtapaDetail'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/ToastContainer'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos"
          element={
            <ProtectedRoute>
              <Layout>
                <Proyectos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/nuevo"
          element={
            <ProtectedRoute roles={['administrador']}>
              <Layout>
                <NuevoProyecto />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProyectoDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Layout>
                <Reportes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lineamientos"
          element={
            <ProtectedRoute>
              <Layout>
                <Lineamientos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Layout>
                <Usuarios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/etapas"
          element={
            <ProtectedRoute roles={['administrador']}>
              <Layout>
                <GestionEtapas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestiones"
          element={
            <ProtectedRoute roles={['administrador']}>
              <Layout>
                <GestionGestiones />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/:gestionId"
          element={
            <ProtectedRoute>
              <Layout>
                <GestionDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/:gestionId/materia/:materiaId"
          element={
            <ProtectedRoute>
              <Layout>
                <MateriaDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/:gestionId/materia/:materiaId/etapa/:etapaId"
          element={
            <ProtectedRoute>
              <Layout>
                <EtapaDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:proyectoId/etapas/:etapaId"
          element={
            <ProtectedRoute roles={['tutor','revisor','administrador']}>
              <Layout>
                <ProyectoEtapaDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

