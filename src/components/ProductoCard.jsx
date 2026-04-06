import { useNavigate } from 'react-router-dom'
import './ProductoCard.css'

const SABOR_EMOJI = { Chocolate: '🍫', Nuez: '🥜', Cajeta: '🍯', Mixto: '✨' }

const PLACEHOLDER = (sabor) =>
  `https://placehold.co/480x320/${encodeURIComponent('C8923A')}/${encodeURIComponent('FAF4E8')}?text=${encodeURIComponent(sabor)}&font=playfair-display`

export default function ProductoCard({ producto, animDelay = 0 }) {
  const nav = useNavigate()
  const imagen = producto.imagenes?.[0]?.url || PLACEHOLDER(producto.sabor)

  return (
    <article
      className="pcard fade-up"
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={() => nav(`/productos/${producto._id}`)}
    >
      <div className="pcard__img-wrap">
        <img src={imagen} alt={producto.nombre} className="pcard__img" loading="lazy" />
        <div className="pcard__overlay" />
        <span className={`pcard__badge badge ${producto.disponible && producto.stock > 0 ? 'badge-verde' : 'badge-rojo'}`}>
          {producto.disponible && producto.stock > 0 ? 'Disponible' : 'Agotado'}
        </span>
        <span className="pcard__sabor-icon">{SABOR_EMOJI[producto.sabor] || '🍞'}</span>
      </div>

      <div className="pcard__body">
        <p className="pcard__sabor">{producto.sabor}</p>
        <h3 className="pcard__nombre">{producto.nombre}</h3>
        <p className="pcard__desc">{producto.descripcion}</p>

        <div className="pcard__footer">
          <span className="pcard__precio">${producto.precio.toFixed(2)}</span>
          <button
            className="btn btn-primary pcard__btn"
            disabled={!producto.disponible || producto.stock === 0}
            onClick={(e) => { e.stopPropagation(); nav(`/productos/${producto._id}`) }}
          >
            {producto.disponible && producto.stock > 0 ? '+ Pedir' : 'Agotado'}
          </button>
        </div>
      </div>
    </article>
  )
}
