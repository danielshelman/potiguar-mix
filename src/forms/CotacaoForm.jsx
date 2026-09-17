import { useEffect, useState } from 'react';
import { Card, PrimaryButton, SecondaryLink } from '../components/Common';
import Toast from '../components/Toast';
import { labelStyle, inputStyle, COLORS } from '../theme';
import { useLookups } from '../lookups/LookupsContext';
import { useFilial } from '../filial/FilialContext';
import { listAll, create } from '../api/entities';
import { todayIso } from '../utils/format';

function gerarCodigo() {
  return 'CQ-' + Date.now().toString().slice(-6);
}

export default function CotacaoForm({ onCancel, onSubmitted }) {
  const { fornecedores, filiais } = useLookups();
  const { filialId } = useFilial();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [form, setForm] = useState({ solicitacao_id: '', fornecedor_id: '', item: '', valor: '', validade: todayIso() });
  const [filialOverride, setFilialOverride] = useState(filialId !== 'todas' ? String(filialId) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    listAll('solicitacoes-compra').then(setSolicitacoes).catch(() => setSolicitacoes([]));
  }, []);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
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
      await create('cotacoes', {
        codigo: gerarCodigo(),
        solicitacao_id: Number(form.solicitacao_id),
        fornecedor_id: Number(form.fornecedor_id),
        filial_id: Number(filialOverride),
        item: form.item,
        validade: form.validade,
        valor: Number(form.valor),
      });
      setToast('Cotação registrada.');
      setTimeout(onSubmitted, 1200);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <SecondaryLink onClick={onCancel}>&larr; Voltar para Cotações</SecondaryLink>
      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Solicitação Vinculada</div>
              <select required value={form.solicitacao_id} onChange={(e) => setField('solicitacao_id', e.target.value)} style={inputStyle}>
                <option value="">Selecionar…</option>
                {solicitacoes.map((s) => (
                  <option key={s.id} value={s.id}>
                    SC-{s.id} {s.observacao ? `· ${s.observacao}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Fornecedor</div>
              <select required value={form.fornecedor_id} onChange={(e) => setField('fornecedor_id', e.target.value)} style={inputStyle}>
                <option value="">Selecionar…</option>
                {Object.entries(fornecedores).map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Item</div>
              <input required value={form.item} onChange={(e) => setField('item', e.target.value)} placeholder="Ex.: Aditivo Plastificante" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Valor Total Cotado</div>
              <input required type="number" step="any" value={form.valor} onChange={(e) => setField('valor', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Validade da Cotação</div>
              <input required type="date" value={form.validade} onChange={(e) => setField('validade', e.target.value)} style={inputStyle} />
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
          </div>
        </Card>
        {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Registrar Cotação'}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
