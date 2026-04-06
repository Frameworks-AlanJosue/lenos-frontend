import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPedido } from '../api'
import './EstadoPedido.css'

const ESTADOS = [
  { key: 'pendiente',   label: 'Pendiente',   emoji: '⏳', desc: 'Tu pedido fue recibido y está en espera de confirmación.' },
  { key: 'confirmado',  label: 'Confirmado',  emoji: '✅', desc: '¡El administrador confirmó tu pedido!' },
  { key: 'en_entrega',  label: 'En camino',   emoji: '🛵', desc: 'Tu repartidor está en camino con tu leño relleno.' },
  { key: 'entregado',   label: '¡Entregado!', emoji: '🎉', desc: '¡Buen provecho! Gracias por tu preferencia.' },
]

export default function EstadoPedido() {
  const { id } = useParams()
  const nav    = useNavigate()
  const [pedido,   setPedido]   = useState(null)
  const [cargando, setCargando] = useState(true)

  const fetchPedido = () => {
    getPedido(id)
      .then(r => setPedido(r.data.pedido))
      .catch(console.error)
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    fetchPedido()
    const interval = setInterval(fetchPedido, 15000) // refresca cada 15s
    return () => clearInterval(interval)
  }, [id])

  if (cargando) return <div className="page-center"><div className="spinner" /></div>
  if (!pedido)  return <div className="page-center empty-state"><span>😕</span><p>Pedido no encontrado.</p></div>

  const idxActual = ESTADOS.findIndex(e => e.key === pedido.estado)
  const estadoActual = ESTADOS[idxActual] || ESTADOS[0]
  const esCancelado = pedido.estado === 'cancelado'

  return (
    <div className="estado-page">
      <div className="container estado-wrap">
        <h1 className="estado-titulo fade-up">Estado de tu Pedido</h1>
        <p className="estado-id fade-up">Pedido #{pedido._id.slice(-8).toUpperCase()}</p>

        {/* Barra de progreso */}
        {!esCancelado && (
          <div className="progreso fade-up" style={{ animationDelay: '100ms' }}>
            {ESTADOS.map((e, i) => {
              const pasado  = i < idxActual
              const activo  = i === idxActual
              return (
                <div key={e.key} className="progreso__item">
                  <div className={`progreso__dot ${pasado ? 'pasado' : ''} ${activo ? 'activo' : ''}`}>
                    {pasado ? '✓' : e.emoji}
                  </div>
                  <span className={`progreso__label ${activo ? 'activo' : ''}`}>{e.label}</span>
                  {i < ESTADOS.length - 1 && (
                    <div className={`progreso__linea ${pasado ? 'pasado' : ''}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Tarjeta de estado */}
        <div className={`estado-card fade-up ${esCancelado ? 'estado-card--cancelado' : ''}`}
          style={{ animationDelay: '200ms' }}>
          <div className="estado-card__emoji">{esCancelado ? '❌' : estadoActual.emoji}</div>
          <h2 className="estado-card__titulo">{esCancelado ? 'Pedido Cancelado' : estadoActual.label}</h2>
          <p className="estado-card__desc">
            {esCancelado ? 'Tu pedido fue cancelado. Contáctanos para más información.' : estadoActual.desc}
          </p>
          {pedido.repartidor && (
            <div className="estado-card__repartidor">
              🛵 Repartidor: <strong>{pedido.repartidor.nombre}</strong> — {pedido.repartidor.telefono}
            </div>
          )}
        </div>

        {/* Detalle del pedido */}
        <div className="estado-detalle fade-up" style={{ animationDelay: '300ms' }}>
          <h3 className="estado-detalle__titulo">Detalle de tu pedido</h3>

          <div className="estado-detalle__cliente">
            <div><span>👤</span> {pedido.cliente.nombre}</div>
            <div><span>📍</span> {pedido.cliente.direccion}</div>
            <div><span>📱</span> {pedido.cliente.telefono}</div>
            <div><span>📦</span>
              {pedido.tipoPedido === 'mismo_dia' ? 'Entrega el mismo día' : `Pre-pedido${pedido.fechaEntregaSolicitada ? ' para ' + new Date(pedido.fechaEntregaSolicitada).toLocaleDateString('es-MX') : ''}`}
            </div>
          </div>

          <table className="estado-detalle__tabla">
            <thead>
              <tr><th>Producto</th><th>Sabor</th><th>Cant.</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {pedido.items.map((item, i) => (
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
                <td><strong>${pedido.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="estado-acciones fade-up" style={{ animationDelay: '400ms' }}>
          <button className="btn btn-secondary" onClick={fetchPedido}>🔄 Actualizar</button>
          <button className="btn btn-primary"   onClick={() => nav('/')}>← Volver al inicio</button>
        </div>

        <p className="estado-nota">Se actualiza automáticamente cada 15 segundos.</p>
      </div>
    </div>
  )
}
