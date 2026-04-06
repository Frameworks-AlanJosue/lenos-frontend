import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { crearPedido } from '../api'
import './Pedido.css'

export default function Pedido() {
  const { id }      = useParams()
  const location    = useLocation()
  const nav         = useNavigate()
  const state       = location.state || {}
  const { producto, cantidad = 1, tipoPedido = 'mismo_dia' } = state

  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', notas: '' })
  const [fecha, setFecha]     = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errMsg,  setErrMsg]  = useState('')

  if (!producto) {
    return (
      <div className="page-center empty-state">
        <span>😕</span>
        <p>Vuelve al catálogo y selecciona un producto.</p>
        <button className="btn btn-primary" onClick={() => nav('/')} style={{ marginTop: 16 }}>
          Ir al catálogo
        </button>
      </div>
    )
  }

  const hoy = new Date()
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1)
  const fechaMin = manana.toISOString().split('T')[0]

  const total = producto.precio * cantidad

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono || !form.direccion) {
      setErrMsg('Por favor completa nombre, teléfono y dirección.')
      return
    }
    if (tipoPedido === 'pre_pedido' && !fecha) {
      setErrMsg('Selecciona una fecha de entrega.')
      return
    }
    setErrMsg('')
    setEnviando(true)
    try {
      const payload = {
        cliente: { nombre: form.nombre, telefono: form.telefono, direccion: form.direccion },
        items: [{ productoId: id, cantidad }],
        tipoPedido,
        notas: form.notas,
        ...(tipoPedido === 'pre_pedido' && { fechaEntregaSolicitada: fecha }),
      }
      const res = await crearPedido(payload)
      const { pedido, whatsappURL } = res.data

      // Abrir WhatsApp con el admin
      window.open(whatsappURL, '_blank')

      // Redirigir a estado del pedido
      nav(`/estado/${pedido._id}`)
    } catch (e) {
      const msg = e.response?.data?.mensaje || e.response?.data?.errores?.[0] || 'Ocurrió un error. Intenta de nuevo.'
      setErrMsg(msg)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pedido-page">
      <div className="pedido-wrap container">
        {/* Columna izquierda: resumen */}
        <aside className="pedido-resumen fade-in">
          <h2 className="pedido-resumen__titulo">Tu pedido</h2>
          <div className="pedido-resumen__card">
            <img
              src={producto.imagenes?.[0]?.url || `https://placehold.co/300x200/C8923A/FAF4E8?text=${producto.sabor}`}
              alt={producto.nombre}
              className="pedido-resumen__img"
            />
            <div className="pedido-resumen__info">
              <p className="pedido-resumen__sabor">{producto.sabor}</p>
              <p className="pedido-resumen__nombre">{producto.nombre}</p>
              <p className="pedido-resumen__meta">Cantidad: {cantidad}</p>
              <p className="pedido-resumen__tipo">
                {tipoPedido === 'mismo_dia' ? '⚡ Entrega hoy' : '📅 Pre-pedido'}
              </p>
            </div>
          </div>
          <div className="pedido-resumen__total">
            <span>Total</span>
            <span className="pedido-resumen__total-num">${total.toFixed(2)}</span>
          </div>
          <p className="pedido-resumen__nota">
            Al confirmar se abrirá WhatsApp para notificar al administrador.
          </p>
        </aside>

        {/* Columna derecha: formulario */}
        <div className="pedido-form fade-up">
          <h1 className="pedido-form__titulo">Datos de entrega</h1>

          <div className="form-group">
            <label>👤 Tu nombre completo</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ana Ramírez" />
          </div>

          <div className="form-group">
            <label>📱 Teléfono de contacto</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="442 123 4567" type="tel" />
          </div>

          <div className="form-group">
            <label>📍 Dirección de entrega</label>
            <textarea name="direccion" value={form.direccion} onChange={handleChange}
              placeholder="Calle, número, colonia, referencia" rows={3} />
          </div>

          {tipoPedido === 'pre_pedido' && (
            <div className="form-group">
              <label>📅 Fecha de entrega</label>
              <input type="date" value={fecha} min={fechaMin} onChange={e => setFecha(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label>💬 Notas adicionales (opcional)</label>
            <input name="notas" value={form.notas} onChange={handleChange}
              placeholder="Ej: sin azúcar, llamar al llegar..." />
          </div>

          {errMsg && <div className="form-error">{errMsg}</div>}

          <button className="btn btn-primary pedido-form__submit" onClick={handleSubmit} disabled={enviando}>
            {enviando ? '⏳ Enviando...' : '🚀 Confirmar Pedido'}
          </button>

          <button className="btn btn-secondary pedido-form__back" onClick={() => nav(-1)}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  )
}
