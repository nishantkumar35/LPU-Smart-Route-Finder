import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Search, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

  const handleLogout = () => { logout(); navigate('/login'); };

  // Initials avatar
  const initials = user?.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <header className="h-14 bg-dark-900 border-b border-dark-700/80 px-4 flex items-center justify-between shrink-0 select-none z-20">

      {/* ── Brand ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-amber/60 shrink-0">
          <Navigation className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-sm text-slate-100 tracking-tight">SmartRoute</span>
          <span className="text-[10px] text-slate-500 font-medium tracking-wider">LPU Campus</span>
        </div>
        {/* Visual divider */}
        <div className="h-5 w-px bg-dark-700 ml-1 hidden sm:block" />
      </div>

      {/* ── Center search ─────────────────────────────── */}
      <button
        onClick={onOpenSearch}
        id="header-search-trigger"
        className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-dark-800 border border-dark-700 text-xs text-slate-500 hover:text-slate-300 hover:border-dark-600 hover:bg-dark-750 transition-all duration-150 w-64 group"
      >
        <Search className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
        <span className="flex-1 text-left">Search locations...</span>
        <kbd className="font-mono text-[10px] bg-dark-900/80 px-1.5 py-0.5 rounded-md text-slate-600 border border-dark-600">
          ⌘K
        </kbd>
      </button>

      {/* ── Right section ─────────────────────────────── */}
      <div className="flex items-center gap-2.5">

        {/* API status */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            health === true  ? 'bg-teal-400' :
            health === false ? 'bg-rose-500' :
                               'bg-amber-400 animate-pulse'
          }`} />
          <span className="text-[11px] text-slate-500 font-medium">
            {health === true ? 'Online' : health === false ? 'Offline' : 'Connecting'}
          </span>
        </div>

        <div className="h-4 w-px bg-dark-700 hidden sm:block" />

        {/* User info */}
        <div className="flex items-center gap-2">
          {/* Initials avatar */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
            isAdmin ? 'bg-brand-600' : 'bg-dark-600'
          }`}>
            {isAdmin ? <Shield className="w-3.5 h-3.5" /> : initials}
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">{user?.username}</span>
            <span className="text-[10px] text-slate-600">{isAdmin ? 'Administrator' : 'Viewer'}</span>
          </div>
        </div>

        <div className="h-4 w-px bg-dark-700" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150 text-xs font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
