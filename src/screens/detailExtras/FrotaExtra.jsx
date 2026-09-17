import { Card } from '../../components/Common';
import { COLORS } from '../../theme';
import { money, dateBr } from '../../utils/format';
import { useLookups } from '../../lookups/LookupsContext';

function Table({ title, headers, rows, renderRow }) {
  if (!rows || rows.length === 0) return null;
  return (
    <Card style={{ overflowX: 'auto', overflowY: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 13, fontWeight: 700 }}>{title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: COLORS.bg }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.borderLight}` }}>
              {renderRow(r)}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default function FrotaExtra({ record }) {
  const { fornecedores } = useLookups();
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: COLORS.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>
            Custo com o Equipamento (12 meses)
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{money(record.custo_total_12m)}</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: COLORS.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Custo Médio Mensal</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{money(record.custo_medio_mensal)}</div>
        </Card>
      </div>

      <Table
        title="Plano de Manutenção Periódica"
        headers={['Tipo', 'Periodicidade', 'Última Execução', 'Próxima Execução']}
        rows={record.planos_manutencao}
        renderRow={(p) => (
          <>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{p.tipo_servico}</td>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{p.periodicidade}</td>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{dateBr(p.ultima_execucao)}</td>
            <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>{dateBr(p.proxima_execucao)}</td>
          </>
        )}
      />

      <Table
        title="Últimas Peças Trocadas"
        headers={['Peça', 'Data', 'Custo', 'Fornecedor']}
        rows={record.pecas_trocadas}
        renderRow={(p) => (
          <>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{p.peca}</td>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{dateBr(p.data)}</td>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{money(p.custo)}</td>
            <td style={{ padding: '10px 16px', fontSize: 13 }}>{fornecedores[p.fornecedor_id] || '—'}</td>
          </>
        )}
      />
    </div>
  );
}
