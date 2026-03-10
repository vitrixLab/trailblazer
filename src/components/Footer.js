import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}
    >
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Responsive grid defined inline */}
        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          @media (min-width: 768px) {
            .footer-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontWeight: 900, fontSize: '0.875rem', fontFamily: 'var(--font-headings)' }}>
                  TB
                </span>
              </div>
              <span className="h3" style={{ color: 'white', marginBottom: 0 }}>
                TrailBlazers
              </span>
            </div>
            <p className="caption" style={{ color: '#9ca3af', maxWidth: '20rem', lineHeight: '1.625' }}>
              A community of runners pushing limits on every trail. Join us for weekly runs, races, and good vibes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="caption" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/" className="nav-link" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Home</Link>
              <Link to="/events" className="nav-link" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Events</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="caption" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Connect
            </h4>
            <p className="caption" style={{ color: '#9ca3af' }}>hello@trailblazersrunclub.com</p>
            <p className="caption" style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              Every trail. Every pace. Every runner.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #374151',
            marginTop: '3rem',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <p className="caption" style={{ color: '#6b7280', fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} TrailBlazers Run Club | Powered By: VitrixLab
          </p>
          <p className="caption" style={{ color: '#6b7280', fontSize: '0.75rem' }}>
            Built for runners, by runners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;