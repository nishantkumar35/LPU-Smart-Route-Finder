import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowRight, ArrowLeftRight } from 'lucide-react';
import Button from '../ui/Button';
import Badge, { TYPE_STYLES } from '../ui/Badge';
import Tabs from '../ui/Tabs';
import Modal from '../ui/Modal';
import NodeModal from './NodeModal';
import EdgeModal from './EdgeModal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function DataStudioPanel({ nodes = [], edges = [], onRefresh, isAdmin }) {
  const [activeSubTab, setActiveSubTab] = useState('locations');
  const [search, setSearch]             = useState('');
  const [typeFilter, setTypeFilter]     = useState('all');

  const [nodeModal,      setNodeModal]      = useState({ open: false, node: null });
  const [edgeModal,      setEdgeModal]      = useState({ open: false, edge: null });
  const [deleteConfirm,  setDeleteConfirm]  = useState({ open: false, type: null, item: null });
  const [deleting,       setDeleting]       = useState(false);

  const handleSaveNode = async (payload) => {
    try {
      if (nodeModal.node) {
        await api.put(`/nodes/${nodeModal.node._id}`, payload);
        toast.success('Location updated');
      } else {
        await api.post('/nodes', payload);
        toast.success('Location created');
      }
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save location');
      throw err;
    }
  };

  const handleSaveEdge = async (payload) => {
    try {
      if (edgeModal.edge) {
        await api.put(`/edges/${edgeModal.edge._id}`, payload);
        toast.success('Connection updated');
      } else {
        await api.post('/edges', payload);
        toast.success('Connection created');
      }
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save connection');
      throw err;
    }
  };

  const handleDeleteItem = async () => {
    const { type, item } = deleteConfirm;
    if (!item) return;
    setDeleting(true);
    try {
      if (type === 'node') {
        const { data } = await api.delete(`/nodes/${item._id}`);
        toast.success(`Deleted (${data.deletedEdges || 0} connected roads removed)`);
      } else {
        await api.delete(`/edges/${item._id}`);
        toast.success('Connection deleted');
      }
      setDeleteConfirm({ open: false, type: null, item: null });
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const filteredNodes = nodes.filter((n) => {
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === 'all' || n.type === typeFilter;
    return matchSearch && matchType;
  });

  const filteredEdges = edges.filter((e) => {
    const fromName = e.from?.name || '';
    const toName   = e.to?.name   || '';
    return fromName.toLowerCase().includes(search.toLowerCase()) ||
           toName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-3 animate-fade-in">

      {/* ── Sub-tabs + Add ───────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <Tabs
            tabs={[
              { id: 'locations', label: 'Locations', badge: nodes.length },
              { id: 'roads',     label: 'Roads',     badge: edges.length },
            ]}
            activeTab={activeSubTab}
            onChange={(tab) => { setActiveSubTab(tab); setSearch(''); setTypeFilter('all'); }}
          />
        </div>
        {isAdmin && (
          <Button
            size="sm"
            icon={Plus}
            onClick={() => {
              if (activeSubTab === 'locations') setNodeModal({ open: true, node: null });
              else setEdgeModal({ open: true, edge: null });
            }}
          >
            Add
          </Button>
        )}
      </div>

      {/* ── Search + filter ──────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeSubTab === 'locations' ? 'Filter locations...' : 'Filter roads...'}
            className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 transition-all"
          />
        </div>
        {activeSubTab === 'locations' && (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500/60 appearance-none cursor-pointer"
          >
            <option value="all">All types</option>
            {Object.keys(TYPE_STYLES).map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── List ─────────────────────────────────────── */}
      <div className="ui-card overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto">
        {activeSubTab === 'locations' ? (
          filteredNodes.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No locations match your filter</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-700/60">
              {filteredNodes.map((node) => (
                <div
                  key={node._id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-dark-750/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    {/* Type dot */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: TYPE_STYLES[node.type]?.color || '#64748b' }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">{node.name}</div>
                      <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                        {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge type={node.type} size="sm" />
                    {isAdmin && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setNodeModal({ open: true, node })}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-400 hover:bg-dark-700 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ open: true, type: 'node', item: node })}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-dark-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredEdges.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No connections match your filter</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-700/60">
              {filteredEdges.map((edge) => (
                <div
                  key={edge._id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-dark-750/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 overflow-hidden min-w-0 text-xs">
                    <span className="font-medium text-slate-300 truncate max-w-[90px]">{edge.from?.name || '—'}</span>
                    {edge.directed
                      ? <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      : <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    }
                    <span className="font-medium text-slate-300 truncate max-w-[90px]">{edge.to?.name || '—'}</span>
                    <span className="ml-1 px-1.5 py-0.5 font-mono text-[10px] bg-dark-900 border border-dark-700 text-slate-500 rounded-lg shrink-0">
                      {edge.weight}m
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => setEdgeModal({ open: true, edge })}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-brand-400 hover:bg-dark-700 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, type: 'edge', item: edge })}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-dark-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Modals ───────────────────────────────────── */}
      <NodeModal
        isOpen={nodeModal.open}
        onClose={() => setNodeModal({ open: false, node: null })}
        node={nodeModal.node}
        onSave={handleSaveNode}
      />

      <EdgeModal
        isOpen={edgeModal.open}
        onClose={() => setEdgeModal({ open: false, edge: null })}
        edge={edgeModal.edge}
        nodes={nodes}
        onSave={handleSaveEdge}
      />

      <Modal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, item: null })}
        title="Confirm deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Delete{' '}
            <strong className="text-slate-100 font-semibold">
              {deleteConfirm.type === 'node'
                ? deleteConfirm.item?.name
                : `${deleteConfirm.item?.from?.name} → ${deleteConfirm.item?.to?.name}`}
            </strong>?
          </p>
          {deleteConfirm.type === 'node' && (
            <p className="text-xs text-rose-400/80 bg-rose-500/8 border border-rose-500/15 px-3 py-2 rounded-xl">
              All connected road segments will also be removed.
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDeleteConfirm({ open: false, type: null, item: null })} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDeleteItem} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
