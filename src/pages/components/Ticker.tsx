import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePortfolioData } from '../../utils/DataContext'

export interface TickerItem {
  text: string
  accent?: boolean
}

const DEFAULT_ITEMS: TickerItem[] = [
  { text: 'NITESHXE.DEV', accent: false },
  { text: '◆', accent: true },
  { text: 'SOFTWARE ENGINEER', accent: false },
  { text: '◆', accent: true },
  { text: 'AI / ML SYSTEMS', accent: false },
  { text: '◆', accent: true },
  { text: 'FULL-STACK DEVELOPMENT', accent: false },
  { text: '◆', accent: true },
  { text: 'IOT + EMBEDDED', accent: false },
  { text: '◆', accent: true },
]

const Ticker = ({ speed = 22, items: propItems }: { speed?: number, items?: TickerItem[] }) => {
  const { ticker } = usePortfolioData();
  const items = propItems || ticker || DEFAULT_ITEMS;
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current) return
    const el = trackRef.current
    // Wait one frame so scrollWidth is accurate after render
    const raf = requestAnimationFrame(() => {
      const total = el.scrollWidth / 2
      gsap.to(el, { x: `-${total}px`, duration: speed, ease: 'none', repeat: -1 })
    })
    return () => {
      cancelAnimationFrame(raf)
      gsap.killTweensOf(el)
    }
  }, [speed])

  return (
    <div style={{
      borderTop: '1px solid var(--border-light)',
      borderBottom: '1px solid var(--border-light)',
      padding: '0.85rem 0',
      overflow: 'hidden',
    }}>
      <style>{`
        .ticker-track { display: flex; white-space: nowrap; will-change: transform; }
        .t-item {
          font-family: "BUGATTI Monospace", monospace;
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.38);
          padding: 0 2.5rem;
          text-transform: uppercase;
          user-select: none;
        }
        .t-item.accent { color: var(--accent-color); padding: 0 1rem; letter-spacing: 0; }
      `}</style>

      <div ref={trackRef} className="ticker-track">
        {/* Render twice so the loop is seamless */}
        {[0, 1].map(copy => (
          <React.Fragment key={copy}>
            {items.map((item: TickerItem, i: number) => (
              <span key={i} className={`t-item${item.accent ? ' accent' : ''}`}>
                {item.text}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Ticker
