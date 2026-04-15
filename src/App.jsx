import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar          from './components/Navbar'
import Home            from './pages/Home'
import Producto        from './pages/Producto'
import Pedido          from './pages/Pedido'
import EstadoPedido    from './pages/EstadoPedido'
import Admin           from './pages/Admin'
import Login           from './pages/Login'
import Signup          from './pages/Signup'
import ComentarioForm  from './components/ComentarioForm'

// Middleware de protección de ruta
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('lenos_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/productos/:id"      element={<Producto />} />
        <Route path="/pedido/:id"         element={<Pedido />} />
        <Route path="/estado/:id"         element={<EstadoPedido />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/signup"             element={<Signup />} />
        <Route path="/admin"              element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/comentarios"        element={<ComentarioForm />} />
      </Routes>
    </BrowserRouter>
  )
}
