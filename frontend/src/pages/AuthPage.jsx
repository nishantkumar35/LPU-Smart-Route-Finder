import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'register') {
      if (form.password !== form.confirm) {
        return toast.error('Passwords do not match');
      }
      if (form.password.length < 6) {
        return toast.error('Password must be at least 6 characters');
      }
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        const { data } = await api.post('/auth/login', {
          username: form.username,
          password: form.password,
        });
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.username}!`);
        navigate('/');
      } else {
        await api.post('/auth/register', {
          username: form.username,
          password: form.password,
        });
        toast.success('Admin account created! Please sign in.');
        setTab('login');
        setForm({ username: form.username, password: '', confirm: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white shadow-panel mb-1">
            <Map className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">SmartRoute Studio</h1>
          <p className="text-xs text-slate-400">Campus Graph Navigation Platform</p>
        </div>

        {/* Card */}
        <div className="ui-card p-5 space-y-4">
          <Tabs
            tabs={[
              { id: 'login', label: 'Sign In' },
              { id: 'register', label: 'Create Admin' },
            ]}
            activeTab={tab}
            onChange={(t) => {
              setTab(t);
              setForm({ username: '', password: '', confirm: '' });
            }}
          />

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
              autoComplete="username"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                  className="ui-input pr-9"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <Input
                label="Confirm Password"
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                required
              />
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              <span>{tab === 'login' ? 'Sign In' : 'Create Admin Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Quick Demo Hint */}
          <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Demo Admin Credentials:</span>
            <span className="font-mono text-brand-400">admin / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
