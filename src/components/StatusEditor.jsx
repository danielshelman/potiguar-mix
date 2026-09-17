import { useState } from 'react';
import { statusColor } from '../theme';
import { update } from '../api/entities';

export default function StatusEditor({ resource, id, statusKey, value, options, onChanged }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const c = statusColor(value);

  async function handleChange(e) {
    const next = e.target.value;
    if (next === value) return;
    setSaving(true);
    setError(null);
    try {
      await update(resource, id, { [statusKey]: next });
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ textAlign: 'right' }}>
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: c,
          background: '#F5F7F6',
          border: `1px solid ${c}`,
          borderRadius: 4,
          padding: '5px 8px',
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <div style={{ color: '#B3261E', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
