import { useEffect, useState } from 'react';
import { Card } from '../../components/Common';
import StatusPill from '../../components/StatusPill';
import { COLORS } from '../../theme';
import { listAll } from '../../api/entities';
import { useLookups } from '../../lookups/LookupsContext';
import { money, dateBr } from '../../utils/format';

export default function ClienteExtra({ record }) {
  const { tracos } = useLookups();
  const [contratos, setContratos] = useState([]);

  useEffect(() => {
    listAll('contratos').then((rows) => setContratos(rows.filter((c) => c.cliente_id === record.id)));
  }, [record.id]);

  if (contratos.length === 0) return null;

  return (
    <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 13, fontWeight: 700 }}>
        Contratos do Cliente
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: COLORS.bg }}>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Contrato</th>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Traço</th>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Vigência</th>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Preço/m³</th>
            <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {contratos.map((c) => (
            <tr key={c.id} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600 }}>{c.codigo}</td>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>{tracos[c.traco_id] || c.traco_id}</td>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>
                {dateBr(c.vigencia_inicio)} a {dateBr(c.vigencia_fim)}
              </td>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>{money(c.preco_m3)}</td>
              <td style={{ padding: '9px 14px', fontSize: 13 }}>
                <StatusPill status={c.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
