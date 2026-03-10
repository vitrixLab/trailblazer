import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/lib/api';
import { toast } from 'sonner';
import { LogIn, AlertCircle, Chrome, Facebook } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(email, password);
      authLogin(data.access_token, { email: data.email });
      toast.success('Welcome back, admin!');
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder social handlers
  const handleGoogleLogin = () => {
    toast.info('Google login coming soon');
  };

  const handleFacebookLogin = () => {
    toast.info('Facebook login coming soon');
  };

  return (
    <div
      data-testid="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,77,0,0.05), transparent 70%), #F3F4F6',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div className="card-feature" style={{ padding: '2.5rem 2rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#FF4D00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ color: 'white', fontWeight: 900, fontSize: '1.125rem', fontFamily: 'var(--font-headings)' }}>
                TB
              </span>
            </div>
            <h1 className="h2" style={{ marginBottom: '0.5rem' }}>
              Admin Login
            </h1>
            <p className="caption">
              Sign in to manage events and photos.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              data-testid="login-error"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(220,38,38,0.1)',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}
            >
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                htmlFor="email"
                className="caption"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Email
              </label>
              <input
                id="email"
                data-testid="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@runclub.com"
                required
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="caption"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Password
              </label>
              <input
                id="password"
                data-testid="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <LogIn style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
            </button>
          </form>

          {/* Separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)' }} />
            <span className="caption" style={{ color: 'var(--color-muted-foreground)' }}>OR</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)' }} />
          </div>

          {/* Social Login Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              data-testid="google-login-btn"
              className="btn-outline"
              onClick={handleGoogleLogin}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Chrome style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Continue with Google
            </button>
            <button
              data-testid="facebook-login-btn"
              className="btn-outline"
              onClick={handleFacebookLogin}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Facebook style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}