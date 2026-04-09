
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import { usePortfolioData } from '../utils/DataContext';

const Contact = () => {
  const { contact: contactData, loading } = usePortfolioData();
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <NavigationBar />
      
      {loading || !contactData ? (
        <div style={{ height: '100vh', backgroundColor: '#000' }} />
      ) : (
        <main style={{ padding: '8rem 2rem 4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '1rem', 
          marginBottom: '6rem'
        }}>
          <div style={{ gridColumn: '1 / span 12' }}>
            <h1 style={{ 
              fontSize: 'clamp(3rem, 8vw, 8rem)', 
              lineHeight: 0.9, 
              letterSpacing: '-0.03em',
              fontWeight: 700,
              margin: 0,
              textTransform: 'uppercase'
            }}>
              CONTACT
            </h1>
          </div>
        </div>

        {/* Email CTA Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '1rem', 
          borderTop: '2px solid var(--border-light)',
          paddingTop: '4rem',
          marginBottom: '6rem'
        }}>
          <div style={{ gridColumn: '1 / span 4' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, fontFamily: '"BUGATTI Monospace", monospace', letterSpacing: '0.15em' }}>INQUIRIES</h2>
            <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--accent-color)', marginTop: '1rem' }} />
          </div>
          <div style={{ gridColumn: '5 / span 8' }}>
            <p style={{ fontSize: '1.5rem', lineHeight: 1.5, margin: '0 0 4rem 0', fontWeight: 500, maxWidth: '800px' }}>
              {contactData.description}
            </p>
            <a href={`mailto:${contactData.email}`} style={{
              display: 'inline-block',
              fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              borderBottom: '4px solid #fff',
              paddingBottom: '0.5rem',
              letterSpacing: '-0.02em',
              wordBreak: 'break-word',
              transition: 'color 0.2s, border-color 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--accent-color)';
              e.currentTarget.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#fff';
            }}
            >
              {contactData.email}
            </a>
          </div>
        </div>

        {/* Social Links Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '1rem', 
          borderTop: '1px solid var(--border-light)',
          paddingTop: '2rem'
        }}>
          <div style={{ gridColumn: '1 / span 4' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, fontFamily: '"BUGATTI Monospace", monospace', letterSpacing: '0.15em' }}>NETWORK</h2>
          </div>
          <div style={{ gridColumn: '5 / span 8' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {contactData.socials.map((social: any) => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: '#fff',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderTopColor = 'var(--accent-color)'}
                onMouseLeave={e => e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.15)'}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: '"BUGATTI Monospace", monospace', letterSpacing: '0.1em' }}>{social.platform}</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>{social.handle} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </main>
      )}
      <Footer />
    </div>
  );
};

export default Contact;
