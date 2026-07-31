import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Eye, EyeOff, ArrowRight, MapPin, Zap, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Navigation, label: 'Shortest path via Dijkstra & A*', sub: 'Graph algorithm powered' },
  { icon: MapPin,     label: 'Interactive campus map',           sub: 'Click any node to navigate' },
  { icon: BarChart2,  label: 'Algorithm step visualizer',        sub: 'See every decision traced' },
  { icon: Zap,        label: 'Real-time route metrics',          sub: 'Distance, time & stops' },
];

export default function AuthPage() {
  const [tab, setTab]           = useState('login');
  const [form, setForm]         = useState({ username: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchTab = (t) => {
    setTab(t);
    setForm({ username: '', password: '', confirm: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'register') {
      if (form.password !== form.confirm) return toast.error('Passwords do not match');
      if (form.password.length < 6)      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      if (tab === 'login') {
        const { data } = await api.post('/auth/login', { username: form.username, password: form.password });
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.username}!`);
        navigate('/');
      } else {
        await api.post('/auth/register', { username: form.username, password: form.password });
        toast.success('Account created! Please sign in.');
        switchTab('login');
        setForm({ username: form.username, password: '', confirm: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500/70 focus:ring-2 focus:ring-brand-500/20 transition-all duration-150';

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">

      {/* ── Left brand panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-10 relative overflow-hidden border-r border-dark-700/50">
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Warm amber radial glow */}
        <div
          className="absolute bottom-0 left-0 w-96 h-96 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 90%, #f59e0b 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 10%, #14b8a6 0%, transparent 65%)' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-amber">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-100 tracking-tight">SmartRoute</div>
            <div className="text-[11px] text-slate-500 font-medium">LPU Campus</div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-slate-100 leading-[1.15] tracking-tight">
              Navigate campus<br />
              <span className="text-brand-400">like a shortcut</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Find the fastest path between any two points on LPU's campus using real graph algorithms — instantly.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs text-slate-500">Built for LPU · Powered by graph algorithms</span>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-500 items-center justify-center mb-3 shadow-glow-amber">
            <Navigation className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">SmartRoute</h1>
          <p className="text-xs text-slate-500 mt-1">LPU Campus Navigation</p>
        </div>

        <div className="w-full max-w-[360px] animate-slide-up">

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {tab === 'login'
                ? 'Sign in to access the campus map'
                : 'Get started with SmartRoute today'}
            </p>
          </div>

          {/* Tab switcher — pill style */}
          <div className="flex gap-1.5 p-1 bg-dark-800 rounded-xl border border-dark-700 mb-6">
            {[{ id: 'login', label: 'Sign In' }, { id: 'register', label: 'Register' }].map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  tab === t.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="ui-label">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                autoComplete="username"
                className={inputClass}
              />
            </div>

            <div>
              <label className="ui-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors p-0.5"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="ui-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleInputChange}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white text-sm font-semibold transition-all duration-150 shadow-glow-amber/60 hover:shadow-glow-amber disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 flex items-center justify-between px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700/60">
            <span className="text-xs text-slate-500">Demo credentials</span>
            <span className="font-mono text-xs text-brand-400 font-semibold">admin / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
