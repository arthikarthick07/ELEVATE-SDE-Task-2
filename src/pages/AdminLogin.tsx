import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import Brand from '@/components/Brand';
import { useApp } from '@/context/AppContext';

export default function AdminLogin() {
  const { adminLogin, isAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/applications';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }
    const ok = adminLogin(username, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <Brand size="lg" />
          </div>

          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-navy-800 to-navy-950 px-6 py-8 text-center text-white">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-7 w-7 text-gold-400" />
              </div>
              <h1 className="mt-4 text-xl font-bold">Administration Portal</h1>
              <p className="mt-1 text-sm text-navy-200">
                Sign in to manage applications and certificates
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8" noValidate>
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-navy-700">
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                <Lock className="h-4 w-4" />
                Sign In
              </button>

              <div className="rounded-xl bg-navy-50 p-3 text-center text-xs text-navy-500">
                Demo credentials — username: <span className="font-mono font-semibold text-navy-700">admin</span>, password: <span className="font-mono font-semibold text-navy-700">admin</span>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
