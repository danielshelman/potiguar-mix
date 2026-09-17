import { useState } from 'react';
import { Card, PrimaryButton } from '../components/Common';
import Toast from '../components/Toast';
import { labelStyle, inputStyle, COLORS } from '../theme';
import { useFilial } from '../filial/FilialContext';
import { useAuth } from '../auth/AuthContext';
import { useLookups } from '../lookups/LookupsContext';
import { create } from '../api/entities';

const rowInputStyle = { width: '100%', fontSize: 13, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '8px 10px', color: COLORS.text };

export default function SolicitacaoCompraScreen() {
  const { filialId } = useFilial();
  const { filiais } = useLookups();
  const { usuario } = useAuth();
  const [filialOverride, setFilialOverride] = useState(filialId !== 'todas' ? String(filialId) : '');
  const [observacao, setObservacao] = useState('');
  const [items, setItems] = useState([{ descricao: '', quantidade: '', unidade: '', valor_estimado: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  function updateItem(idx, field, value) {
    setItems((its) => its.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((its) => its.concat([{ descricao: '', quantidade: '', unidade: '', valor_estimado: '' }]));
  }
  function removeItem(idx) {
    setItems((its) => its.filter((_, i) => i !== idx));
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
      const itens = items
        .filter((it) => it.descricao && it.quantidade && it.unidade)
        .map((it) => ({
          descricao: it.descricao,
          quantidade: Number(it.quantidade),
          unidade: it.unidade,
          valor_estimado: it.valor_estimado ? Number(it.valor_estimado) : undefined,
        }));
      if (itens.length === 0) throw new Error('Adicione ao menos um item.');
      await create('solicitacoes-compra', {
        filial_id: Number(filialOverride),
        solicitante_id: usuario.id,
        observacao: observacao || undefined,
        itens,
      });
      setToast('Solicitação enviada para aprovação.');
      setObservacao('');
      setItems([{ descricao: '', quantidade: '', unidade: '', valor_estimado: '' }]);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError(err.message || 'Não foi possível enviar a solicitação');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
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
            <div>
              <div style={labelStyle}>Solicitante</div>
              <div style={{ ...inputStyle, background: COLORS.bg }}>{usuario?.nome}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Observação / Justificativa</div>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: Reposição de estoque para atender obra CT-2026-014"
                style={{ ...inputStyle, minHeight: 70, fontWeight: 500 }}
              />
            </div>
          </div>
        </Card>
        <Card style={{ overflowX: 'auto', overflowY: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Itens Solicitados</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.primary, cursor: 'pointer' }} onClick={addItem}>
              + Adicionar Item
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Descrição</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 100 }}>Qtd.</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 110 }}>Unidade</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 150 }}>Valor Estimado</th>
                <th style={{ width: 36 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
                  <td style={{ padding: '8px 16px' }}>
                    <input value={it.descricao} onChange={(e) => updateItem(idx, 'descricao', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input type="number" value={it.quantidade} onChange={(e) => updateItem(idx, 'quantidade', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input value={it.unidade} onChange={(e) => updateItem(idx, 'unidade', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input type="number" value={it.valor_estimado} onChange={(e) => updateItem(idx, 'valor_estimado', e.target.value)} style={rowInputStyle} />
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
            {saving ? 'Enviando…' : 'Enviar Solicitação'}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
