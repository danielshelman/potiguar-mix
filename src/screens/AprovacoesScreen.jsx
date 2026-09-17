import { useCallback, useEffect, useState } from 'react';
import { list, get } from '../api/entities';
import { api } from '../api/client';
import { useLookups } from '../lookups/LookupsContext';
import { Card, PrimaryButton, LoadingState, ErrorState, EmptyState } from '../components/Common';
import StatusPill from '../components/StatusPill';
import { COLORS } from '../theme';
import { money } from '../utils/format';

const TIPO_RESOURCE = {
  SolicitacaoCompra: 'solicitacoes-compra',
  PedidoCompra: 'pedidos-compra',
  ContaPagar: 'contas-pagar',
};

export default function AprovacoesScreen() {
  const { filiais } = useLookups();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [onlyPending, setOnlyPending] = useState(true);

  const load = useCallback(() => {
    setError(null);
    const params = { limit: 100 };
    if (onlyPending) params.status = 'Aguardando Aprovação';
    list('aprovacoes', params)
      .then(async (res) => {
        const items = res?.data || [];
        const enriched = await Promise.all(
          items.map(async (a) => {
            let titulo = `${a.tipo} #${a.referencia_id}`;
            let valor = null;
            try {
              const ref = await get(TIPO_RESOURCE[a.tipo], a.referencia_id);
              valor = ref.valor ?? null;
              titulo = ref.codigo || ref.observacao || titulo;
            } catch {
              /* referência pode ter sido removida */
            }
            return { ...a, titulo, valor };
          })
        );
        setRows(enriched);
      })
      .catch(setError);
  }, [onlyPending]);

  useEffect(() => {
    load();
  }, [load]);

  async function decidir(id, decisao) {
    setBusyId(id);
    try {
      await api.post(`/aprovacoes/${id}/decidir`, { decisao });
      load();
    } catch (err) {
      setError(err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>Itens de aprovação de compras e financeiro</div>
        <div
          onClick={() => setOnlyPending((v) => !v)}
          style={{
            padding: '6px 13px',
            borderRadius: 4,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            background: onlyPending ? COLORS.primary : COLORS.chipBg,
            color: onlyPending ? COLORS.white : COLORS.textMuted,
          }}
        >
          {onlyPending ? 'Mostrando: Pendentes' : 'Mostrando: Todas'}
        </div>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={load} />
      ) : !rows ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState label="Nenhuma aprovação encontrada." />
      ) : (
        <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                {['Tipo', 'Item', 'Filial', 'Valor', 'Status', ''].map((h) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: COLORS.textMuted }}>{a.tipo}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600 }}>{a.titulo}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{filiais[a.filial_id] || a.filial_id}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>{a.valor !== null ? money(a.valor) : '—'}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13 }}>
                    <StatusPill status={a.status} />
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    {a.status === 'Aguardando Aprovação' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <PrimaryButton
                          onClick={() => decidir(a.id, 'Aprovado')}
                          disabled={busyId === a.id}
                          style={{ background: COLORS.success, fontSize: 11.5, padding: '5px 10px', borderRadius: 3 }}
                        >
                          Aprovar
                        </PrimaryButton>
                        <PrimaryButton
                          onClick={() => decidir(a.id, 'Rejeitado')}
                          disabled={busyId === a.id}
                          style={{ background: COLORS.danger, fontSize: 11.5, padding: '5px 10px', borderRadius: 3 }}
                        >
                          Rejeitar
                        </PrimaryButton>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
