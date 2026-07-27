import { useState, useEffect, useRef } from 'react';
import { Navigation, Clock, Ruler, ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function RoutePanel({ nodes = [], selectedSource, selectedDest, onSelectSource, onSelectDest, onPathCalculated }) {
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [algo, setAlgo] = useState('dijkstra');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const animTimerRef = useRef(null);

  // Sync external selection from CommandPalette or Map click
  useEffect(() => {
    if (selectedSource) setSource(selectedSource);
  }, [selectedSource]);

  useEffect(() => {
    if (selectedDest) setDest(selectedDest);
  }, [selectedDest]);

  // Step animation controller
  useEffect(() => {
    if (!result?.steps?.length) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);

    const totalSteps = result.steps.length;
    const tick = (current) => {
      if (current >= totalSteps) return;
      animTimerRef.current = setTimeout(() => {
        setAnimStep(current + 1);
        tick(current + 1);
      }, 100);
    };

    tick(animStep);

    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const findRoute = async () => {
    if (!source || !dest) return toast.error('Please select both a source and destination');
    if (source === dest) return toast.error('Source and destination must be different');

    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setAnimStep(0);
    setResult(null);
    if (onPathCalculated) onPathCalculated([]);
    setLoading(true);

    try {
      const { data } = await api.post('/route', { sourceId: source, destId: dest, algorithm: algo });
      setResult(data);
      if (data.reachable) {
        toast.success(`Route calculated! ${data.distance}m (${data.estimatedTimeMinutes} min)`);
        if (onPathCalculated) onPathCalculated(data.path || []);
      } else {
        toast.error('No path exists between the selected locations');
        if (onPathCalculated) onPathCalculated([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to calculate route');
      if (onPathCalculated) onPathCalculated([]);
    } finally {
      setLoading(false);
    }
  };

  const pathNodes = result?.path?.map((id) => nodes.find((n) => String(n._id) === String(id))).filter(Boolean) || [];
  const stepsToShow = result?.steps?.slice(0, animStep) || [];

  return (
    <div className="space-y-4">
      {/* Route Form Card */}
      <div className="ui-card p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
          <Navigation className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Route Configuration</h3>
        </div>

        {/* Source Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Source Origin
          </label>
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              if (onSelectSource) onSelectSource(e.target.value);
              if (onPathCalculated) onPathCalculated([]);
            }}
            className="ui-select"
          >
            <option value="">Select origin...</option>
            {nodes.map((n) => (
              <option key={n._id} value={n._id}>
                {n.name} ({n.type})
              </option>
            ))}
          </select>
        </div>

        {/* Destination Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Destination Target
          </label>
          <select
            value={dest}
            onChange={(e) => {
              setDest(e.target.value);
              if (onSelectDest) onSelectDest(e.target.value);
              if (onPathCalculated) onPathCalculated([]);
            }}
            className="ui-select"
          >
            <option value="">Select destination...</option>
            {nodes.map((n) => (
              <option key={n._id} value={n._id}>
                {n.name} ({n.type})
              </option>
            ))}
          </select>
        </div>

        {/* Algorithm Segment */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Algorithm Engine
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'dijkstra', label: 'Dijkstra', desc: 'Guaranteed' },
              { id: 'astar',    label: 'A* (A-Star)', desc: 'Heuristic' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAlgo(opt.id)}
                className={`p-2 rounded-lg text-left border transition-all duration-150 ${
                  algo === opt.id
                    ? 'bg-brand-500/10 border-brand-500/50 text-slate-100'
                    : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={findRoute}
          loading={loading}
          disabled={!source || !dest}
          className="w-full mt-1"
        >
          Calculate Shortest Path
        </Button>
      </div>

      {/* Result Metrics */}
      {result && (
        <div className="ui-card p-4 space-y-3 animate-fade-in">
          {result.reachable ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Optimal Route Found</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {result.algorithm}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-center">
                  <Ruler className="w-3.5 h-3.5 mx-auto mb-1 text-brand-400" />
                  <div className="text-sm font-bold text-slate-100">{result.distance}m</div>
                  <div className="text-[10px] text-slate-500">Distance</div>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-center">
                  <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                  <div className="text-sm font-bold text-slate-100">{result.estimatedTimeMinutes}m</div>
                  <div className="text-[10px] text-slate-500">Est. Walk</div>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-center">
                  <Navigation className="w-3.5 h-3.5 mx-auto mb-1 text-violet-400" />
                  <div className="text-sm font-bold text-slate-100">{result.stops}</div>
                  <div className="text-[10px] text-slate-500">Stops</div>
                </div>
              </div>

              {/* Path List */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Path Traversal ({pathNodes.length} nodes)
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {pathNodes.map((n, idx) => (
                    <div key={n._id} className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                          idx === 0 ? 'bg-emerald-500' : idx === pathNodes.length - 1 ? 'bg-rose-500' : 'bg-brand-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-200 truncate">{n.name}</span>
                      </div>
                      <Badge type={n.type} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-200">No Connection Exists</p>
              <p className="text-[11px] text-slate-500 mt-0.5">These locations are disconnected in the graph.</p>
            </div>
          )}
        </div>
      )}

      {/* Algorithm Step Trace */}
      {result?.steps?.length > 0 && (
        <div className="ui-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Algorithm Execution Trace</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {Math.min(animStep, result.steps.length)} / {result.steps.length}
            </span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 text-xs">
            {stepsToShow.map((step, i) => {
              const fromName = step.from ? nodes.find((n) => n._id === step.from)?.name : null;
              const toName   = step.to   ? nodes.find((n) => n._id === step.to)?.name   : null;
              const nodeName = step.nodeId ? nodes.find((n) => n._id === step.nodeId)?.name : null;

              return (
                <div key={i} className="p-1.5 rounded bg-dark-900 border border-slate-800 text-[11px] text-slate-400">
                  {step.type === 'visit' && (
                    <span>Visiting <span className="text-brand-300 font-medium">{nodeName || step.nodeId}</span></span>
                  )}
                  {step.type === 'relax' && (
                    <span className="flex items-center gap-1">
                      <span>Relax {fromName} → {toName}</span>
                      <span className="ml-auto font-mono text-amber-400">{step.newDist}m</span>
                    </span>
                  )}
                  {step.type === 'final-path' && (
                    <span className="text-emerald-400 font-medium">Path calculation complete!</span>
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
