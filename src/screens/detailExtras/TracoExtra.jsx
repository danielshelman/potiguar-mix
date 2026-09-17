import { Card } from '../../components/Common';
import { COLORS } from '../../theme';

export default function TracoExtra({ record }) {
  const insumos = record.insumos || [];
  if (insumos.length === 0) return null;
  return (
    <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 13, fontWeight: 700 }}>
        Insumos do Traço (por m³)
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: COLORS.bg }}>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Insumo</th>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Quantidade</th>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Unidade</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((i) => (
            <tr key={i.id} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>{i.insumo}</td>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>{i.quantidade}</td>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>{i.unidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
