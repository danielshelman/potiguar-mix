import { useState } from 'react';
import { Card, PrimaryButton } from '../../components/Common';
import { COLORS } from '../../theme';
import { update } from '../../api/entities';

const NEXT_STATUS = { Solicitado: 'Aprovado', Aprovado: 'Entregue', Entregue: 'Faturado' };

export default function PedidoCompraExtra({ record, refresh }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const next = NEXT_STATUS[record.status];

  if (!next) return null;

  async function avancar() {
    setBusy(true);
    setError(null);
    try {
      await update('pedidos-compra', record.id, { status: next });
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
        Status do Pedido
      </div>
      <PrimaryButton onClick={avancar} disabled={busy}>
        {busy ? 'Atualizando…' : `Avançar para "${next}"`}
      </PrimaryButton>
      {next === 'Entregue' && (
        <div style={{ fontSize: 12, color: COLORS.textFaint, marginTop: 8 }}>
          Ao marcar como Entregue, o estoque da filial recebe a entrada automaticamente.
        </div>
      )}
      {error && <div style={{ color: COLORS.danger, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{error}</div>}
    </Card>
  );
}
