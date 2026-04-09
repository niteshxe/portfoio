import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import labData from '../data/lab.json'

gsap.registerPlugin(ScrollTrigger)

const Lab = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.lab-header', {
        y: 40, opacity: 0,
        duration: 1.2, ease: 'power4.out',
        delay: 0.1
      })

      // Logs stagger entrance
      gsap.from('.lab-log-entry', {
        scrollTrigger: {
          trigger: '.lab-logs-container',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        rotationX: -15,
        duration: 0.8,
        stagger: 0.15,
        transformOrigin: 'bottom center',
        ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <NavigationBar />
      
      <main ref={containerRef} style={{ padding: '8rem 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div className="lab-header" style={{ marginBottom: '5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 7rem)', 
            fontWeight: 800, 
            lineHeight: 0.9, 
            letterSpacing: '-0.03em', 
            margin: '0 0 1rem 0',
            textTransform: 'uppercase'
          }}>
            SYSTEM<br/>LOGS
          </h1>
          <div style={{ 
            display: 'flex', gap: '1.5rem', 
            fontFamily: '"BUGATTI Monospace", monospace', 
            fontSize: '0.65rem', letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '2rem'
          }}>
            <span>RAW OUTPUT</span>
            <span style={{ color: 'var(--accent-color)' }}>◆</span>
            <span>TELEMETRY</span>
            <span style={{ color: 'var(--accent-color)' }}>◆</span>
            <span>SKETCHES</span>
          </div>
        </div>

        {/* Logs Container */}
        <div className="lab-logs-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {labData.map((log) => {
            
            // Determine status color
            let statusColor = 'rgba(255,255,255,0.2)';
            if (log.status === 'CRITICAL' || log.status === 'FAULT') statusColor = 'var(--accent-color)';
            if (log.status === 'STABLE') statusColor = '#00ff88';

            return (
              <div key={log.id} className="lab-log-entry" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 2fr) 6fr',
                gap: '2rem',
                borderLeft: `2px solid ${statusColor}`,
                paddingLeft: '1.5rem',
                position: 'relative'
              }}>
                {/* Left Meta */}
                <div style={{
                  fontFamily: '"BUGATTI Monospace", monospace',
                  display: 'flex', flexDirection: 'column', gap: '0.8rem'
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#fff', letterSpacing: '0.15em' }}>
                    {log.id}
                  </div>
                  <div style={{
                    fontSize: '0.55rem', 
                    letterSpacing: '0.15em', 
                    color: statusColor,
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
                    {log.status}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                    {log.timestamp}
                  </div>
                </div>

                {/* Right Content */}
                <div>
                  <p style={{
                    fontFamily: '"BUGATTI Monospace", monospace',
                    fontSize: '0.85rem',
                    lineHeight: 1.8,
                    letterSpacing: '0.05em',
                    color: 'rgba(255,255,255,0.5)',
                    margin: 0,
                    textTransform: 'uppercase'
                  }}>
                    {log.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </main>

      <Footer />
    </div>
  )
}

export default Lab
