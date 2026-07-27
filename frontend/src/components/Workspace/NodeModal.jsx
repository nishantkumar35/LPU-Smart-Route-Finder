import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { TYPE_STYLES } from '../ui/Badge';

const EMPTY_FORM = { name: '', type: 'academic', lat: '', lng: '' };

export default function NodeModal({ isOpen, onClose, node, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (node) {
      setForm({ name: node.name, type: node.type, lat: node.lat, lng: node.lng });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [node, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
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
      title={node ? 'Edit Campus Location' : 'Add New Location'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Location Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Block 34 (Computer Science)"
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Location Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="ui-select"
          >
            {Object.keys(TYPE_STYLES).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            placeholder="31.2562"
            required
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            placeholder="75.7048"
            required
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={saving} className="flex-1">
            {node ? 'Save Changes' : 'Create Location'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
