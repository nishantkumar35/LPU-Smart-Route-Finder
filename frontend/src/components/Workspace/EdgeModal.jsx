import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EMPTY_FORM = { from: '', to: '', weight: '', directed: false };

export default function EdgeModal({ isOpen, onClose, edge, nodes = [], onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (edge) {
      setForm({
        from:     edge.from?._id || edge.from,
        to:       edge.to?._id   || edge.to,
        weight:   edge.weight,
        directed: edge.directed,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [edge, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.from === form.to) {
      return alert('From and To locations cannot be the same');
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        weight: parseFloat(form.weight),
      });
      onClose();
    } catch {
      // Handled by caller
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={edge ? 'Edit Road Connection' : 'Add Road Connection'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            From Location
          </label>
          <select
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            className="ui-select"
            required
          >
            <option value="">Select origin...</option>
            {nodes.map((n) => (
              <option key={n._id} value={n._id}>
                {n.name} ({n.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            To Location
          </label>
          <select
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            className="ui-select"
            required
          >
            <option value="">Select destination...</option>
            {nodes.filter((n) => n._id !== form.from).map((n) => (
              <option key={n._id} value={n._id}>
                {n.name} ({n.type})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Road Distance (Metres)"
          type="number"
          step="any"
          min="0"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          placeholder="e.g. 180"
          required
        />

        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-900 border border-slate-800">
          <input
            type="checkbox"
            id="directed"
            checked={form.directed}
            onChange={(e) => setForm({ ...form, directed: e.target.checked })}
            className="w-4 h-4 rounded bg-dark-800 border-slate-700 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="directed" className="text-xs text-slate-300 select-none cursor-pointer">
            One-way road (Directed Edge)
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={saving} className="flex-1">
            {edge ? 'Save Connection' : 'Create Connection'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
