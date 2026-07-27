import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, MapPin, GitBranch, ArrowRight, ArrowLeftRight } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge, { TYPE_STYLES } from '../ui/Badge';
import Tabs from '../ui/Tabs';
import Modal from '../ui/Modal';
import NodeModal from './NodeModal';
import EdgeModal from './EdgeModal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function DataStudioPanel({ nodes = [], edges = [], onRefresh, isAdmin }) {
  const [activeSubTab, setActiveSubTab] = useState('locations');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals state
  const [nodeModal, setNodeModal] = useState({ open: false, node: null });
  const [edgeModal, setEdgeModal] = useState({ open: false, edge: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, item: null });
  const [deleting, setDeleting] = useState(false);

  // Handlers for Node CRUD
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

  // Handlers for Edge CRUD
  const handleSaveEdge = async (payload) => {
    try {
      if (edgeModal.edge) {
        await api.put(`/edges/${edgeModal.edge._id}`, payload);
        toast.success('Road connection updated');
      } else {
        await api.post('/edges', payload);
        toast.success('Road connection created');
      }
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save connection');
      throw err;
    }
  };

  // Delete Action
  const handleDeleteItem = async () => {
    const { type, item } = deleteConfirm;
    if (!item) return;

    setDeleting(true);
    try {
      if (type === 'node') {
        const { data } = await api.delete(`/nodes/${item._id}`);
        toast.success(`Location deleted (${data.deletedEdges || 0} connected roads removed)`);
      } else {
        await api.delete(`/edges/${item._id}`);
        toast.success('Road connection deleted');
      }
      setDeleteConfirm({ open: false, type: null, item: null });
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete operation failed');
    } finally {
      setDeleting(false);
    }
  };

  // Filters
  const filteredNodes = nodes.filter((n) => {
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || n.type === typeFilter;
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
      {/* Sub-navigation & Actions */}
      <div className="flex items-center justify-between gap-2">
        <Tabs
          tabs={[
            { id: 'locations', label: 'Locations', icon: MapPin, badge: nodes.length },
            { id: 'roads',     label: 'Road Connections', icon: GitBranch, badge: edges.length },
          ]}
          activeTab={activeSubTab}
          onChange={(tab) => {
            setActiveSubTab(tab);
            setSearch('');
          }}
          className="flex-1"
        />

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => {
              if (activeSubTab === 'locations') setNodeModal({ open: true, node: null });
              else setEdgeModal({ open: true, edge: null });
            }}
            icon={Plus}
          >
            Add
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <Input
          placeholder={activeSubTab === 'locations' ? 'Filter locations...' : 'Filter road connections...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          containerClassName="flex-1"
        />
        {activeSubTab === 'locations' && (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="ui-select text-xs w-32"
          >
            <option value="all">All Types</option>
            {Object.keys(TYPE_STYLES).map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Main Data Studio List */}
      <div className="ui-card max-h-[calc(100vh-280px)] overflow-y-auto divide-y divide-slate-800/60">
        {activeSubTab === 'locations' ? (
          filteredNodes.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No locations match your filter.
            </div>
          ) : (
            filteredNodes.map((node) => (
              <div key={node._id} className="p-3 flex items-center justify-between hover:bg-dark-750 transition-colors group">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Badge type={node.type} size="sm" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">{node.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => setNodeModal({ open: true, node })}
                      className="p-1.5 rounded text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, type: 'node', item: node })}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )
        ) : (
          filteredEdges.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No road connections match your filter.
            </div>
          ) : (
            filteredEdges.map((edge) => (
              <div key={edge._id} className="p-3 flex items-center justify-between hover:bg-dark-750 transition-colors group">
                <div className="flex items-center gap-2 overflow-hidden text-xs">
                  <span className="font-medium text-slate-200 truncate">{edge.from?.name || '—'}</span>
                  {edge.directed ? (
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  ) : (
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="font-medium text-slate-200 truncate">{edge.to?.name || '—'}</span>
                  <span className="ml-1 px-1.5 py-0.2 font-mono text-[10px] bg-dark-900 border border-slate-800 text-slate-400 rounded shrink-0">
                    {edge.weight}m
                  </span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                    <button
                      onClick={() => setEdgeModal({ open: true, edge })}
                      className="p-1.5 rounded text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, type: 'edge', item: edge })}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>

      {/* Node Modal */}
      <NodeModal
        isOpen={nodeModal.open}
        onClose={() => setNodeModal({ open: false, node: null })}
        node={nodeModal.node}
        onSave={handleSaveNode}
      />

      {/* Edge Modal */}
      <EdgeModal
        isOpen={edgeModal.open}
        onClose={() => setEdgeModal({ open: false, edge: null })}
        edge={edgeModal.edge}
        nodes={nodes}
        onSave={handleSaveEdge}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, item: null })}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete{' '}
            <strong className="text-slate-100 font-semibold">
              {deleteConfirm.type === 'node' ? deleteConfirm.item?.name : `${deleteConfirm.item?.from?.name} → ${deleteConfirm.item?.to?.name}`}
            </strong>?
          </p>
          {deleteConfirm.type === 'node' && (
            <p className="text-[11px] text-slate-500 bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
              Warning: Deleting a location will automatically remove all road connections attached to it.
            </p>
          )}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm({ open: false, type: null, item: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              onClick={handleDeleteItem}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
