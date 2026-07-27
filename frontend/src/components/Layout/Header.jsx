import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Search, LogOut, Shield, User, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import api from '../../api/axios';

export default function Header({ onOpenSearch }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/health')
      .then(() => { if (!cancelled) setHealth(true); })
      .catch(() => { if (!cancelled) setHealth(false); });
    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-13 bg-dark-900 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
          <Map className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-100 tracking-tight">SmartRoute</span>
          <span className="text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded bg-dark-800 border border-slate-800 text-slate-400">
            LPU Studio
          </span>
        </div>
      </div>

      {/* Center Search Trigger (Linear style) */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-dark-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all duration-150 w-72"
      >
        <Search className="w-3.5 h-3.5 text-slate-500" />
        <span className="flex-1 text-left">Search locations...</span>
        <kbd className="font-mono text-[10px] bg-dark-900 px-1.5 py-0.5 rounded text-slate-500 border border-slate-800">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* API Health */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className={`w-2 h-2 rounded-full ${health === true ? 'bg-emerald-400' : health === false ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'}`} />
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {health === true ? 'API Online' : health === false ? 'Offline' : 'Connecting'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* User profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            {isAdmin ? <Shield className="w-3.5 h-3.5 text-brand-400" /> : <User className="w-3.5 h-3.5 text-slate-400" />}
            <span className="font-medium truncate max-w-[100px]">{user?.username}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={LogOut}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-400"
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
