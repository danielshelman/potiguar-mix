import { useState } from 'react';
import { Card, PrimaryButton } from '../../components/Common';
import { COLORS } from '../../theme';
import { update } from '../../api/entities';

export default function CotacaoExtra({ record, refresh }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (record.status !== 'Em Aberto') return null;

  async function setStatus(status) {
    setBusy(true);
    setError(null);
    try {
      await update('cotacoes', record.id, { status });
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10, fontWeight: 600 }}>
        Decisão da Cotação
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <PrimaryButton onClick={() => setStatus('Ganha')} disabled={busy} style={{ background: COLORS.success }}>
          Marcar como Ganha
        </PrimaryButton>
        <PrimaryButton onClick={() => setStatus('Perdida')} disabled={busy} style={{ background: COLORS.danger }}>
          Marcar como Perdida
        </PrimaryButton>
      </div>
      {error && <div style={{ color: COLORS.danger, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{error}</div>}
    </Card>
  );
}
