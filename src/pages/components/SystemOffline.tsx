import React from 'react';

interface SystemOfflineProps {
  error: string;
  onRetry: () => void;
}

const SystemOffline: React.FC<SystemOfflineProps> = ({ error, onRetry }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#050505',
      color: '#ff3e3e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: '"BUGATTI Monospace", monospace',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <style>{`
        .error-box {
          border: 1px solid #ff3e3e;
          padding: 3rem;
          max-width: 600px;
          position: relative;
        }
        .error-tag {
          position: absolute;
          top: -12px;
          left: 20px;
          background: #050505;
          padding: 0 10px;
          font-size: 0.75rem;
          color: #ff3e3e;
        }
        .error-code {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -2px;
        }
        .error-message {
          font-size: 0.85rem;
          line-height: 1.6;
          color: rgba(255, 62, 62, 0.7);
          margin-bottom: 2rem;
          text-transform: uppercase;
        }
        .retry-btn {
          background: #ff3e3e;
          color: #000;
          border: none;
          padding: 1rem 2rem;
          font-family: inherit;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .retry-btn:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 62, 62, 0.3);
        }
        .glitch-text {
          animation: glitch 1s infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 2px); text-shadow: 2px 0 #fff; }
          40% { transform: translate(-2px, -2px); text-shadow: -2px 0 #fff; }
          60% { transform: translate(2px, 2px); text-shadow: 2px 0 #fff; }
          80% { transform: translate(2px, -2px); text-shadow: -2px 0 #fff; }
          100% { transform: translate(0); text-shadow: none; }
        }
      `}</style>

      <div className="error-box">
        <span className="error-tag">COMMUNICATION_LINK_FAILURE</span>
        <div className="error-code glitch-text">503</div>
        <div className="error-message">
          The central kernel server is currently unreachable. 
          The connection timed out or the remote host is offline.
          <br /><br />
          {error}
        </div>
        
        <button className="retry-btn" onClick={onRetry}>
          Initialize Recovery Sequence
        </button>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.65rem', opacity: 0.5, color: '#fff' }}>
        NITESHXE_PORTFOLIO // SYSTEM_VERSION_2.0.4 // OFFLINE_MODE
      </div>
    </div>
  );
};

export default SystemOffline;
