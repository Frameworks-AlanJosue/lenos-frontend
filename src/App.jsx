import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar       from './components/Navbar'
import Home         from './pages/Home'
import Producto     from './pages/Producto'
import Pedido       from './pages/Pedido'
import EstadoPedido from './pages/EstadoPedido'
import Admin        from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/productos/:id"      element={<Producto />} />
        <Route path="/pedido/:id"         element={<Pedido />} />
        <Route path="/estado/:id"         element={<EstadoPedido />} />
        <Route path="/admin"              element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
