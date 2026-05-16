import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TOKEN_KEY } from './api/client'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Templates from './pages/Templates'
import TemplateForm from './pages/TemplateForm'
import Instances from './pages/Instances'
import Orders from './pages/Orders'
import Testimonials from './pages/Testimonials'
import Promos from './pages/Promos'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/templates/new" element={<ProtectedRoute><TemplateForm /></ProtectedRoute>} />
        <Route path="/templates/:id/edit" element={<ProtectedRoute><TemplateForm /></ProtectedRoute>} />
        <Route path="/instances" element={<ProtectedRoute><Instances /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
        <Route path="/promos" element={<ProtectedRoute><Promos /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
