import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { useLookups } from '../lookups/LookupsContext';
import { Card, LoadingState, ErrorState } from '../components/Common';
import { COLORS, inputStyle } from '../theme';
import { money } from '../utils/format';

const LINES = [
  { label: 'Receita Bruta de Serviços', key: 'receita_bruta' },
  { label: '(-) Deduções (impostos)', key: 'deducoes', neg: true },
  { label: '= Receita Líquida', key: 'receita_liquida', bold: true },
  { label: '(-) Custo dos Serviços Prestados (CPV)', key: 'cpv', neg: true },
  { label: '= Lucro Bruto', key: 'lucro_bruto', bold: true },
  { label: '(-) Despesas Operacionais', key: 'despesas_operacionais', neg: true },
  { label: '= EBITDA', key: 'ebitda', bold: true },
  { label: '= Resultado Líquido do Período', key: 'resultado_liquido', bold: true, final: true },
];

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function DreScreen() {
  const { usuario } = useAuth();
  const { filiais } = useLookups();
  const isAdmin = usuario?.papel === 'admin';
  const [mesInicio, setMesInicio] = useState(currentMonth());
  const [mesFim, setMesFim] = useState(currentMonth());
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setResults(null);
    setError(null);
    const columns = isAdmin
      ? [{ label: 'Consolidado', filial_id: null }, ...Object.entries(filiais).map(([id, nome]) => ({ label: nome, filial_id: id }))]
      : [{ label: usuario?.papel, filial_id: null }];

    Promise.all(
      columns.map((c) => {
        const qs = new URLSearchParams({ mes_inicio: mesInicio, mes_fim: mesFim });
        if (c.filial_id) qs.set('filial_id', c.filial_id);
        return api.get(`/financeiro/dre?${qs.toString()}`);
      })
    )
      .then((data) => setResults(columns.map((c, i) => ({ ...c, dre: data[i] }))))
      .catch(setError);
  }, [mesInicio, mesFim, isAdmin, filiais, usuario]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, fontSize: 13, color: COLORS.textMuted }}>
        <span>Período:</span>
        <input type="month" value={mesInicio} onChange={(e) => setMesInicio(e.target.value)} style={{ ...inputStyle, width: 150 }} />
        <span>até</span>
        <input type="month" value={mesFim} onChange={(e) => setMesFim(e.target.value)} style={{ ...inputStyle, width: 150 }} />
      </div>

      {error ? (
        <ErrorState error={error} />
      ) : !results ? (
        <LoadingState />
      ) : (
        <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase' }} />
                {results.map((c) => (
                  <th key={c.label} style={{ padding: '11px 16px', textAlign: 'right', fontSize: 11.5, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINES.map((ln) => (
                <tr key={ln.key} style={{ borderTop: `1px solid ${COLORS.borderLight}`, background: ln.final ? COLORS.badgeBg : 'transparent' }}>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: ln.bold ? 700 : 500, whiteSpace: 'nowrap' }}>{ln.label}</td>
                  {results.map((c) => {
                    const v = c.dre?.[ln.key] ?? 0;
                    return (
                      <td key={c.label} style={{ padding: '10px 16px', fontSize: 13, fontWeight: ln.bold ? 700 : 500, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {money(ln.neg ? -Math.abs(v) : v)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
