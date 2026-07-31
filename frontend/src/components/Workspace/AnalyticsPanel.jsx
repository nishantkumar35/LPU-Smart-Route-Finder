import { MapPin, GitBranch, Zap } from 'lucide-react';
import { TYPE_STYLES } from '../ui/Badge';

export default function AnalyticsPanel({ nodes = [], edges = [] }) {
  const countsByType    = nodes.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {});
  const totalDirected   = edges.filter((e) => e.directed).length;
  const totalTwoWay     = edges.length - totalDirected;
  const maxCount        = Math.max(...Object.values(countsByType), 1);

  const typeCounts = Object.entries(TYPE_STYLES)
    .map(([type, style]) => ({ type, style, count: countsByType[type] || 0 }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-3 animate-fade-in">

      {/* ── Stat cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Locations */}
        <div className="ui-card-accent p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Locations</span>
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 leading-none">{nodes.length}</div>
          <div className="text-[11px] text-slate-600">Graph nodes</div>
        </div>

        {/* Roads */}
        <div className="ui-card p-4 space-y-2" style={{ borderLeft: '2px solid rgba(20,184,166,0.5)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Roads</span>
            <GitBranch className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 leading-none">{edges.length}</div>
          <div className="text-[11px] text-slate-600">{totalTwoWay} bi-dir · {totalDirected} one-way</div>
        </div>
      </div>

      {/* ── Location breakdown ──────────────────────── */}
      <div className="ui-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">By type</h3>
          <span className="text-[11px] text-slate-600">{typeCounts.length} categories</span>
        </div>

        <div className="space-y-2.5">
          {typeCounts.map(({ type, style, count }) => (
            <div key={type} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: style.color }}
                  />
                  <span className="text-slate-300 font-medium capitalize">{type}</span>
                </div>
                <span className="font-mono font-semibold text-slate-400">{count}</span>
              </div>
              {/* Progress bar */}
              <div className="h-1 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: style.color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Algorithm comparison ────────────────────── */}
      <div className="ui-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          <h3 className="text-sm font-semibold text-slate-200">Algorithms</h3>
        </div>

        <div className="space-y-2">
          {[
            {
              name:       "Dijkstra's",
              complexity: 'O((V+E) log V)',
              desc:       'Guarantees exact shortest paths by exploring all frontiers uniformly.',
              color:      'text-brand-400',
              bar:        75,
              barColor:   '#f59e0b',
            },
            {
              name:       'A* Search',
              complexity: 'O(E log V)',
              desc:       'Haversine heuristic prunes paths — faster in practice on sparse graphs.',
              color:      'text-teal-400',
              bar:        90,
              barColor:   '#14b8a6',
            },
          ].map((alg) => (
            <div key={alg.name} className="p-3 rounded-xl bg-dark-900 border border-dark-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{alg.name}</span>
                <code className={`text-[10px] font-mono ${alg.color}`}>{alg.complexity}</code>
              </div>
              {/* Speed bar */}
              <div className="h-1 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${alg.bar}%`, backgroundColor: alg.barColor, opacity: 0.6 }} />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{alg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
