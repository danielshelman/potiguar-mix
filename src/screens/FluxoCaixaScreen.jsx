import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useFilial } from '../filial/FilialContext';
import { Card, LoadingState, ErrorState } from '../components/Common';
import { COLORS } from '../theme';
import { moneyShort, dateBr } from '../utils/format';

export default function FluxoCaixaScreen() {
  const { filialId } = useFilial();
  const [semanas, setSemanas] = useState(8);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const qs = new URLSearchParams({ semanas: String(semanas) });
    if (filialId !== 'todas') qs.set('filial_id', filialId);
    api
      .get(`/financeiro/fluxo-caixa?${qs.toString()}`)
      .then((res) => setRows(res.semanas))
      .catch(setError);
  }, [semanas, filialId]);

  if (error) return <ErrorState error={error} />;
  if (!rows) return <LoadingState />;

  const maxVal = Math.max(1, ...rows.map((w) => Math.max(w.entradas, w.saidas)));
  const compact = semanas > 12;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: COLORS.textMuted }}>
            <span style={{ width: 10, height: 10, background: COLORS.primary, borderRadius: 2, display: 'inline-block' }} />
            Entradas
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: COLORS.textMuted }}>
            <span style={{ width: 10, height: 10, background: COLORS.sidebarBg, borderRadius: 2, display: 'inline-block' }} />
            Saídas
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 12.5, color: COLORS.textMuted, fontWeight: 600 }}>{semanas} semanas</div>
          <div style={{ display: 'flex', background: COLORS.chipBg, borderRadius: 4 }}>
            <div
              onClick={() => setSemanas((s) => Math.max(4, s - 4))}
              style={{ padding: '7px 14px', fontSize: 13, fontWeight: 700, color: COLORS.primary, cursor: 'pointer', borderRight: `1px solid ${COLORS.border}` }}
              title="Reduzir período"
            >
              &minus;
            </div>
            <div
              onClick={() => setSemanas((s) => Math.min(26, s + 4))}
              style={{ padding: '7px 14px', fontSize: 13, fontWeight: 700, color: COLORS.primary, cursor: 'pointer' }}
              title="Expandir período"
            >
              +
            </div>
          </div>
        </div>
      </div>

      <Card style={{ padding: '24px 24px 8px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 240, gap: 10, minWidth: rows.length * (compact ? 40 : 110) }}>
          {rows.map((w, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', minWidth: compact ? 32 : 90 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: '100%', width: '100%', justifyContent: 'center' }}>
                <div style={{ minWidth: compact ? 14 : 40, width: compact ? 14 : 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  {!compact && <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>{moneyShort(w.entradas)}</div>}
                  <div style={{ width: '100%', background: COLORS.primary, borderRadius: '2px 2px 0 0', height: `${Math.max(4, (w.entradas / maxVal) * 100)}%` }} />
                </div>
                <div style={{ minWidth: compact ? 14 : 40, width: compact ? 14 : 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  {!compact && <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>{moneyShort(w.saidas)}</div>}
                  <div style={{ width: '100%', background: COLORS.sidebarBg, borderRadius: '2px 2px 0 0', height: `${Math.max(4, (w.saidas / maxVal) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, borderTop: `1px solid ${COLORS.borderLight}`, marginTop: 10, minWidth: rows.length * (compact ? 40 : 110) }}>
          {rows.map((w, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', paddingTop: 10, minWidth: compact ? 32 : 90 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{dateBr(w.semana_inicio)}</div>
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3, color: w.saldo < 0 ? COLORS.danger : COLORS.success }}>
                {moneyShort(w.saldo)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
