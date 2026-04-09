import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import Ticker from './components/Ticker'
import { usePortfolioData } from '../utils/DataContext'

gsap.registerPlugin(ScrollTrigger)

// ── Scroll-scrubbed char reveal: dim white → red ──────────────────────────
const ScrubText = ({ text, style }: { text: string; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const spans = ref.current.querySelectorAll<HTMLElement>('.scrub-word')
    const ctx = gsap.context(() => {
      gsap.fromTo(spans,
        { color: 'rgba(255,255,255,0.38)' },
        {
          color: 'var(--accent-color)',
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            end: 'bottom 35%',
            scrub: 0.8,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Split by word, preserve spaces
  const words = text.split(' ')

  return (
    <p ref={ref} style={{ ...style, lineHeight: style?.lineHeight ?? 1.45 }}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            className="scrub-word"
            style={{ color: 'rgba(255,255,255,0.38)', display: 'inline' }}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </p>
  )
}

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { hero: heroData, about: aboutData, projects: projectsData, loading } = usePortfolioData()

  // GSAP entrance & scroll animations
  useEffect(() => {
    if (loading || !heroData) return;
    let ctx: gsap.Context;

    const playEntrance = () => {
      ctx = gsap.context(() => {
        // Status pill
        gsap.fromTo('.hero-status',
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        )
        // Hero name lines — staggered from below with clip
        gsap.fromTo('.hero-line',
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power4.out', delay: 0.25 }
        )
        // Right panel metrics
        gsap.fromTo('.metric-item',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.55 }
        )
        // Scroll-reveal sections
        gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => {
          gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            }
          )
        })
        // Featured project cards
        gsap.utils.toArray<HTMLElement>('.feat-card').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: i * 0.1,
              scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
            }
          )
        })
      }, containerRef)
    }

    if (sessionStorage.getItem('preloader_finished')) {
      playEntrance()
    } else {
      // Ensure elements remain invisible underneath the curtain while waiting
      gsap.set('.hero-status, .hero-line, .metric-item', { opacity: 0 })
      window.addEventListener('preloader_start_reveal', playEntrance, { once: true })
    }

    return () => {
      if (ctx) ctx.revert()
      window.removeEventListener('preloader_start_reveal', playEntrance)
    }
  }, [])

  const featured = projectsData ? projectsData.slice(0, 3) : []

  return (
    <div ref={containerRef} style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        /* ── Ticker ── */
        .ticker-track { display: flex; white-space: nowrap; will-change: transform; }
        .t-item { font-family: "BUGATTI Monospace", monospace; font-size: 0.68rem; letter-spacing: 0.3em; color: rgba(255,255,255,0.14); padding: 0 2.5rem; text-transform: uppercase; }
        .t-item.accent { color: var(--accent-color); }

        /* ── Hero line clip ── */
        .hero-clip { overflow: hidden; display: block; }

        /* ── Metric card ── */
        .metric-item {
          border-top: 1px solid var(--border-light);
          padding: 1.5rem 0;
          transition: border-color 0.2s;
        }
        .metric-item:hover { border-top-color: var(--accent-color); }

        /* ── Featured project card ── */
        .feat-card {
          position: relative;
          border: 1px solid var(--border-light);
          padding: 2.5rem 2rem;
          overflow: hidden;
          transition: border-color 0.3s;
          cursor: pointer;
          background: #050505;
        }
        .feat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
        }
        .feat-card:hover::before { transform: scaleX(1); }
        .feat-card:hover { border-color: rgba(255,255,255,0.3); }
        .feat-card:hover .feat-arrow { transform: translate(4px,-4px); color: var(--accent-color) !important; }
        .feat-arrow { transition: transform 0.25s, color 0.2s; display: inline-block; }

        /* ── Skill chip ── */
        .skill-chip {
          font-family: "BUGATTI Monospace", monospace;
          font-size: 0.62rem; letter-spacing: 0.12em;
          padding: 0.35rem 0.8rem;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.38);
          white-space: nowrap;
          transition: border-color 0.2s, color 0.2s;
        }
        .skill-chip:hover { border-color: var(--accent-color); color: #fff; }

        /* ── CTA block ── */
        .cta-block {
          position: relative;
          overflow: hidden;
          background: #060606;
          border: 1px solid var(--border-light);
          padding: 3.5rem 2.5rem;
          transition: border-color 0.3s;
        }
        .cta-block::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--accent-color);
          transform: translateY(101%);
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
          z-index: 0;
        }
        .cta-block:hover::after { transform: translateY(0); }
        .cta-block:hover { border-color: var(--accent-color); }
        .cta-block > * { position: relative; z-index: 1; }
        .cta-block:hover .cta-sub { color: rgba(0,0,0,0.5) !important; }
        .cta-block:hover .cta-main { color: #000 !important; }

        .cta-block-white {
          position: relative;
          overflow: hidden;
          background: #060606;
          border: 1px solid var(--border-light);
          padding: 3.5rem 2.5rem;
          transition: border-color 0.3s;
        }
        .cta-block-white::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #fff;
          transform: translateY(101%);
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
          z-index: 0;
        }
        .cta-block-white:hover::after { transform: translateY(0); }
        .cta-block-white:hover { border-color: #fff; }
        .cta-block-white > * { position: relative; z-index: 1; }
        .cta-block-white:hover .cta-sub-w { color: rgba(0,0,0,0.5) !important; }
        .cta-block-white:hover .cta-main-w { color: #000 !important; }

        /* ── Status pill ── */
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .status-dot { animation: pulse 1.8s infinite; }

        @media(max-width:900px) {
          .hero-split { flex-direction: column !important; }
          .hero-right { flex-direction: row !important; flex-wrap: wrap; border-left: none !important; border-top: 1px solid var(--border-light) !important; padding: 2rem 0 0 0 !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <NavigationBar />

      {/* Loading Guard */}
      {loading || !heroData ? (
        <div style={{ height: '100vh', backgroundColor: '#000' }} />
      ) : (
        <>
          {/* ══════════════════════════════════════
              HERO  
          ══════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '7rem 2rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Status pill */}
        <div className="hero-status" style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          {heroData.status.active && <span className="status-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block' }} />}
          <span style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.65rem', letterSpacing: '0.35em', color: 'var(--accent-color)' }}>
            {heroData.status.text}
          </span>
        </div>

        {/* Split hero */}
        <div className="hero-split" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>

          {/* LEFT — Giant Name */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <h1 style={{ margin: 0, padding: 0, lineHeight: 0.95 }}>
              {/* SOLID LINES */}
              {heroData.title.solid.split(' ').map((word: string, idx: number) => (
                <span className="hero-clip" key={idx}>
                  <span className="hero-line" style={{
                    display: 'block',
                    fontSize: 'clamp(3.5rem, 9.5vw, 9rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.05em',
                    textTransform: 'uppercase',
                    color: '#fff',
                  }}>
                    {word}
                  </span>
                </span>
              ))}
              {/* OUTLINED */}
              <span className="hero-clip">
                <span className="hero-line" style={{
                  display: 'block',
                  fontSize: 'clamp(3.5rem, 9.5vw, 9rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                  textTransform: 'uppercase',
                  WebkitTextStroke: '2px rgba(255,255,255,0.22)',
                  color: 'transparent',
                }}>
                  {heroData.title.outline}
                </span>
              </span>
            </h1>

            {/* Sub role line */}
            <div className="hero-clip" style={{ marginTop: '2.5rem' }}>
              <div className="hero-line" style={{
                fontFamily: '"BUGATTI Monospace", monospace',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.35)',
                display: 'flex', alignItems: 'center', gap: '1.2rem',
                flexWrap: 'wrap',
              }}>
                {heroData.roles.map((role: string, idx: number) => (
                  <React.Fragment key={idx}>
                    <span>{role}</span>
                    {idx < heroData.roles.length - 1 && <span style={{ color: 'var(--accent-color)' }}>◆</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Metrics column */}
          <div className="hero-right" style={{
            width: '220px',
            flexShrink: 0,
            borderLeft: '1px solid var(--border-light)',
            paddingLeft: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            paddingTop: '0.5rem',
          }}>
            {heroData.metrics.map((m: any, i: number) => (
              <div key={i} className="metric-item">
                <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', marginBottom: '0.5rem' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '0.3rem', color: m.highlight ? 'var(--accent-color)' : '#fff' }}>
                  {m.value === 'DYNAMIC' ? `${projectsData.length}+` : m.value}
                </div>
                <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.5rem', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)' }}>
            SCROLL TO EXPLORE
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TICKER
      ══════════════════════════════════════ */}
      <Ticker />

      {/* ══════════════════════════════════════
          MANIFESTO / BIO
      ══════════════════════════════════════ */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '5rem', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
              SYS.OVERVIEW
            </div>
            <div style={{ width: '30px', height: '2px', background: 'var(--accent-color)' }} />
          </div>
          <div>
            <ScrubText
              text={aboutData.paragraphs[0]}
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)', fontWeight: 600, margin: '0 0 2rem 0', letterSpacing: '-0.01em' }}
            />
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              {aboutData.paragraphs[1]}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED WORK
      ══════════════════════════════════════ */}
      <section style={{ padding: '0 2rem 8rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="reveal-up" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
          <div>
            <span style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)' }}>
              02 // SELECTED WORK
            </span>
          </div>
          <a href="/projects" style={{
            fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem',
            letterSpacing: '0.2em', color: 'var(--accent-color)',
            textDecoration: 'none', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            VIEW ALL ({projectsData.length}) ↗
          </a>
        </div>

        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {featured.map((p: any, i: number) => {
            const card = (
              <div className="feat-card" key={p.id}>
                {/* Index number — ghost */}
                <div style={{
                  position: 'absolute', top: '1.5rem', right: '1.5rem',
                  fontFamily: '"BUGATTI Monospace", monospace',
                  fontSize: '0.6rem', letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.12)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--accent-color)', marginBottom: '1.2rem' }}>
                  {p.year}
                </div>

                <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 1rem 0', lineHeight: 0.95, textTransform: 'uppercase' }}>
                  {p.name}
                  {p.link && <span className="feat-arrow" style={{ marginLeft: '0.5rem', fontSize: '70%', color: 'rgba(255,255,255,0.3)' }}>↗</span>}
                </h3>

                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.4)', margin: '0 0 1.5rem 0' }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {p.tags.map((t: string) => (
                    <span key={t} style={{
                      fontFamily: '"BUGATTI Monospace", monospace',
                      fontSize: '0.57rem', letterSpacing: '0.1em',
                      padding: '0.2rem 0.55rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.35)',
                    }}>{t}</span>
                  ))}
                </div>

                {p.inProgress && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#ff1100',
                      color: '#fff',
                      fontFamily: '"BUGATTI Monospace", monospace',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      padding: '0.25rem 0.5rem',
                    }}>
                      IN PROGRESS
                    </span>
                  </div>
                )}
              </div>
            )

            return p.link
              ? <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} className="feat-card-wrap">{card}</a>
              : <div key={p.id} className="feat-card-wrap">{card}</div>
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          STACK STRIP
      ══════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid var(--border-light)', padding: '4rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="reveal-up" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
            TECH.STACK
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {aboutData.skills.map((s: string) => (
              <span key={s} className="skill-chip">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA PAIR
      ══════════════════════════════════════ */}
      <section style={{ padding: '2rem 2rem 8rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="cta-grid reveal-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          <a href="/projects" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="cta-block" style={{ cursor: 'pointer' }}>
              <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem', letterSpacing: '0.2em', marginBottom: '1.2rem' }} className="cta-sub" >
                01 // PORTFOLIO
              </div>
              <div className="cta-main" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', transition: 'color 0.3s' }}>
                VIEW ALL WORK →
              </div>
            </div>
          </a>

          <a href="/contact" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="cta-block-white" style={{ cursor: 'pointer' }}>
              <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem', letterSpacing: '0.2em', marginBottom: '1.2rem', color: 'rgba(255,255,255,0.4)' }} className="cta-sub-w">
                02 // CONTACT
              </div>
              <div className="cta-main-w" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', transition: 'color 0.3s' }}>
                START A PROJECT →
              </div>
            </div>
          </a>

        </div>
      </section>

          <Footer />
        </>
      )}
    </div>
  )
}

export default Index