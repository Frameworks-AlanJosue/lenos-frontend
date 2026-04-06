import { useState, useEffect } from 'react'
import { getProductos } from '../api'
import ProductoCard from '../components/ProductoCard'
import './Home.css'

const SABORES = ['Todos', 'Chocolate', 'Nuez', 'Cajeta', 'Mixto']

const HERO_IMG = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80'

export default function Home() {
  const [productos, setProductos]   = useState([])
  const [filtro, setFiltro]         = useState('Todos')
  const [cargando, setCargando]     = useState(true)

  useEffect(() => {
    const params = filtro !== 'Todos' ? { sabor: filtro } : {}
    setCargando(true)
    getProductos(params)
      .then(r => setProductos(r.data.productos))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [filtro])

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="hero__veil" />
        <div className="hero__content container">
          <span className="hero__eyebrow fade-up">Artesanal · Hecho con Amor</span>
          <h1 className="hero__title fade-up" style={{ animationDelay: '100ms' }}>
            Leños<br /><em>Rellenos</em>
          </h1>
          <p className="hero__sub fade-up" style={{ animationDelay: '200ms' }}>
            Crujiente por fuera, suave y lleno de sabor por dentro.<br />
            Tradición artesanal en cada mordida.
          </p>
          <div className="hero__actions fade-up" style={{ animationDelay: '300ms' }}>
            <a href="#catalogo" className="btn btn-primary hero__cta">Ver Catálogo</a>
            <a href="#catalogo" className="btn btn-ghost">¿Cómo pedimos?</a>
          </div>
        </div>
        <div className="hero__scroll">
          <span>▾</span>
        </div>
      </section>

      {/* ── FRANJA DE DATOS ─────────────────────────────────────────────── */}
      <section className="franja">
        <div className="container franja__inner">
          {[
            { num: '100%', label: 'Hecho a mano' },
            { num: '4',    label: 'Sabores únicos' },
            { num: '⚡',   label: 'Entrega mismo día' },
            { num: '❤️',   label: 'Tradición familiar' },
          ].map((f, i) => (
            <div key={i} className="franja__item">
              <span className="franja__num">{f.num}</span>
              <span className="franja__label">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATÁLOGO ─────────────────────────────────────────────────────── */}
      <section className="catalogo container" id="catalogo">
        <div className="catalogo__header">
          <p className="section-eyebrow">Nuestros Productos</p>
          <h2 className="section-title">El sabor que buscabas</h2>
        </div>

        {/* Filtros */}
        <div className="catalogo__filtros">
          {SABORES.map(s => (
            <button
              key={s}
              className={`sabor-tag ${filtro === s ? 'activo' : ''}`}
              onClick={() => setFiltro(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        {cargando ? (
          <div className="spinner" />
        ) : productos.length === 0 ? (
          <div className="empty-state">
            <span>🍞</span>
            <p>No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="catalogo__grid">
            {productos.map((p, i) => (
              <ProductoCard key={p._id} producto={p} animDelay={i * 70} />
            ))}
          </div>
        )}
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <section className="como">
        <div className="container">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Simple y Rápido</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
            ¿Cómo hacer tu pedido?
          </h2>
          <div className="como__steps">
            {[
              { n: '01', icon: '📷', titulo: 'Escanea el QR',      desc: 'Apunta tu cámara al código QR del producto.' },
              { n: '02', icon: '🛒', titulo: 'Elige tu sabor',     desc: 'Selecciona cantidad y sabor favorito.' },
              { n: '03', icon: '📝', titulo: 'Llena el formulario', desc: 'Solo tu nombre, dirección y teléfono.' },
              { n: '04', icon: '🚀', titulo: '¡Listo!',            desc: 'Te confirmamos por WhatsApp y enviamos.' },
            ].map((s, i) => (
              <div key={i} className="como__step fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="como__num">{s.n}</div>
                <div className="como__icon">{s.icon}</div>
                <h3 className="como__titulo">{s.titulo}</h3>
                <p className="como__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <p className="footer__brand">🍞 Leños Rellenos</p>
            <p className="footer__sub">Tradición artesanal · Querétaro, México</p>
          </div>
          <p className="footer__copy">© 2025 Leños Rellenos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
