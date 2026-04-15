import axios from 'axios'

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api' 
})

// ── Interceptor para el Token JWT y API Key ──────────────────────────────────
api.interceptors.request.use((config) => {
  // Inyectar Token JWT
  const token = localStorage.getItem('lenos_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Inyectar API Key para seguridad en producción
  const apiKey = import.meta.env.VITE_API_KEY
  if (apiKey) {
    config.headers['x-api-key'] = apiKey
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// ── Autenticación ────────────────────────────────────────────────────────────
export const signup = (data) => api.post('/v1/usuario/signup', data)
export const login  = (data) => api.post('/v1/usuario/login',  data)

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
