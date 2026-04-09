import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'WORK', to: '/projects' },
  { label: 'ABOUT', to: '/about' },
  { label: 'RESUME', to: '/resume' },
  { label: 'CONTACT', to: '/contact' },
]

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .nav-dot { animation: blink 1.2s infinite; }
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: var(--accent-color) !important; }
        .mob-link { transition: color 0.15s; }
        .mob-link:hover { color: var(--accent-color) !important; }
        @media (max-width: 680px) { .desktop-nav-links { display: none !important; } .mob-btn { display: flex !important; } }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2rem',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.8rem', letterSpacing: '0.12em' }}>
          <span className="nav-dot" style={{ color: 'var(--accent-color)', fontSize: '1rem' }}>◆</span>
          NITESHXE.DEV
          <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '0.3rem' }}>{'>>'}</span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
          {navLinks.map(link => (
            <Link key={link.label} to={link.to} className="nav-link" style={{
              color: location.pathname === link.to ? 'var(--accent-color)' : 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              fontFamily: '"BUGATTI Monospace", monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.15em'
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mob-btn" style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', flexDirection: 'column', gap: '4px', padding: '4px' }}>
          <span style={{ width: 20, height: 1, background: menuOpen ? 'var(--accent-color)' : '#fff', display: 'block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none' }} />
          <span style={{ width: 20, height: 1, background: menuOpen ? 'transparent' : '#fff', display: 'block', transition: 'opacity 0.2s' }} />
          <span style={{ width: 20, height: 1, background: menuOpen ? 'var(--accent-color)' : '#fff', display: 'block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 190, backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6rem 2rem 2rem 2rem' }}>
          {navLinks.map(link => (
            <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)} className="mob-link" style={{
              color: '#fff', textDecoration: 'none',
              fontFamily: '"BUGATTI Monospace", monospace',
              fontSize: '2.5rem', fontWeight: 700,
              letterSpacing: '-0.02em',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '1.5rem', marginBottom: '1.5rem'
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default NavigationBar
