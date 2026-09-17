import { useEffect, useState } from 'react';
import { Card, PrimaryButton, SecondaryLink } from '../components/Common';
import Toast from '../components/Toast';
import { labelStyle, inputStyle, COLORS } from '../theme';
import { useFilial } from '../filial/FilialContext';
import { list, create } from '../api/entities';

function gerarCodigoNota() {
  return 'NC-' + Date.now().toString().slice(-7);
}

export default function CarregamentoForm({ onCancel, onSubmitted }) {
  const { filialId } = useFilial();
  const [ordens, setOrdens] = useState([]);
  const [form, setForm] = useState({ ordem_id: '', caminhao: '', motorista: '', volume_m3: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([
      list('ordens-producao', { status: 'Em Produção', limit: 100 }),
      list('ordens-producao', { status: 'Programada', limit: 100 }),
    ]).then(([a, b]) => setOrdens([...(a?.data || []), ...(b?.data || [])]));
  }, []);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const ordem = ordens.find((o) => String(o.id) === String(form.ordem_id));
      await create('carregamentos', {
        codigo_nota: gerarCodigoNota(),
        ordem_id: Number(form.ordem_id),
        filial_id: ordem?.filial_id ?? (filialId === 'todas' ? undefined : filialId),
        caminhao: form.caminhao || undefined,
        motorista: form.motorista || undefined,
        volume_m3: Number(form.volume_m3),
        status: 'Carregando',
      });
      setToast('Carregamento registrado. A RPS será gerada quando o status for Entregue.');
      setTimeout(onSubmitted, 1400);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <SecondaryLink onClick={onCancel}>&larr; Voltar para Expedição / Carregamento</SecondaryLink>
      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Ordem de Produção</div>
              <select required value={form.ordem_id} onChange={(e) => setField('ordem_id', e.target.value)} style={inputStyle}>
                <option value="">Selecionar…</option>
                {ordens.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.codigo} · {o.volume_m3} m³
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Caminhão Betoneira</div>
              <input value={form.caminhao} onChange={(e) => setField('caminhao', e.target.value)} placeholder="Ex.: Betoneira 02" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Motorista</div>
              <input value={form.motorista} onChange={(e) => setField('motorista', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Volume (m³)</div>
              <input required type="number" step="any" value={form.volume_m3} onChange={(e) => setField('volume_m3', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </Card>
        {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Registrar Carregamento'}
          </PrimaryButton>
          <Toast message={toast} />
        </div>
      </form>
    </div>
  );
}
