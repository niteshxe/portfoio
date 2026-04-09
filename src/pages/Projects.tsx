import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import Ticker from './components/Ticker'
import { usePortfolioData } from '../utils/DataContext'

gsap.registerPlugin(ScrollTrigger)

const FILTERS = ['ALL', '2025', '2024', '2023']

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const { projects: projectsData, loading } = usePortfolioData()

  const filtered = !projectsData ? [] : (
    activeFilter === 'ALL'
      ? projectsData
      : projectsData.filter((p: any) => p.year === activeFilter)
  )



  // Page + card animations
  useEffect(() => {
    if (loading || !projectsData) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-label',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo('.ph-title',
        { y: 60, opacity: 0, skewY: 2 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: 'power4.out', delay: 0.2 }
      )
      gsap.fromTo('.ph-filters',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.45 }
      )
      gsap.utils.toArray<HTMLElement>('.proj-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
            delay: i < 3 ? i * 0.08 + 0.55 : 0,
            scrollTrigger: i >= 3 ? {
              trigger: el,
              start: 'top 87%',
              toggleActions: 'play none none none',
            } : undefined
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [filtered])

  return (
    <div ref={containerRef} style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        .proj-card {
          position: relative;
          border-bottom: 1px solid var(--border-light);
          padding: 3rem 0;
          cursor: pointer;
          overflow: hidden;
          transition: padding-left 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .proj-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--accent-color);
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.23,1,0.32,1);
          z-index: 0;
        }
        .proj-card:hover::before { transform: translateX(0); }
        .proj-card:hover { padding-left: 1.5rem; }
        .proj-card:hover .proj-num { color: rgba(0,0,0,0.25) !important; }
        .proj-card:hover .proj-title { color: #000 !important; }
        .proj-card:hover .proj-desc { color: rgba(0,0,0,0.6) !important; }
        .proj-card:hover .proj-tag { border-color: rgba(0,0,0,0.3) !important; color: rgba(0,0,0,0.7) !important; }
        .proj-card:hover .proj-year { color: rgba(0,0,0,0.4) !important; }
        .proj-card:hover .proj-arrow { color: #000 !important; opacity: 1 !important; transform: translate(3px, -3px) !important; }
        .proj-card:hover .proj-wip { color: rgba(0,0,0,0.35) !important; }
        .proj-card > * { position: relative; z-index: 1; }

        .proj-title { transition: color 0.3s; }
        .proj-desc { transition: color 0.3s; }
        .proj-num { transition: color 0.3s; }
        .proj-year { transition: color 0.3s; }
        .proj-arrow { transition: color 0.25s, opacity 0.25s, transform 0.25s; }
        .proj-tag { transition: border-color 0.25s, color 0.25s; }

        .filter-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.35);
          font-family: "BUGATTI Monospace", monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          padding: 0.5rem 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
        .filter-btn.active { background: var(--accent-color); border-color: var(--accent-color); color: #fff; }

        .ticker-track {
          display: flex;
          white-space: nowrap;
          will-change: transform;
        }
        .ticker-item {
          font-family: "BUGATTI Monospace", monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.15);
          padding: 0 3rem;
          text-transform: uppercase;
        }
        .ticker-item span { color: var(--accent-color); }

        @media (max-width: 768px) {
          .proj-grid { grid-template-columns: 1fr 1fr !important; }
          .proj-card { padding: 2rem 0; }
        }
        @media (max-width: 500px) {
          .proj-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <NavigationBar />

      {loading || !projectsData ? (
        <div style={{ height: '100vh', backgroundColor: '#000' }} />
      ) : (
        <>
          {/* ── HERO ── */}
      <section style={{ padding: '9rem 2rem 0 2rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="ph-label" style={{
          fontFamily: '"BUGATTI Monospace", monospace',
          fontSize: '0.7rem', letterSpacing: '0.4em',
          color: 'var(--accent-color)', marginBottom: '1.5rem'
        }}>
          PROJECT.ARCHIVE // {projectsData.length} ENTRIES
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
          <h1 className="ph-title" style={{
            fontSize: 'clamp(5rem, 14vw, 11rem)',
            fontWeight: 800, lineHeight: 0.82,
            letterSpacing: '-0.05em', margin: 0,
            textTransform: 'uppercase',
          }}>
            ALL<br />
            <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.25)', color: 'transparent' }}>WORK</span>
          </h1>

          <div className="ph-filters" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignSelf: 'flex-end', paddingBottom: '0.5rem' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker speed={25} items={[
        { text: 'SELECTED WORK' },
        { text: '◆', accent: true },
        { text: 'NITESHXE.DEV' },
        { text: '◆', accent: true },
        { text: '2023 — 2025' },
        { text: '◆', accent: true },
        { text: 'FULL-STACK + AI/ML' },
        { text: '◆', accent: true },
      ]} />

      {/* ── PROJECT LIST ── */}
      <main style={{ padding: '0 2rem 6rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Column header bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '4rem 1fr auto',
          gap: '1rem', padding: '1.2rem 0',
          borderBottom: '1px solid var(--border-light)',
          fontFamily: '"BUGATTI Monospace", monospace',
          fontSize: '0.6rem', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.2)',
          marginTop: '3rem',
        }}>
          <span>INDEX</span>
          <span>PROJECT / DESCRIPTION</span>
          <span>YEAR</span>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center', fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em' }}>
            NO ENTRIES FOR {activeFilter}
          </div>
        )}

        {filtered.map((project: any) => {
          const globalIdx = projectsData.findIndex((p: any) => p.id === project.id)
          const content = (
            <div
              className="proj-card"
              style={{ display: 'grid', gridTemplateColumns: '4rem 1fr auto', gap: '1.5rem', alignItems: 'center' }}
            >
              {/* Index number */}
              <div className="proj-num" style={{
                fontFamily: '"BUGATTI Monospace", monospace',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.1em',
                lineHeight: 1,
              }}>
                {String(globalIdx + 1).padStart(2, '0')}
              </div>

              {/* Main content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <h2 className="proj-title" style={{
                    fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    margin: 0,
                    textTransform: 'uppercase',
                  }}>
                    {project.name}
                  </h2>
                  {project.link && (
                    <span className="proj-arrow" style={{
                      fontSize: '1.2rem',
                      color: 'rgba(255,255,255,0.3)',
                      opacity: 0.5,
                      transition: 'all 0.25s',
                      display: 'inline-block',
                    }}>↗</span>
                  )}
                </div>

                <p className="proj-desc" style={{
                  fontSize: '0.9rem', lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.4)',
                  margin: '0 0 1rem 0',
                  maxWidth: '55ch',
                }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="proj-tag" style={{
                      fontFamily: '"BUGATTI Monospace", monospace',
                      fontSize: '0.58rem', letterSpacing: '0.12em',
                      padding: '0.2rem 0.6rem',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.4)',
                    }}>{tag}</span>
                  ))}
                </div>

                {project.inProgress && (
                  <div style={{ marginTop: '2rem' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#ff1100',
                      color: '#fff',
                      fontFamily: '"BUGATTI Monospace", monospace',
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      padding: '0.3rem 0.6rem',
                    }}>
                      IN PROGRESS
                    </span>
                  </div>
                )}
              </div>

              {/* Year */}
              <div className="proj-year" style={{
                fontFamily: '"BUGATTI Monospace", monospace',
                fontSize: '0.65rem', letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.2)',
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}>
                {project.year}
              </div>
            </div>
          )

          return project.link
            ? <a key={project.id} href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{content}</a>
            : <div key={project.id}>{content}</div>
        })}

      </main>

      {/* ── BOTTOM CTA ── */}
      <div style={{
        borderTop: '1px solid var(--border-light)',
        padding: '4rem 2rem',
        maxWidth: '1300px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '2rem',
      }}>
        <div>
          <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.8rem' }}>
            GET IN TOUCH
          </div>
          <a href="/contact" style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#fff', textDecoration: 'none',
            borderBottom: '3px solid var(--accent-color)',
            paddingBottom: '0.2rem',
            display: 'inline-block',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-color)'}
            onMouseLeave={e => e.currentTarget.style.color = '#fff'}
          >
            COLLABORATE →
          </a>
        </div>
        <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)', textAlign: 'right', lineHeight: 2 }}>
          <div>NITESHXE.DEV</div>
          <div>ALL WORK © 2023–2025</div>
        </div>
      </div>

          <Footer />
        </>
      )}
    </div>
  )
}

export default Projects
