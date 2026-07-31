import { useState, useEffect, useRef } from 'react';
import { Navigation, Clock, Ruler, CheckCircle2, XCircle, Zap, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function RoutePanel({ nodes = [], selectedSource, selectedDest, onSelectSource, onSelectDest, onPathCalculated }) {
  const [source, setSource]   = useState('');
  const [dest, setDest]       = useState('');
  const [algo, setAlgo]       = useState('dijkstra');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const animTimerRef = useRef(null);

  useEffect(() => { if (selectedSource) setSource(selectedSource); }, [selectedSource]);
  useEffect(() => { if (selectedDest)   setDest(selectedDest);     }, [selectedDest]);

  useEffect(() => {
    if (!result?.steps?.length) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    const tick = (current) => {
      if (current >= result.steps.length) return;
      animTimerRef.current = setTimeout(() => { setAnimStep(current + 1); tick(current + 1); }, 100);
    };
    tick(animStep);
    return () => { if (animTimerRef.current) clearTimeout(animTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const findRoute = async () => {
    if (!source || !dest) return toast.error('Select both origin and destination');
    if (source === dest)  return toast.error('Origin and destination must differ');
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setAnimStep(0);
    setResult(null);
    if (onPathCalculated) onPathCalculated([]);
    setLoading(true);
    try {
      const { data } = await api.post('/route', { sourceId: source, destId: dest, algorithm: algo });
      setResult(data);
      if (data.reachable) {
        toast.success(`Route found — ${data.distance}m · ${data.estimatedTimeMinutes} min walk`);
        if (onPathCalculated) onPathCalculated(data.path || []);
      } else {
        toast.error('No path exists between these locations');
        if (onPathCalculated) onPathCalculated([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to calculate route');
      if (onPathCalculated) onPathCalculated([]);
    } finally {
      setLoading(false);
    }
  };

  const pathNodes   = result?.path?.map((id) => nodes.find((n) => String(n._id) === String(id))).filter(Boolean) || [];
  const stepsToShow = result?.steps?.slice(0, animStep) || [];

  const sourceNode = nodes.find((n) => n._id === source);
  const destNode   = nodes.find((n) => n._id === dest);

  const selectClass = 'w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 appearance-none focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 transition-all cursor-pointer';

  return (
    <div className="space-y-3 animate-fade-in">

      {/* ── From → To card ──────────────────────────── */}
      <div className="ui-card p-4 space-y-3">
        {/* Origin */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-teal-400 ring-2 ring-teal-400/25" />
            <div className="w-px flex-1 bg-dark-600 my-1 min-h-[2.5rem]" />
            <div className="w-3 h-3 rounded-full bg-brand-400 ring-2 ring-brand-400/25" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <label className="ui-label">From</label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => { setSource(e.target.value); if (onSelectSource) onSelectSource(e.target.value); if (onPathCalculated) onPathCalculated([]); }}
                  className={selectClass}
                >
                  <option value="">Select origin...</option>
                  {nodes.map((n) => (
                    <option key={n._id} value={n._id}>{n.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="ui-label">To</label>
              <div className="relative">
                <select
                  value={dest}
                  onChange={(e) => { setDest(e.target.value); if (onSelectDest) onSelectDest(e.target.value); if (onPathCalculated) onPathCalculated([]); }}
                  className={selectClass}
                >
                  <option value="">Select destination...</option>
                  {nodes.map((n) => (
                    <option key={n._id} value={n._id}>{n.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm picker */}
        <div className="pt-1">
          <label className="ui-label">Algorithm</label>
          <div className="flex gap-1.5 p-1 bg-dark-900 rounded-xl border border-dark-700">
            {[
              { id: 'dijkstra', label: 'Dijkstra', hint: 'Exact' },
              { id: 'astar',    label: 'A* Search',  hint: 'Fast'  },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAlgo(opt.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  algo === opt.id
                    ? 'bg-dark-750 text-slate-100 border border-dark-600'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`text-[10px] px-1.5 py-px rounded-full font-mono ${
                  algo === opt.id ? 'bg-brand-500/15 text-brand-400' : 'text-slate-700'
                }`}>
                  {opt.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={findRoute}
          loading={loading}
          disabled={!source || !dest}
          className="w-full"
          icon={Navigation}
        >
          Find Route
        </Button>
      </div>

      {/* ── Route Result ─────────────────────────────── */}
      {result && (
        <div className="animate-slide-up">
          {result.reachable ? (
            <div className="ui-card-accent p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Route Found</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {result.algorithm}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Ruler,      value: `${result.distance}m`,              label: 'Distance',  color: 'text-brand-400' },
                  { icon: Clock,      value: `${result.estimatedTimeMinutes}m`,   label: 'Walk time', color: 'text-teal-400'  },
                  { icon: Navigation, value: result.stops,                         label: 'Stops',     color: 'text-slate-400' },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="p-2.5 rounded-xl bg-dark-900 border border-dark-700 text-center">
                    <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${color}`} />
                    <div className="text-sm font-bold text-slate-100">{value}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Timeline path */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  Route — {pathNodes.length} stops
                </div>
                <div className="max-h-44 overflow-y-auto space-y-0 pr-1">
                  {pathNodes.map((n, idx) => {
                    const isFirst = idx === 0;
                    const isLast  = idx === pathNodes.length - 1;
                    return (
                      <div key={n._id} className="flex items-start gap-3">
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center shrink-0 pt-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ${
                            isFirst ? 'bg-teal-400 ring-teal-400/25' :
                            isLast  ? 'bg-brand-400 ring-brand-400/25' :
                                      'bg-dark-600 ring-dark-600/25'
                          }`} />
                          {!isLast && <div className="w-px bg-dark-700 flex-1 mt-1" style={{ minHeight: '20px' }} />}
                        </div>
                        {/* Stop info */}
                        <div className="flex-1 flex items-center justify-between py-2 min-w-0">
                          <span className={`text-xs font-medium truncate ${isFirst || isLast ? 'text-slate-100' : 'text-slate-400'}`}>
                            {n.name}
                          </span>
                          <Badge type={n.type} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="ui-card p-6 text-center">
              <XCircle className="w-8 h-8 text-rose-500/70 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-200">No path found</p>
              <p className="text-xs text-slate-500 mt-1">These locations are disconnected in the graph.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Algorithm trace ───────────────────────────── */}
      {result?.steps?.length > 0 && (
        <div className="ui-card p-4 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              <span>Step Trace</span>
            </div>
            <span className="text-[10px] font-mono text-slate-600">
              {Math.min(animStep, result.steps.length)}/{result.steps.length}
            </span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 pr-0.5">
            {stepsToShow.map((step, i) => {
              const fromName = step.from   ? nodes.find((n) => n._id === step.from)?.name   : null;
              const toName   = step.to     ? nodes.find((n) => n._id === step.to)?.name     : null;
              const nodeName = step.nodeId ? nodes.find((n) => n._id === step.nodeId)?.name : null;
              return (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-dark-900 border border-dark-700 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    step.type === 'final-path' ? 'bg-teal-400' :
                    step.type === 'visit'      ? 'bg-brand-400' :
                                                 'bg-slate-700'
                  }`} />
                  {step.type === 'visit' && (
                    <span className="text-slate-500">Visit <span className="text-slate-300 font-medium">{nodeName || step.nodeId}</span></span>
                  )}
                  {step.type === 'relax' && (
                    <span className="text-slate-600 flex-1">Relax {fromName} → {toName} <span className="ml-1 font-mono text-brand-400">{step.newDist}m</span></span>
                  )}
                  {step.type === 'final-path' && (
                    <span className="text-teal-400 font-semibold">Path complete</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
