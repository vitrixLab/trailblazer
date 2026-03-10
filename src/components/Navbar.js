import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header data-testid="navbar" className="header">
      <div className="container">
        {/* Responsive helper classes */}
        <style>{`
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          @media (min-width: 768px) {
            .desktop-nav { display: flex; align-items: center; gap: 2rem; }
            .mobile-toggle { display: none; }
          }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* Logo */}
          <Link
            to="/"
            data-testid="navbar-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
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
            <span className="h3" style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
              TrailBlazers
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className="nav-link"
                style={isActive(link.to) ? { color: 'var(--color-primary)' } : {}}
              >
                {link.label}
              </Link>
            ))}
            {admin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/admin" data-testid="nav-link-admin">
                  <button
                    className="btn-outline"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <LayoutDashboard style={{ width: '0.75rem', height: '0.75rem' }} />
                    Dashboard
                  </button>
                </Link>
                <button
                  data-testid="logout-btn"
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-foreground)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-foreground)')}
                >
                  <LogOut style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            ) : (
              <Link to="/login" data-testid="nav-link-login">
                <button
                  className="btn-outline"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                  }}
                >
                  Admin
                </button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            data-testid="mobile-menu-toggle"
            className="mobile-toggle"
            style={{ padding: '0.5rem' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X style={{ width: '1.25rem', height: '1.25rem' }} /> : <Menu style={{ width: '1.25rem', height: '1.25rem' }} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav
            data-testid="mobile-nav"
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="nav-link"
                style={isActive(link.to) ? { color: 'var(--color-primary)' } : {}}
              >
                {link.label}
              </Link>
            ))}
            {admin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="nav-link"
                  style={{ textAlign: 'left', color: 'var(--color-primary)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="nav-link"
              >
                Admin Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;