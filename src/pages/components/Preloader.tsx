import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { usePortfolioData } from '../../utils/DataContext'

const Preloader = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const { loading } = usePortfolioData()
  const loaderRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Check if we have already run the preloader this session
    const hasLoaded = sessionStorage.getItem('site_has_loaded')
    if (hasLoaded) return

    setIsFirstLoad(true)
    sessionStorage.setItem('site_has_loaded', 'true')

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    // GSAP Timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        if (loaderRef.current) loaderRef.current.style.display = 'none'
        sessionStorage.setItem('preloader_finished', 'true')
        window.dispatchEvent(new CustomEvent('preloader_start_reveal'))
      }
    })
    tlRef.current = tl

    const counterObj = { val: 0 }
    
    // Slow initial progress (0 -> 95%)
    tl.to(counterObj, {
      val: 95,
      duration: 3.5, 
      ease: 'power3.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = Math.round(counterObj.val) + '%'
        }
      }
    }, "start")

    tl.to(barRef.current, {
      scaleX: 0.95,
      duration: 3.5,
      ease: 'power3.out',
      transformOrigin: 'left center'
    }, "start")

    tl.play()

  }, [])

  // When loading is finished, finish the animation
  useEffect(() => {
    if (!loading && tlRef.current && isFirstLoad) {
      const tl = tlRef.current;
      const counterObj = { val: parseInt(counterRef.current?.innerText || '0') }

      // Final push to 100%
      tl.to(counterObj, {
        val: 100,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counterObj.val) + '%'
          }
        }
      })
      tl.to(barRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      }, "<")

      // 100% Impact Animation
      tl.to(counterRef.current, {
        scale: 1.15,
        color: 'var(--accent-color)',
        duration: 0.15,
        yoyo: true,
        repeat: 1
      })
      tl.to({}, { duration: 0.1 }) 

      // Snap curtain up
      tl.to(loaderRef.current, {
        y: '-100%',
        duration: 1.2,
        ease: 'power4.inOut'
      })
      
      tl.play()
    }
  }, [loading, isFirstLoad])

  if (!isFirstLoad) return null

  return (
    <div ref={loaderRef} style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#050505',
      zIndex: 9999, // Ensure it floats above absolutely everything (navs, tooltips, etc)
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontFamily: '"BUGATTI Monospace", monospace'
    }}>
      
      {/* Content Wrapper */}
      <div style={{
        width: '60%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        {/* Terminal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'rgba(255, 255, 255, 0.4)',
          textTransform: 'uppercase'
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontFamily: '"BUGATTI Monospace", monospace', fontSize: '0.8rem', letterSpacing: '0.12em' }}>
            <span className="nav-dot" style={{ color: 'var(--accent-color)', fontSize: '1rem' }}>◆</span>
            NITESHXE.DEV
            <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '0.3rem' }}>{'>>'}</span>
          </Link>
          <div>INITIALIZING RESOURCES...</div>
        </div>

        {/* Loading Track Split */}
        <div style={{ position: 'relative', width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          {/* Active Loading Bar */}
          <div ref={barRef} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#FF1100', // Explicit vibrant red
            transform: 'scaleX(0)',
            transformOrigin: 'left center'
          }} />
        </div>

        {/* Numeric Percentage */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div ref={counterRef} style={{
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.03em'
          }}>
            0%
          </div>
        </div>

      </div>

    </div>
  )
}

export default Preloader
