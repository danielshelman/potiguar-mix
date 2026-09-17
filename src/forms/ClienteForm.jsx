import { useState } from 'react';
import { Card, PrimaryButton, SecondaryLink } from '../components/Common';
import Toast from '../components/Toast';
import { labelStyle, inputStyle, COLORS } from '../theme';
import { useFilial } from '../filial/FilialContext';
import { useLookups } from '../lookups/LookupsContext';
import { create } from '../api/entities';

export default function ClienteForm({ onCancel, onSubmitted }) {
  const { filialId } = useFilial();
  const { tracos, filiais, reload } = useLookups();
  const [form, setForm] = useState({ nome: '', cnpj: '', segmento: '', contato: '' });
  const [filialOverride, setFilialOverride] = useState(filialId !== 'todas' ? String(filialId) : '');
  const [selectedTracos, setSelectedTracos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleTraco(id) {
    setSelectedTracos((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat([id])));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!filialOverride) {
      setError('Selecione uma filial.');
      return;
    }
    setSaving(true);
    try {
      const cliente = await create('clientes', { ...form, filial_id: Number(filialOverride) });
      for (const tracoId of selectedTracos) {
        await create('cliente-tracos', { cliente_id: cliente.id, traco_id: Number(tracoId) });
      }
      setToast('Cliente cadastrado e traços vinculados.');
      await reload();
      setTimeout(onSubmitted, 1000);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { key: 'nome', label: 'Nome do Cliente', placeholder: 'Razão social' },
    { key: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0001-00' },
    { key: 'segmento', label: 'Segmento', placeholder: 'Ex.: Construção Civil - Edificações' },
    { key: 'contato', label: 'Contato', placeholder: 'Nome do contato comercial' },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <SecondaryLink onClick={onCancel}>&larr; Voltar para Clientes</SecondaryLink>
      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Filial *</div>
              <select required value={filialOverride} onChange={(e) => setFilialOverride(e.target.value)} style={inputStyle}>
                <option value="">Selecionar…</option>
                {Object.entries(filiais).map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
            {fields.map((f) => (
              <div key={f.key}>
                <div style={labelStyle}>{f.label}</div>
                <input
                  required
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Traços Vinculados</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(tracos).map(([id, codigo]) => {
              const active = selectedTracos.includes(id);
              return (
                <div
                  key={id}
                  onClick={() => toggleTraco(id)}
                  style={{
                    padding: '8px 13px',
                    borderRadius: 4,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
                    background: active ? COLORS.primary : COLORS.white,
                    color: active ? COLORS.white : COLORS.textMuted,
                  }}
                >
                  {codigo}
                </div>
              );
            })}
          </div>
        </Card>
        {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Cadastrar Cliente'}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
