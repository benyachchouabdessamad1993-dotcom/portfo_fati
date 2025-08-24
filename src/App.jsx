import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PortfolioProvider } from './contexts/PortfolioContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import ProfileEditor from './pages/admin/ProfileEditor'
import SectionsEditor from './pages/admin/SectionsEditor'
import CoursesEditor from './pages/admin/CoursesEditor'
import ProjectsEditor from './pages/admin/ProjectsEditor'
import ResponsibilitiesEditor from './pages/admin/ResponsibilitiesEditor'
import CompetencesEditor from './pages/admin/CompetencesEditor'
import ResearchEditor from './pages/admin/ResearchEditor'
import PublicationsEditor from './components/admin/PublicationsEditor'
import ThesesEditor from './components/admin/ThesesEditor'
import LanguagesEditor from './pages/admin/LanguagesEditor'
import SectionsManager from './pages/admin/SectionsManager'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Éviter les erreurs de hydratation
    if (typeof window !== 'undefined') {
      // Code côté client uniquement
    }
  }, [])
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>
          
          {/* Route de connexion */}
          <Route path="/login" element={<Login />} />
          
          {/* Routes admin protégées */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="research" element={<ResearchEditor />} />
            <Route path="competences" element={<CompetencesEditor />} />
            <Route path="publications" element={<PublicationsEditor />} />
            <Route path="theses" element={<ThesesEditor />} />
            <Route path="sections" element={<SectionsEditor />} />
            <Route path="courses" element={<CoursesEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="responsibilities" element={<ResponsibilitiesEditor />} />
            <Route path="languages" element={<LanguagesEditor />} />
            <Route path="sections-manager" element={<SectionsManager />} />
          </Route>
        </Routes>
      </PortfolioProvider>
    </AuthProvider>
  )
}

export default App