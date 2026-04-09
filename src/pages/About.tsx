import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import { usePortfolioData } from '../utils/DataContext'

gsap.registerPlugin(ScrollTrigger)

// ── Scroll-scrubbed word reveal: dim white → red ──────────────────────────
const ScrubText = ({
  text,
  style,
  startColor = 'rgba(255,255,255,0.38)',
  endColor = 'var(--accent-color)',
  start = 'top 78%',
  end = 'bottom 30%',
}: {
  text: string
  style?: React.CSSProperties
  startColor?: string
  endColor?: string
  start?: string
  end?: string
}) => {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const spans = ref.current.querySelectorAll<HTMLElement>('.scrub-word')
    const ctx = gsap.context(() => {
      gsap.fromTo(spans,
        { color: startColor },
        {
          color: endColor,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub: 0.8,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  const words = text.split(' ')

  return (
    <p ref={ref} style={{ ...style, lineHeight: style?.lineHeight ?? 1.55 }}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="scrub-word" style={{ color: 'rgba(255,255,255,0.38)', display: 'inline' }}>
            {word}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </p>
  )
}

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { about: aboutData, loading } = usePortfolioData()

  useEffect(() => {
    if (loading || !aboutData) return;
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo('.about-label',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      )
      gsap.fromTo('.about-title',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
      )
      // Scroll-reveal blocks
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .about-clip { overflow: hidden; display: block; }

        .exp-row {
          display: grid;
          grid-template-columns: 10rem 1fr;
          gap: 2rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--border-light);
          align-items: start;
          transition: padding-left 0.25s;
        }
        .exp-row:last-child { border-bottom: none; }
        .exp-row:hover { padding-left: 0.8rem; }
        .exp-row:hover .exp-role { color: var(--accent-color) !important; }

        .skill-pill {
          border: 1px solid rgba(255,255,255,0.12);
          padding: 0.4rem 1rem;
          font-family: "BUGATTI Monospace", monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.35);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: default;
        }
        .skill-pill:hover {
          border-color: var(--accent-color);
          color: #fff;
          background: rgba(255,17,0,0.08);
        }

        @media(max-width:680px) {
          .exp-row { grid-template-columns: 1fr !important; gap: 0.75rem; }
          .bio-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>

      <NavigationBar />

      {loading || !aboutData ? (
        <div style={{ height: '100vh', backgroundColor: '#000' }} />
      ) : (
        <main style={{ padding: '8rem 2rem 6rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom: '6rem' }}>
          <div className="about-label" style={{
            fontFamily: '"BUGATTI Monospace", monospace',
            fontSize: '0.68rem', letterSpacing: '0.35em',
            color: 'var(--accent-color)', marginBottom: '1.8rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
            SYS.PROFILE // NITESH.VASHISHT
          </div>
          <div className="about-clip">
            <h1 className="about-title" style={{
              fontSize: 'clamp(5rem, 13vw, 10rem)',
              fontWeight: 800, letterSpacing: '-0.05em',
              lineHeight: 0.82, margin: 0, textTransform: 'uppercase',
              display: 'flex', flexWrap: 'wrap', gap: '0 1.5rem',
              alignItems: 'baseline'
            }}>
              <span style={{ color: '#fff' }}>ABOUT</span>
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)', color: 'transparent' }}>ME</span>
            </h1>
          </div>
          <div style={{
            marginTop: '2rem',
            fontFamily: '"BUGATTI Monospace", monospace',
            fontSize: '0.7rem', letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.22)',
          }}>
            {aboutData.subtitle}
          </div>
        </div>

        {/* ── 01 BIOGRAPHY ── */}
        <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: '3.5rem', marginBottom: '6rem' }}>
          <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', marginBottom: '3rem' }}>
            01 // BIOGRAPHY
          </div>

          <div className="bio-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '5rem', alignItems: 'start' }}>
            <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', lineHeight: 2, paddingTop: '0.3rem' }}>
              <div>NITESH KUMAR VASHISHT</div>
              <div style={{ color: 'var(--accent-color)', marginTop: '0.5rem' }}>AVAILABLE</div>
              <div style={{ marginTop: '2rem', width: '24px', height: '2px', background: 'var(--accent-color)' }} />
            </div>

            <div>
              {/* Lead paragraph — scrubbed red */}
              <ScrubText
                text={aboutData.paragraphs[0]}
                style={{ fontSize: 'clamp(1.35rem, 2.6vw, 2rem)', fontWeight: 600, margin: '0 0 2.5rem 0', letterSpacing: '-0.01em' }}
                startColor="rgba(255,255,255,0.38)"
                endColor="var(--accent-color)"
                start="top 78%"
                end="bottom 25%"
              />

              {/* Remaining paragraphs — scrubbed white */}
              {aboutData.paragraphs.slice(1).map((para: string, idx: number) => (
                <ScrubText
                  key={idx}
                  text={para}
                  style={{ fontSize: '1rem', fontWeight: 400, margin: '0 0 1.5rem 0' }}
                  startColor="rgba(255,255,255,0.32)"
                  endColor="rgba(255,255,255,0.75)"
                  start="top 82%"
                  end="bottom 20%"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 02 EXPERIENCE ── */}
        <section className="reveal-up" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '3.5rem', marginBottom: '6rem' }}>
          <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', marginBottom: '3rem' }}>
            02 // EXPERIENCE.LOG
          </div>

          {aboutData.experience.map((exp: any) => (
            <div key={exp.id} className="exp-row">
              <div style={{
                fontFamily: '"BUGATTI Monospace", monospace',
                fontSize: '0.65rem', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.3)', paddingTop: '0.4rem',
                lineHeight: 1.8
              }}>
                <div>{exp.period}</div>
                <div style={{ marginTop: '0.5rem', color: 'var(--accent-color)', fontSize: '0.58rem', letterSpacing: '0.15em' }}>
                  {exp.company}
                </div>
              </div>
              <div>
                <h3 className="exp-role" style={{
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)',
                  fontWeight: 700, letterSpacing: '-0.03em',
                  margin: '0 0 1rem 0', lineHeight: 1,
                  textTransform: 'uppercase',
                  transition: 'color 0.25s',
                }}>
                  {exp.role}
                </h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* ── 03 SKILLS ── */}
        <section className="reveal-up" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '3.5rem' }}>
          <div style={{ fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', marginBottom: '2.5rem' }}>
            03 // CAPABILITIES.LIST
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {aboutData.skills.map((skill: string) => (
              <span key={skill} className="skill-pill">{skill}</span>
            ))}
          </div>
        </section>

      </main>
      )}
      <Footer />
    </div>
  )
}

export default About
