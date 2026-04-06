import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducto } from '../api'
import './Producto.css'

const SABOR_EMOJI = { Chocolate: '🍫', Nuez: '🥜', Cajeta: '🍯', Mixto: '✨' }
const PLACEHOLDER = (sabor) =>
  `https://placehold.co/800x500/C8923A/FAF4E8?text=${encodeURIComponent(sabor)}&font=playfair-display`

export default function Producto() {
  const { id } = useParams()
  const nav    = useNavigate()
  const [producto,  setProducto]  = useState(null)
  const [cantidad,  setCantidad]  = useState(1)
  const [tipoPedido, setTipoPedido] = useState('mismo_dia')
  const [cargando,  setCargando]  = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    getProducto(id)
      .then(r => setProducto(r.data.producto))
      .catch(() => setError('Producto no encontrado.'))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return <div className="page-center"><div className="spinner" /></div>
  if (error)    return <div className="page-center empty-state"><span>😕</span><p>{error}</p></div>

  const imagen = producto.imagenes?.[0]?.url || PLACEHOLDER(producto.sabor)
  const disponible = producto.disponible && producto.stock > 0

  const handlePedir = () => {
    nav(`/pedido/${producto._id}`, { state: { producto, cantidad, tipoPedido } })
  }

  return (
    <div className="detalle">
      <button className="detalle__back" onClick={() => nav(-1)}>← Volver</button>

      <div className="detalle__wrap container">
        {/* Imagen */}
        <div className="detalle__img-col fade-in">
          <img src={imagen} alt={producto.nombre} className="detalle__img" />
          {!disponible && (
            <div className="detalle__agotado">
              <span>Sin stock hoy</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detalle__info fade-up">
          <span className="section-eyebrow">
            {SABOR_EMOJI[producto.sabor]} {producto.sabor}
          </span>
          <h1 className="detalle__nombre">{producto.nombre}</h1>
          <p className="detalle__desc">{producto.descripcion}</p>

          <div className="detalle__precio-row">
            <span className="detalle__precio">${producto.precio.toFixed(2)}</span>
            <span className={`badge ${disponible ? 'badge-verde' : 'badge-rojo'}`}>
              {disponible ? `${producto.stock} disponibles` : 'Agotado'}
            </span>
          </div>

          {/* Tipo de pedido */}
          <div className="detalle__tipo">
            <p className="detalle__label">¿Cuándo lo quieres?</p>
            <div className="detalle__tipo-btns">
              {[
                { v: 'mismo_dia', emoji: '⚡', label: 'Hoy mismo' },
                { v: 'pre_pedido', emoji: '📅', label: 'Fecha futura' },
              ].map(t => (
                <button
                  key={t.v}
                  className={`detalle__tipo-btn ${tipoPedido === t.v ? 'activo' : ''}`}
                  onClick={() => setTipoPedido(t.v)}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div className="detalle__cantidad">
            <p className="detalle__label">Cantidad</p>
            <div className="detalle__cant-ctrl">
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>−</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(c => Math.min(producto.stock || 99, c + 1))}>+</button>
            </div>
          </div>

          {/* Total */}
          <div className="detalle__total">
            <span>Total estimado</span>
            <span className="detalle__total-num">${(producto.precio * cantidad).toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary detalle__cta"
            disabled={!disponible && tipoPedido === 'mismo_dia'}
            onClick={handlePedir}
          >
            {disponible || tipoPedido === 'pre_pedido'
              ? '🛒 Hacer mi pedido'
              : 'Sin disponibilidad hoy'}
          </button>

          {tipoPedido === 'pre_pedido' && (
            <p className="detalle__nota">
              📅 El stock se reserva cuando el administrador confirme tu pedido.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
