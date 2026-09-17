import { useState } from 'react';
import { Card, PrimaryButton, SecondaryLink } from './Common';
import Toast from './Toast';
import { labelStyle, inputStyle } from '../theme';
import { useLookups } from '../lookups/LookupsContext';
import { useFilial } from '../filial/FilialContext';

function optionsFromLookup(lookupMap) {
  return Object.entries(lookupMap || {})
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function GenericCreateForm({ fields, onSubmit, onCancel, submitLabel = 'Salvar', requireFilial = false }) {
  const lookups = useLookups();
  const { filialId } = useFilial();
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.key] = f.default ?? '';
    });
    return initial;
  });
  const [filialOverride, setFilialOverride] = useState(filialId !== 'todas' ? String(filialId) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (requireFilial && !filialOverride) {
      setError('Selecione uma filial.');
      return;
    }
    setSaving(true);
    try {
      const payload = {};
      fields.forEach((f) => {
        const v = values[f.key];
        if (v !== '' && v !== undefined) payload[f.key] = f.type === 'number' ? Number(v) : v;
      });
      if (requireFilial) payload.filial_id = Number(filialOverride);
      await onSubmit(payload);
      setToast('Registro criado com sucesso.');
      setTimeout(() => onCancel?.(), 1200);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {onCancel && <SecondaryLink onClick={onCancel}>&larr; Voltar</SecondaryLink>}
      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {requireFilial && (
              <div>
                <div style={labelStyle}>Filial *</div>
                <select
                  required
                  value={filialOverride}
                  onChange={(e) => setFilialOverride(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Selecionar…</option>
                  {optionsFromLookup(lookups.filiais).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {fields.map((f) => (
              <div key={f.key} style={f.fullWidth ? { gridColumn: '1 / -1' } : undefined}>
                <div style={labelStyle}>
                  {f.label}
                  {f.required ? ' *' : ''}
                </div>
                {f.type === 'select' ? (
                  <select
                    required={f.required}
                    value={values[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Selecionar…</option>
                    {(f.options || optionsFromLookup(lookups[f.optionsFrom])).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    required={f.required}
                    value={values[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    style={{ ...inputStyle, minHeight: 70, fontWeight: 500 }}
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    step={f.type === 'number' ? 'any' : undefined}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
        {error && <div style={{ color: '#B3261E', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Salvando…' : submitLabel}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
