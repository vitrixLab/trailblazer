import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { loginAdmin } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginAdmin(email, password);
      login(data.token, data.admin);
      toast.success('Welcome back, admin!');
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid=\"login-page\" className=\"pt-16 min-h-screen flex items-center justify-center bg-muted/30\">
      <div className=\"w-full max-w-md mx-4\">
        <div className=\"bg-background border border-border p-8 md:p-10\">
          {/* Header */}
          <div className=\"mb-8\">
            <div className=\"w-12 h-12 bg-[#FF4D00] flex items-center justify-center mb-6\">
              <span className=\"text-white font-black text-lg font-heading\">TB</span>
            </div>
            <h1 className=\"font-heading text-3xl font-bold uppercase tracking-tight\">
              Admin Login
            </h1>
            <p className=\"text-muted-foreground text-sm mt-2\">
              Sign in to manage events and photos.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div data-testid=\"login-error\" className=\"flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-3 mb-6 text-sm\">
              <AlertCircle className=\"w-4 h-4 shrink-0\" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className=\"flex flex-col gap-5\">
            <div>
              <Label htmlFor=\"email\" className=\"text-xs font-bold uppercase tracking-widest mb-2 block\">
                Email
              </Label>
              <Input
                id=\"email\"
                data-testid=\"login-email-input\"
                type=\"email\"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=\"admin@runclub.com\"
                required
                className=\"h-12 bg-input border-border\"
              />
            </div>
            <div>
              <Label htmlFor=\"password\" className=\"text-xs font-bold uppercase tracking-widest mb-2 block\">
                Password
              </Label>
              <Input
                id=\"password\"
                data-testid=\"login-password-input\"
                type=\"password\"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=\"Enter password\"
                required
                className=\"h-12 bg-input border-border\"
              />
            </div>
            <Button
              type=\"submit\"
              data-testid=\"login-submit-btn\"
              disabled={loading}
              className=\"bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 rounded-sm font-bold uppercase tracking-widest px-8 py-6 h-auto mt-2 transition-transform duration-300 hover:-translate-y-1\"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <LogIn className=\"w-4 h-4 ml-2\" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
