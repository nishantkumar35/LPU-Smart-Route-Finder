import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, CornerDownLeft } from 'lucide-react';
import Badge, { TYPE_STYLES } from '../ui/Badge';

// Type dot color per location type
const TYPE_DOT = {
  academic:   '#60a5fa',
  hostel:     '#a78bfa',
  canteen:    '#fbbf24',
  gate:       '#34d399',
  sports:     '#f87171',
  admin:      '#818cf8',
  library:    '#f472b6',
  recreation: '#22d3ee',
  medical:    '#fb7185',
  facility:   '#2dd4bf',
  other:      '#64748b',
};

export default function CommandPalette({ isOpen, onClose, nodes = [], onSelectNode }) {
  const [query, setQuery]               = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const filtered = nodes
    .filter((n) =>
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.type.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectNode(filtered[selectedIndex]);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg bg-dark-800 border border-dark-600 rounded-2xl shadow-dropdown z-10 animate-scale-in overflow-hidden">

        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dark-700">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search campus locations..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-slate-600 bg-dark-900 border border-dark-700 rounded-lg">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {query && filtered.length === 0 ? (
            <div className="py-10 text-center">
              <MapPin className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No locations match <span className="text-slate-400 font-medium">"{query}"</span></p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {(query ? filtered : nodes.slice(0, 8)).map((node, i) => {
                const isSelected = i === selectedIndex;
                const dotColor = TYPE_DOT[node.type] || TYPE_DOT.other;
                return (
                  <button
                    key={node._id}
                    onClick={() => { onSelectNode(node); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100 ${
                      isSelected ? 'bg-dark-750 text-slate-100' : 'text-slate-400 hover:bg-dark-750/60 hover:text-slate-200'
                    }`}
                  >
                    {/* Type dot */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dotColor, boxShadow: isSelected ? `0 0 6px ${dotColor}` : 'none' }}
                    />
                    <span className="flex-1 text-xs font-medium truncate">{node.name}</span>
                    <Badge type={node.type} size="sm" />
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-dark-900/60 border-t border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-dark-800 px-1.5 py-0.5 rounded border border-dark-600 text-slate-500">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-dark-800 px-1.5 py-0.5 rounded border border-dark-600 text-slate-500">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-[11px] text-slate-600">
            {filtered.length > 0 ? `${filtered.length} results` : `${nodes.length} locations`}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
