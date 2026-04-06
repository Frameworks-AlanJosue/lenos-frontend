import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${isHome && !scrolled ? 'navbar--transparent' : 'navbar--solid'}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__icon">🍞</span>
          <span className="navbar__name">Leños Rellenos</span>
        </Link>
        <div className="navbar__links">
          <Link to="/" className="navbar__link">Inicio</Link>
          <Link to="/#catalogo" className="navbar__link">Catálogo</Link>
          <Link to="/admin" className="navbar__link navbar__link--admin">Panel Admin</Link>
        </div>
      </div>
    </nav>
  )
}
