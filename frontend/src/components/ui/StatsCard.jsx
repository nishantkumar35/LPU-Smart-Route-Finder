// Stat card for dashboard metrics
export default function StatsCard({ icon: Icon, label, value, sub, color = 'blue', trend }) {
  const colorMap = {
    blue: {
      bg: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.25)',
      icon: '#3b82f6',
      glow: 'rgba(59,130,246,0.25)',
    },
    purple: {
      bg: 'rgba(139,92,246,0.12)',
      border: 'rgba(139,92,246,0.25)',
      icon: '#8b5cf6',
      glow: 'rgba(139,92,246,0.25)',
    },
    emerald: {
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      icon: '#10b981',
      glow: 'rgba(16,185,129,0.25)',
    },
    amber: {
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.25)',
      icon: '#f59e0b',
      glow: 'rgba(245,158,11,0.25)',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className="stat-card group cursor-default"
      style={{
        background: 'rgba(30,41,59,0.5)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: c.bg, boxShadow: `0 0 20px ${c.glow}` }}
        >
          <Icon size={20} style={{ color: c.icon }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
