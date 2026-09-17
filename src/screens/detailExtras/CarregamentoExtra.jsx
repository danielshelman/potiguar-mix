import { useCallback, useEffect, useState } from 'react';
import { Card, PrimaryButton, LoadingState } from '../../components/Common';
import StatusPill from '../../components/StatusPill';
import { COLORS } from '../../theme';
import { list, create as createRes } from '../../api/entities';
import { api } from '../../api/client';

export default function CarregamentoExtra({ record }) {
  const [rps, setRps] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    list('rps', { limit: 200 }).then((res) => {
      const found = (res?.data || []).find((r) => r.carregamento_id === record.id);
      setRps(found || null);
    });
  }, [record.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function gerarRps() {
    setBusy(true);
    setError(null);
    try {
      await createRes(`carregamentos/${record.id}/rps`, undefined);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function registrarRetorno(status) {
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/rps/${rps.id}/retorno`, { status });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (rps === undefined) return <LoadingState label="Carregando RPS…" />;

  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10, fontWeight: 600 }}>
        RPS / NFS-e
      </div>
      {rps ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{rps.numero}</span>
          <StatusPill status={rps.status} />
          {rps.status === 'Pendente' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <PrimaryButton onClick={() => registrarRetorno('Autorizada')} disabled={busy} style={{ background: COLORS.success, fontSize: 12, padding: '7px 12px' }}>
                Registrar Retorno: Autorizada
              </PrimaryButton>
              <PrimaryButton onClick={() => registrarRetorno('Rejeitada')} disabled={busy} style={{ background: COLORS.danger, fontSize: 12, padding: '7px 12px' }}>
                Rejeitada
              </PrimaryButton>
            </div>
          )}
        </div>
      ) : record.status === 'Entregue' ? (
        <div style={{ fontSize: 13, color: COLORS.textFaint }}>RPS ainda não encontrada — tente atualizar a página.</div>
      ) : (
        <PrimaryButton onClick={gerarRps} disabled={busy}>
          Gerar RPS agora
        </PrimaryButton>
      )}
      {error && <div style={{ color: COLORS.danger, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{error}</div>}
    </Card>
  );
}
