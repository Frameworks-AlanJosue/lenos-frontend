import { useState, useEffect } from 'react'
import { getPedidos, cambiarEstado, getInventario, getUsuarios, ajustarStock } from '../api'
import './Admin.css'

const ESTADOS_FLUJO = ['pendiente', 'confirmado', 'en_entrega', 'entregado']
const ESTADO_LABELS = {
  pendiente:  { label: 'Pendiente',  color: '#FFF3CD', text: '#856404' },
  confirmado: { label: 'Confirmado', color: '#D4EDDA', text: '#155724' },
  en_entrega: { label: 'En camino',  color: '#D1ECF1', text: '#0C5460' },
  entregado:  { label: 'Entregado',  color: '#D4EDDA', text: '#155724' },
  cancelado:  { label: 'Cancelado',  color: '#F8D7DA', text: '#721C24' },
}

export default function Admin() {
  const [tab,        setTab]        = useState('pedidos')
  const [pedidos,    setPedidos]    = useState([])
  const [filtroEst,  setFiltroEst]  = useState('')
  const [pedidoSel,  setPedidoSel]  = useState(null)
  const [inventario, setInventario] = useState([])
  const [usuarios,   setUsuarios]   = useState([])
  const [cargando,   setCargando]   = useState(false)

  // Ajuste stock modal
  const [ajusteModal, setAjusteModal] = useState(null)
  const [ajusteForm,  setAjusteForm]  = useState({ cantidad: '', motivo: '' })
  const [ajusteMsg,   setAjusteMsg]   = useState('')

  const cargarPedidos = async () => {
    setCargando(true)
    const params = filtroEst ? { estado: filtroEst } : {}
    const r = await getPedidos(params)
    setPedidos(r.data.pedidos)
    setCargando(false)
  }

  const cargarInventario = async () => {
    const r = await getInventario()
    setInventario(r.data.productos)
  }

  const cargarUsuarios = async () => {
    const r = await getUsuarios({ rol: 'repartidor' })
    setUsuarios(r.data.usuarios)
  }

  useEffect(() => { cargarPedidos() }, [filtroEst])
  useEffect(() => {
    if (tab === 'inventario') cargarInventario()
    if (tab === 'pedidos')    cargarUsuarios()
  }, [tab])

  const handleCambiarEstado = async (pedidoId, nuevoEstado, repartidorId) => {
    await cambiarEstado(pedidoId, { estado: nuevoEstado, ...(repartidorId && { repartidorId }) })
    cargarPedidos()
    setPedidoSel(null)
  }

  const handleAjuste = async () => {
    if (!ajusteForm.cantidad || !ajusteForm.motivo) {
      setAjusteMsg('Completa cantidad y motivo.')
      return
    }
    try {
      await ajustarStock({
        productoId: ajusteModal._id,
        cantidad: Number(ajusteForm.cantidad),
        motivo: ajusteForm.motivo,
      })
      setAjusteModal(null)
      setAjusteForm({ cantidad: '', motivo: '' })
      setAjusteMsg('')
      cargarInventario()
    } catch (e) {
      setAjusteMsg(e.response?.data?.mensaje || 'Error al ajustar.')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header__inner">
          <h1 className="admin-header__titulo">Panel Administrativo</h1>
          <p className="admin-header__sub">🍞 Leños Rellenos</p>
        </div>
      </div>

      <div className="container admin-body">
        {/* Tabs */}
        <div className="admin-tabs">
          {[
            { k: 'pedidos',    label: '📋 Pedidos' },
            { k: 'inventario', label: '📦 Inventario' },
          ].map(t => (
            <button key={t.k} className={`admin-tab ${tab === t.k ? 'activo' : ''}`}
              onClick={() => setTab(t.k)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB PEDIDOS ────────────────────────────────────────────────── */}
        {tab === 'pedidos' && (
          <div className="admin-section fade-in">
            {/* Filtros */}
            <div className="admin-filtros">
              {['', 'pendiente', 'confirmado', 'en_entrega', 'entregado'].map(e => (
                <button key={e} className={`sabor-tag ${filtroEst === e ? 'activo' : ''}`}
                  onClick={() => setFiltroEst(e)}>
                  {e === '' ? 'Todos' : ESTADO_LABELS[e]?.label}
                </button>
              ))}
              <button className="btn btn-secondary admin-refresh" onClick={cargarPedidos}>🔄</button>
            </div>

            {cargando ? <div className="spinner" /> : (
              <div className="admin-pedidos-grid">
                {pedidos.length === 0 ? (
                  <div className="empty-state"><span>📋</span><p>No hay pedidos con este filtro.</p></div>
                ) : pedidos.map(p => {
                  const st = ESTADO_LABELS[p.estado] || {}
                  return (
                    <div key={p._id} className="pedido-card" onClick={() => setPedidoSel(p)}>
                      <div className="pedido-card__head">
                        <span className="pedido-card__id">#{p._id.slice(-6).toUpperCase()}</span>
                        <span className="pedido-card__badge"
                          style={{ background: st.color, color: st.text }}>
                          {st.label}
                        </span>
                      </div>
                      <p className="pedido-card__cliente">{p.cliente.nombre}</p>
                      <p className="pedido-card__dir">{p.cliente.direccion}</p>
                      <div className="pedido-card__meta">
                        <span>{p.tipoPedido === 'mismo_dia' ? '⚡ Hoy' : '📅 Pre-pedido'}</span>
                        <span className="pedido-card__total">${p.total?.toFixed(2)}</span>
                      </div>
                      <p className="pedido-card__fecha">
                        {new Date(p.createdAt).toLocaleString('es-MX')}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB INVENTARIO ─────────────────────────────────────────────── */}
        {tab === 'inventario' && (
          <div className="admin-section fade-in">
            <table className="inv-tabla">
              <thead>
                <tr>
                  <th>Producto</th><th>Sabor</th><th>Stock</th><th>Estado</th><th>Ajustar</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map(p => (
                  <tr key={p._id}>
                    <td className="inv-nombre">{p.nombre}</td>
                    <td>{p.sabor}</td>
                    <td>
                      <span className={`inv-stock ${p.stock <= 3 ? 'bajo' : ''}`}>{p.stock}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.disponible ? 'badge-verde' : 'badge-rojo'}`}>
                        {p.disponible ? 'Disponible' : 'Agotado'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary inv-btn"
                        onClick={() => { setAjusteModal(p); setAjusteMsg('') }}>
                        Ajustar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DETALLE PEDIDO ────────────────────────────────────────────── */}
      {pedidoSel && (
        <div className="modal-overlay" onClick={() => setPedidoSel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__head">
              <h2 className="modal__titulo">Pedido #{pedidoSel._id.slice(-8).toUpperCase()}</h2>
              <button className="modal__close" onClick={() => setPedidoSel(null)}>✕</button>
            </div>

            <div className="modal__body">
              <div className="modal__seccion">
                <p><strong>Cliente:</strong> {pedidoSel.cliente.nombre}</p>
                <p><strong>Teléfono:</strong> {pedidoSel.cliente.telefono}</p>
                <p><strong>Dirección:</strong> {pedidoSel.cliente.direccion}</p>
                <p><strong>Tipo:</strong> {pedidoSel.tipoPedido === 'mismo_dia' ? '⚡ Mismo día' : '📅 Pre-pedido'}</p>
                {pedidoSel.notas && <p><strong>Notas:</strong> {pedidoSel.notas}</p>}
              </div>

              <table className="modal__tabla">
                <thead>
                  <tr><th>Producto</th><th>Sabor</th><th>Cant.</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  {pedidoSel.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.nombre}</td>
                      <td>{item.sabor}</td>
                      <td>{item.cantidad}</td>
                      <td>${(item.precioUnitario * item.cantidad).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}><strong>Total</strong></td>
                    <td><strong>${pedidoSel.total?.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>

              {/* Acciones según estado */}
              {pedidoSel.estado === 'pendiente' && (
                <div className="modal__acciones">
                  <p className="modal__label">Asignar repartidor y confirmar:</p>
                  <select className="modal__select" id="rep-select">
                    <option value="">Sin asignar</option>
                    {usuarios.map(u => <option key={u._id} value={u._id}>{u.nombre}</option>)}
                  </select>
                  <button className="btn btn-primary" onClick={() => {
                    const repId = document.getElementById('rep-select').value
                    handleCambiarEstado(pedidoSel._id, 'confirmado', repId || undefined)
                  }}>✅ Confirmar pedido</button>
                  <button className="btn btn-secondary" onClick={() =>
                    handleCambiarEstado(pedidoSel._id, 'cancelado')}>
                    ❌ Cancelar
                  </button>
                </div>
              )}

              {pedidoSel.estado === 'confirmado' && (
                <div className="modal__acciones">
                  <button className="btn btn-primary" onClick={() =>
                    handleCambiarEstado(pedidoSel._id, 'en_entrega')}>
                    🛵 Marcar en camino
                  </button>
                </div>
              )}

              {pedidoSel.estado === 'en_entrega' && (
                <div className="modal__acciones">
                  <button className="btn btn-primary" onClick={() =>
                    handleCambiarEstado(pedidoSel._id, 'entregado')}>
                    🎉 Confirmar entrega
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AJUSTE STOCK ──────────────────────────────────────────────── */}
      {ajusteModal && (
        <div className="modal-overlay" onClick={() => setAjusteModal(null)}>
          <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
            <div className="modal__head">
              <h2 className="modal__titulo">Ajustar Stock</h2>
              <button className="modal__close" onClick={() => setAjusteModal(null)}>✕</button>
            </div>
            <div className="modal__body">
              <p style={{ marginBottom: 16 }}>
                <strong>{ajusteModal.nombre}</strong> — Stock actual: <strong>{ajusteModal.stock}</strong>
              </p>
              <div className="form-group">
                <label>Cantidad (positivo = entrada, negativo = salida)</label>
                <input type="number" placeholder="Ej: 10 ó -3" value={ajusteForm.cantidad}
                  onChange={e => setAjusteForm({ ...ajusteForm, cantidad: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Motivo</label>
                <input placeholder="Ej: Reposición, Merma..." value={ajusteForm.motivo}
                  onChange={e => setAjusteForm({ ...ajusteForm, motivo: e.target.value })} />
              </div>
              {ajusteMsg && <div className="form-error">{ajusteMsg}</div>}
              <div className="modal__acciones">
                <button className="btn btn-primary" onClick={handleAjuste}>Guardar ajuste</button>
                <button className="btn btn-secondary" onClick={() => setAjusteModal(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
