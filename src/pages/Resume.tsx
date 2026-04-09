import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import { usePortfolioData } from '../utils/DataContext'

gsap.registerPlugin(ScrollTrigger)

const Resume = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resume: resumeData, loading } = usePortfolioData()

  useEffect(() => {
    if (loading || !resumeData) return;
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.res-header', {
        y: 40, opacity: 0,
        duration: 1.2, ease: 'power4.out',
        delay: 0.1
      })

      // Section wrappers
      gsap.from('.res-section', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 30, opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <NavigationBar />
      
      {loading || !resumeData ? (
        <div style={{ height: '100vh', backgroundColor: '#000' }} />
      ) : (
        <main ref={containerRef} style={{ padding: '8rem 2rem 4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header & Download CTA */}
        <div className="res-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '5rem', 
          borderBottom: '2px solid var(--border-light)', 
          paddingBottom: '2rem' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: 'clamp(3rem, 8vw, 6rem)', 
              fontWeight: 800, 
              lineHeight: 0.9, 
              letterSpacing: '-0.03em', 
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase'
            }}>
              RESUME
            </h1>
            <div style={{ 
              fontFamily: '"BUGATTI Monospace", monospace', 
              fontSize: '0.65rem', letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.4)',
            }}>
              CURRICULUM VITAE // SYS.RECORD
            </div>
          </div>
          
          <button 
            style={{
              background: 'none',
              border: '1px solid currentColor',
              color: '#fff',
              fontFamily: '"BUGATTI Monospace", monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              padding: '1rem 2rem',
              cursor: resumeData.resumeUrl ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              opacity: resumeData.resumeUrl ? 1 : 0.5
            }}
            disabled={!resumeData.resumeUrl}
            onClick={() => resumeData.resumeUrl ? window.open(resumeData.resumeUrl, '_blank') : null}
            onMouseEnter={e => {
              if (resumeData.resumeUrl) {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.color = '#000'
              }
            }}
            onMouseLeave={e => {
              if (resumeData.resumeUrl) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#fff'
              }
            }}
          >
            {resumeData.resumeUrl ? 'DOWNLOAD PDF' : 'RESUME PENDING'}
          </button>
        </div>

        {/* Experience Section */}
        <div className="res-section" style={{ marginBottom: '5rem' }}>
          <h2 style={{ 
            fontFamily: '"BUGATTI Monospace", monospace', 
            fontSize: '1.2rem', letterSpacing: '0.15em', 
            color: 'var(--accent-color)', 
            marginBottom: '3rem'
          }}>
            01 // EXPERIENCE
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {resumeData.experience.map((exp: any, idx: number) => (
              <div key={idx} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: '1rem',
                borderLeft: '1px solid rgba(255,255,255,0.15)',
                paddingLeft: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    {exp.role}
                  </h3>
                  <div style={{ 
                    fontFamily: '"BUGATTI Monospace", monospace', 
                    fontSize: '0.65rem', letterSpacing: '0.15em', 
                    color: 'rgba(255,255,255,0.4)',
                    display: 'flex', gap: '1rem', flexWrap: 'wrap'
                  }}>
                    <span style={{ color: '#fff' }}>{exp.company}</span>
                    <span>|</span>
                    <span>{exp.year}</span>
                  </div>
                </div>
                {exp.description && (
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '70ch' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="res-section" style={{ marginBottom: '5rem' }}>
          <h2 style={{ 
            fontFamily: '"BUGATTI Monospace", monospace', 
            fontSize: '1.2rem', letterSpacing: '0.15em', 
            color: 'var(--accent-color)', 
            marginBottom: '3rem'
          }}>
            02 // EDUCATION
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {resumeData.education.map((edu: any, idx: number) => (
              <div key={idx} style={{ 
                borderLeft: '1px solid rgba(255,255,255,0.15)',
                paddingLeft: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  {edu.degree}
                </h3>
                <div style={{ 
                  fontFamily: '"BUGATTI Monospace", monospace', 
                  fontSize: '0.65rem', letterSpacing: '0.15em', 
                  color: 'rgba(255,255,255,0.4)',
                  display: 'flex', gap: '1rem', flexWrap: 'wrap',
                  marginBottom: '1rem'
                }}>
                  <span style={{ color: '#fff' }}>{edu.institution}</span>
                  <span>|</span>
                  <span>{edu.year}</span>
                </div>
                {edu.description && (
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '70ch' }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="res-section">
          <h2 style={{ 
            fontFamily: '"BUGATTI Monospace", monospace', 
            fontSize: '1.2rem', letterSpacing: '0.15em', 
            color: 'var(--accent-color)', 
            marginBottom: '3rem'
          }}>
            03 // SKILLS
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '3rem' 
          }}>
            {resumeData.skills.map((skillGroup: any, idx: number) => (
              <div key={idx}>
                <div style={{ 
                  fontFamily: '"BUGATTI Monospace", monospace', 
                  fontSize: '0.7rem', letterSpacing: '0.15em', 
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '0.8rem'
                }}>
                  {skillGroup.category}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skillGroup.items.map((item: string) => (
                    <span key={item} style={{
                      fontFamily: '"BUGATTI Monospace", monospace',
                      fontSize: '0.6rem', letterSpacing: '0.1em',
                      padding: '0.3rem 0.6rem',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      )}

      <Footer />
    </div>
  )
}

export default Resume
