import { MapPin, GitBranch, Zap, Activity } from 'lucide-react';
import Badge, { TYPE_STYLES } from '../ui/Badge';

export default function AnalyticsPanel({ nodes = [], edges = [] }) {
  // Count nodes by category
  const countsByType = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  const totalDirected = edges.filter((e) => e.directed).length;
  const totalTwoWay = edges.length - totalDirected;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Graph Overview Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="ui-card p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Locations</span>
            <MapPin className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{nodes.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Campus graph nodes</div>
        </div>

        <div className="ui-card p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Roads</span>
            <GitBranch className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{edges.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalTwoWay} two-way · {totalDirected} one-way</div>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="ui-card p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Location Distribution
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(TYPE_STYLES).map((type) => {
            const count = countsByType[type] || 0;
            if (count === 0 && type !== 'academic' && type !== 'hostel') return null;

            return (
              <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-slate-800 text-xs">
                <Badge type={type} size="sm" />
                <span className="font-mono font-semibold text-slate-300">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Algorithm Benchmark Card */}
      <div className="ui-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Algorithm Benchmark
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Dijkstra vs A*</span>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-200">
              <span>Dijkstra's Algorithm</span>
              <span className="text-brand-400 font-mono text-[11px]">O((V+E) log V)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Guarantees mathematically exact shortest paths by exploring all graph frontiers evenly.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-200">
              <span>A* Search Algorithm</span>
              <span className="text-emerald-400 font-mono text-[11px]">O(E log V)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Uses Haversine straight-line distance heuristic to prune unpromising paths faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
