import { useState } from 'react';
import { Card, PrimaryButton, SecondaryLink } from '../components/Common';
import Toast from '../components/Toast';
import { labelStyle, inputStyle, COLORS } from '../theme';
import { useLookups } from '../lookups/LookupsContext';
import { create } from '../api/entities';

const rowInputStyle = { width: '100%', fontSize: 13, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '8px 10px', color: COLORS.text };

export default function TracoForm({ onCancel, onSubmitted }) {
  const { reload } = useLookups();
  const [form, setForm] = useState({ codigo: '', classe: '', aplicacao: '', slump_alvo_mm: '', consumo_cimento_kg_m3: '', status: 'Ativo' });
  const [items, setItems] = useState([{ insumo: '', quantidade: '', unidade: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function updateItem(idx, field, value) {
    setItems((its) => its.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((its) => its.concat([{ insumo: '', quantidade: '', unidade: '' }]));
  }
  function removeItem(idx) {
    setItems((its) => its.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const insumos = items
        .filter((it) => it.insumo && it.quantidade && it.unidade)
        .map((it) => ({ insumo: it.insumo, quantidade: Number(it.quantidade), unidade: it.unidade }));
      await create('tracos', {
        codigo: form.codigo,
        classe: form.classe,
        aplicacao: form.aplicacao || undefined,
        slump_alvo_mm: form.slump_alvo_mm ? Number(form.slump_alvo_mm) : undefined,
        consumo_cimento_kg_m3: form.consumo_cimento_kg_m3 ? Number(form.consumo_cimento_kg_m3) : undefined,
        status: form.status,
        insumos,
      });
      setToast('Traço cadastrado com os insumos registrados.');
      await reload();
      setTimeout(onSubmitted, 1000);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { key: 'codigo', label: 'Código do Traço', placeholder: 'Ex.: TR-30-S100' },
    { key: 'classe', label: 'Classe (fck)', placeholder: 'Ex.: fck 30 MPa' },
    { key: 'aplicacao', label: 'Aplicação', placeholder: 'Ex.: Estrutura convencional' },
    { key: 'slump_alvo_mm', label: 'Slump Alvo (mm)', placeholder: 'Ex.: 100' },
    { key: 'consumo_cimento_kg_m3', label: 'Consumo de Cimento (kg/m³)', placeholder: 'Ex.: 360' },
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      <SecondaryLink onClick={onCancel}>&larr; Voltar para Traço / Formulação</SecondaryLink>
      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.map((f) => (
              <div key={f.key}>
                <div style={labelStyle}>{f.label}</div>
                <input
                  required={f.key === 'codigo' || f.key === 'classe'}
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <div style={labelStyle}>Status</div>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)} style={inputStyle}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
        </Card>
        <Card style={{ overflowX: 'auto', overflowY: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Insumos do Traço (por m³)</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.primary, cursor: 'pointer' }} onClick={addItem}>
              + Adicionar Insumo
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Insumo</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 130 }}>Quantidade</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 110 }}>Unidade</th>
                <th style={{ width: 36 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
                  <td style={{ padding: '8px 16px' }}>
                    <input placeholder="Ex.: Cimento CP-II" value={it.insumo} onChange={(e) => updateItem(idx, 'insumo', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input value={it.quantidade} onChange={(e) => updateItem(idx, 'quantidade', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input placeholder="kg, L..." value={it.unidade} onChange={(e) => updateItem(idx, 'unidade', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', color: COLORS.danger, fontWeight: 700, cursor: 'pointer' }} onClick={() => removeItem(idx)}>
                    ×
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Cadastrar Traço'}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
