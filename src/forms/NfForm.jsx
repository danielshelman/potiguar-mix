import { useState } from 'react';
import { Card, PrimaryButton, SecondaryLink } from '../components/Common';
import Toast from '../components/Toast';
import { labelStyle, inputStyle, COLORS } from '../theme';
import { useLookups } from '../lookups/LookupsContext';
import { useFilial } from '../filial/FilialContext';
import { create } from '../api/entities';
import { money, todayIso } from '../utils/format';

const rowInputStyle = { width: '100%', fontSize: 13, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '8px 10px', color: COLORS.text };

export default function NfForm({ onCancel, onSubmitted }) {
  const { fornecedores, filiais } = useLookups();
  const { filialId } = useFilial();
  const [header, setHeader] = useState({ tipo: 'NF-e', numero_documento: '', fornecedor_id: '', emissao: todayIso(), vencimento: '', categoria: '' });
  const [filialOverride, setFilialOverride] = useState(filialId !== 'todas' ? String(filialId) : '');
  const [items, setItems] = useState([{ descricao: '', quantidade: '', valorUnitario: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  function setHeaderField(k, v) {
    setHeader((h) => ({ ...h, [k]: v }));
  }
  function updateItem(idx, field, value) {
    setItems((its) => its.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((its) => its.concat([{ descricao: '', quantidade: '', valorUnitario: '' }]));
  }
  function removeItem(idx) {
    setItems((its) => its.filter((_, i) => i !== idx));
  }

  const total = items.reduce((s, it) => s + (parseFloat(it.quantidade) || 0) * (parseFloat(it.valorUnitario) || 0), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!filialOverride) {
      setError('Selecione uma filial.');
      return;
    }
    setSaving(true);
    try {
      const result = await create('documentos-fiscais', {
        numero_documento: header.numero_documento,
        tipo: header.tipo,
        fornecedor_id: Number(header.fornecedor_id),
        filial_id: Number(filialOverride),
        emissao: header.emissao,
        valor: total,
        vencimento: header.vencimento,
        categoria: header.categoria || undefined,
      });
      const cp = result?.conta_pagar;
      setToast(
        cp ? `Nota fiscal registrada — Conta a Pagar ${cp.codigo} criada (vence em ${header.vencimento}).` : 'Nota fiscal registrada.'
      );
      setTimeout(onSubmitted, 1800);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <SecondaryLink onClick={onCancel}>&larr; Voltar para Documentos Fiscais</SecondaryLink>
      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Tipo de Documento</div>
              <select value={header.tipo} onChange={(e) => setHeaderField('tipo', e.target.value)} style={inputStyle}>
                <option value="NF-e">NF-e</option>
                <option value="NFS-e">NFS-e</option>
                <option value="DANFE">DANFE</option>
              </select>
            </div>
            <div>
              <div style={labelStyle}>Número</div>
              <input required value={header.numero_documento} onChange={(e) => setHeaderField('numero_documento', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Fornecedor / Emitente</div>
              <select required value={header.fornecedor_id} onChange={(e) => setHeaderField('fornecedor_id', e.target.value)} style={inputStyle}>
                <option value="">Selecionar…</option>
                {Object.entries(fornecedores).map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Data de Emissão</div>
              <input required type="date" value={header.emissao} onChange={(e) => setHeaderField('emissao', e.target.value)} style={inputStyle} />
            </div>
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
              <div style={labelStyle}>Vencimento (Contas a Pagar) *</div>
              <input required type="date" value={header.vencimento} onChange={(e) => setHeaderField('vencimento', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Categoria</div>
              <input value={header.categoria} onChange={(e) => setHeaderField('categoria', e.target.value)} placeholder="Ex.: Insumos - Cimento" style={inputStyle} />
            </div>
          </div>
        </Card>
        <Card style={{ overflowX: 'auto', overflowY: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Produtos da Nota Fiscal</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.primary, cursor: 'pointer' }} onClick={addItem}>
              + Adicionar Item
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Produto</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 90 }}>Qtd.</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 140 }}>Valor Unitário</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', width: 120 }}>Valor Total</th>
                <th style={{ width: 36 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
                  <td style={{ padding: '8px 16px' }}>
                    <input placeholder="Descrição do produto" value={it.descricao} onChange={(e) => updateItem(idx, 'descricao', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input type="number" value={it.quantidade} onChange={(e) => updateItem(idx, 'quantidade', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input type="number" value={it.valorUnitario} onChange={(e) => updateItem(idx, 'valorUnitario', e.target.value)} style={rowInputStyle} />
                  </td>
                  <td style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                    {money((parseFloat(it.quantidade) || 0) * (parseFloat(it.valorUnitario) || 0))}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', color: COLORS.danger, fontWeight: 700, cursor: 'pointer' }} onClick={() => removeItem(idx)}>
                    ×
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `1px solid ${COLORS.borderLight}`, background: COLORS.bg }}>
                <td colSpan={3} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, textAlign: 'right' }}>
                  Total da Nota
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, textAlign: 'right' }}>{money(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </Card>
        {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Registrar Nota Fiscal'}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
