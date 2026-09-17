import { useState } from 'react';
import { Card, PrimaryButton } from '../../components/Common';
import { COLORS } from '../../theme';
import { update } from '../../api/entities';

export default function ContaPagarExtra({ record, refresh }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (record.status === 'Pago') return null;

  async function marcarPago() {
    setBusy(true);
    setError(null);
    try {
      await update('contas-pagar', record.id, { status: 'Pago' });
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
        Pagamento
      </div>
      <PrimaryButton onClick={marcarPago} disabled={busy}>
        {busy ? 'Processando…' : 'Marcar como Pago'}
      </PrimaryButton>
      {error && <div style={{ color: COLORS.danger, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{error}</div>}
    </Card>
  );
}
