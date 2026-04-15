import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const token = localStorage.getItem('lenos_token')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('lenos_token')
    localStorage.removeItem('lenos_user')
    navigate('/login')
  }

  return (
    <nav className={`navbar ${isHome && !scrolled ? 'navbar--transparent' : 'navbar--solid'}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__icon">🍞</span>
          <span className="navbar__name">Leños Rellenos</span>
        </Link>
        <div className="navbar__links">
          <Link to="/" className="navbar__link">Inicio</Link>
          <Link to="/comentarios" className="navbar__link">Comentarios</Link>
          {token ? (
            <>
              <Link to="/admin" className="navbar__link navbar__link--admin">Panel Admin</Link>
              <button onClick={handleLogout} className="navbar__btn-logout">Salir</button>
            </>
          ) : (
            <Link to="/login" className="navbar__link">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
