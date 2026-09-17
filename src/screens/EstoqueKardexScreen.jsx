import { Fragment, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useFilial } from '../filial/FilialContext';
import { Card, LoadingState, ErrorState, EmptyState } from '../components/Common';
import { COLORS } from '../theme';
import { dateTimeBr } from '../utils/format';

export default function EstoqueKardexScreen() {
  const { filialId } = useFilial();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    setExpanded(null);
    if (filialId === 'todas') return;
    api.get(`/estoque/${filialId}`).then(setData).catch(setError);
  }, [filialId]);

  if (filialId === 'todas') {
    return <EmptyState label="Selecione uma filial específica no topo para ver o kardex de estoque." />;
  }
  if (error) return <ErrorState error={error} />;
  if (!data) return <LoadingState />;
  if (data.itens.length === 0) return <EmptyState label="Nenhum item de estoque registrado para esta filial." />;

  return (
    <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: COLORS.bg }}>
            {['Item', 'Unidade', 'Saldo Atual'].map((h) => (
              <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.itens.map((item) => (
            <Fragment key={item.id}>
              <tr
                onClick={() => setExpanded((e) => (e === item.id ? null : item.id))}
                style={{ borderTop: `1px solid ${COLORS.borderLight}`, cursor: 'pointer' }}
              >
                <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600 }}>{item.item}</td>
                <td style={{ padding: '11px 16px', fontSize: 13 }}>{item.unidade}</td>
                <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700 }}>{item.saldo_atual}</td>
              </tr>
              {expanded === item.id && (
                <tr style={{ background: COLORS.bg }}>
                  <td colSpan={3} style={{ padding: '10px 16px 16px' }}>
                    {item.movimentos.length === 0 ? (
                      <div style={{ fontSize: 12.5, color: COLORS.textFaint }}>Sem movimentações.</div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {['Tipo', 'Quantidade', 'Data', 'Referência'].map((h) => (
                              <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10.5, color: COLORS.textFaint, fontWeight: 700, textTransform: 'uppercase' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.movimentos.map((m) => (
                            <tr key={m.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                              <td style={{ padding: '6px 10px', fontSize: 12.5, fontWeight: 600, color: m.tipo === 'entrada' ? COLORS.success : COLORS.danger }}>
                                {m.tipo}
                              </td>
                              <td style={{ padding: '6px 10px', fontSize: 12.5 }}>{m.quantidade}</td>
                              <td style={{ padding: '6px 10px', fontSize: 12.5 }}>{dateTimeBr(m.data)}</td>
                              <td style={{ padding: '6px 10px', fontSize: 12.5 }}>{m.referencia}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
