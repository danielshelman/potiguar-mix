import { useState } from 'react';
import { Card, PrimaryButton } from '../../components/Common';
import { COLORS, inputStyle, labelStyle } from '../../theme';
import { update } from '../../api/entities';
import { todayIso } from '../../utils/format';

export default function CorpoDeProvaExtra({ record, refresh }) {
  const [resistencia, setResistencia] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function marcarColetado() {
    setSaving(true);
    setError(null);
    try {
      await update('corpos-de-prova', record.id, { status_coleta: 'Coletado', data_coleta: todayIso() });
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function registrarRuptura(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await update('corpos-de-prova', record.id, { resistencia_real_mpa: Number(resistencia) });
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10, fontWeight: 600 }}>
        Coleta e Ruptura
      </div>

      {record.status_coleta === 'Pendente' && (
        <PrimaryButton onClick={marcarColetado} disabled={saving} style={{ marginBottom: 12 }}>
          Marcar como Coletado
        </PrimaryButton>
      )}

      {record.status_coleta === 'Coletado' && record.status_ruptura === 'Aguardando' && (
        <form onSubmit={registrarRuptura} style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div>
            <div style={labelStyle}>Resistência Real (MPa)</div>
            <input required type="number" step="any" value={resistencia} onChange={(e) => setResistencia(e.target.value)} style={{ ...inputStyle, width: 160 }} />
          </div>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Registrando…' : 'Registrar Ruptura'}
          </PrimaryButton>
        </form>
      )}

      {record.status_ruptura !== 'Aguardando' && (
        <div style={{ fontSize: 13.5, fontWeight: 700, color: record.status_ruptura === 'Reprovado' ? COLORS.danger : COLORS.success }}>
          {record.status_ruptura} — {record.resistencia_real_mpa} MPa (esperado {record.resistencia_esperada_mpa} MPa)
        </div>
      )}

      {error && <div style={{ color: COLORS.danger, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{error}</div>}
    </Card>
  );
}
