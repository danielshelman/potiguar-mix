import { useCallback, useEffect, useState } from 'react';
import { list } from '../api/entities';
import { api } from '../api/client';
import { useFilial } from '../filial/FilialContext';
import { Card, PrimaryButton, LoadingState, ErrorState, EmptyState } from '../components/Common';
import Toast from '../components/Toast';
import { COLORS } from '../theme';

export default function MedicaoRpsScreen() {
  const { filialId } = useFilial();
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError(null);
    setSelected([]);
    const params = { status: 'Autorizada', limit: 200 };
    if (filialId !== 'todas') params.filial_id = filialId;
    list('rps', params)
      .then((res) => setRows((res?.data || []).filter((r) => !r.agrupada)))
      .catch(setError);
  }, [filialId]);

  useEffect(() => {
    load();
  }, [load]);

  function toggle(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat([id])));
  }

  async function liberar() {
    if (filialId === 'todas') {
      setError({ message: 'Selecione uma filial específica no topo para gerar a medição.' });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await api.post('/medicao-rps', { filial_id: filialId, rps_ids: selected });
      setToast(`Medição gerada — Conta a Receber ${res.conta_receber.codigo} criada.`);
      setTimeout(() => setToast(null), 4000);
      load();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  if (error && !rows) return <ErrorState error={error} onRetry={load} />;
  if (!rows) return <LoadingState />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>RPS autorizadas, aguardando agrupamento em medição</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Toast message={toast} />
          {selected.length > 0 && (
            <PrimaryButton onClick={liberar} disabled={busy} style={{ fontSize: 12.5, padding: '9px 16px' }}>
              {busy ? 'Gerando…' : `Agrupar em Medição e Liberar NF (${selected.length})`}
            </PrimaryButton>
          )}
        </div>
      </div>

      {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{error.message}</div>}

      {rows.length === 0 ? (
        <EmptyState label="Nenhuma RPS autorizada aguardando medição." />
      ) : (
        <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                <th style={{ width: 40 }} />
                {['RPS', 'Ordem', 'Cliente', 'Contrato', 'Volume', 'Caminhão'].map((h) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => toggle(r.id)} style={{ borderTop: `1px solid ${COLORS.borderLight}`, cursor: 'pointer' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600 }}>{r.numero}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{r.ordem_codigo}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{r.cliente_nome}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{r.contrato_codigo}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{r.volume_m3} m³</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{r.caminhao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
