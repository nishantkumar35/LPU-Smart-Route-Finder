import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';

export default function CommandPalette({ isOpen, onClose, nodes = [], onSelectNode }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = nodes.filter((n) =>
    n.name.toLowerCase().includes(query.toLowerCase()) ||
    n.type.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectNode(filtered[selectedIndex]);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs animate-fade-in" onClick={onClose} />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-dark-800 border border-slate-800 rounded-xl shadow-dropdown z-10 overflow-hidden animate-scale-in">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800/80 gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search any campus location or block... (Type to filter)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-dark-900 border border-slate-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching locations found for "{query}"
            </div>
          ) : (
            filtered.map((node, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={node._id}
                  onClick={() => {
                    onSelectNode(node);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors duration-100 ${
                    isSelected ? 'bg-brand-500/15 text-slate-100' : 'text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                    <span className="font-medium truncate">{node.name}</span>
                    <Badge type={node.type} size="sm" />
                  </div>
                  {isSelected && <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-dark-900 border-t border-slate-800/80 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-dark-800 px-1 rounded border border-slate-800">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-dark-800 px-1 rounded border border-slate-800">↵</kbd> Select</span>
          </div>
          <span>{filtered.length} locations</span>
        </div>
      </div>
    </div>
  );
}
