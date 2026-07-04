import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ToastContainer from './components/ui/Toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CategoryIndex from './pages/Categories/Index'
import CreateCategory from './pages/Categories/Create'
import EditCategory from './pages/Categories/Edit'
import TaskIndex from './pages/Tasks/Index'
import CreateTask from './pages/Tasks/Create'
import EditTask from './pages/Tasks/Edit'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()
  if (loading) return null
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()
  if (loading) return null
  return token ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          <Routes>
          <Route
            path="/login"
            element={<PublicRoute><Login /></PublicRoute>}
          />
          <Route
            path="/register"
            element={<PublicRoute><Register /></PublicRoute>}
          />
          <Route
            path="/"
            element={<PrivateRoute><Layout /></PrivateRoute>}
          >
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<CategoryIndex />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/:id/edit" element={<EditCategory />} />
            <Route path="tasks" element={<TaskIndex />} />
            <Route path="tasks/create" element={<CreateTask />} />
            <Route path="tasks/:id/edit" element={<EditTask />} />
          </Route>
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
