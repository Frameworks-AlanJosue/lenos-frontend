import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// ── Productos ──────────────────────────────────────────────────────────────
export const getProductos = (params) => api.get('/productos', { params })
export const getProducto  = (id)     => api.get(`/productos/${id}`)

// ── Pedidos ────────────────────────────────────────────────────────────────
export const crearPedido  = (data)   => api.post('/pedidos', data)
export const getPedido    = (id)     => api.get(`/pedidos/${id}`)
export const getPedidos   = (params) => api.get('/pedidos', { params })
export const cambiarEstado = (id, data) => api.patch(`/pedidos/${id}/estado`, data)

// ── Inventario ─────────────────────────────────────────────────────────────
export const getInventario = () => api.get('/inventario/resumen')
export const ajustarStock  = (data) => api.post('/inventario/ajuste', data)

// ── Usuarios ───────────────────────────────────────────────────────────────
export const getUsuarios   = (params) => api.get('/usuarios', { params })

export default api
