

const Footer = () => {
  const now = new Date()
  const offset = '+5:30'

  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      padding: '3rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: '"BUGATTI Monospace", monospace',
      fontSize: '0.7rem',
      color: 'rgba(255,255,255,0.35)',
      letterSpacing: '0.1em',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <span>EST. {now.getFullYear()} // LOC: UTC{offset} // NITESHXE.DEV</span>
      <span>© {now.getFullYear()} NITESH KUMAR VASHISHT — ALL RIGHTS RESERVED</span>
    </footer>
  )
}

export default Footer
