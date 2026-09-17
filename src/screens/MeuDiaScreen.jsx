import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Card, LoadingState, ErrorState } from '../components/Common';
import { COLORS } from '../theme';
import { dateBr } from '../utils/format';

const URGENCIA_COLOR = { Alta: COLORS.danger, Média: COLORS.warning, Baixa: COLORS.textMuted };
const TIPO_LABEL = {
  aprovacao: 'Aprovação',
  conta_pagar: 'Financeiro',
  conta_receber: 'Financeiro',
  corpo_de_prova: 'Qualidade',
  ordem_producao: 'Produção',
  ocorrencia: 'Operação',
};

export default function MeuDiaScreen() {
  const { usuario } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) return;
    api.get(`/meu-dia/${usuario.id}`).then(setData).catch(setError);
  }, [usuario]);

  if (error) return <ErrorState error={error} />;
  if (!data) return <LoadingState />;

  return (
    <div>
      {data.alertas_urgentes.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {data.alertas_urgentes.map((a, i) => (
            <div
              key={i}
              style={{ flex: 1, minWidth: 260, background: COLORS.dangerBg, border: `1px solid ${COLORS.dangerBorder}`, borderRadius: 4, padding: '14px 16px' }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dangerText }}>{a.descricao}</div>
              <div style={{ fontSize: 12, color: COLORS.dangerText, marginTop: 3, opacity: 0.85 }}>
                {a.data ? dateBr(a.data) : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 13, fontWeight: 700 }}>
            Tarefas Priorizadas
          </div>
          {data.tarefas.length === 0 && (
            <div style={{ padding: 20, fontSize: 13, color: COLORS.textFaint }}>Nenhuma pendência no momento.</div>
          )}
          {data.tarefas.map((t, i) => (
            <div key={i} style={{ padding: '14px 18px', borderTop: `1px solid ${COLORS.borderLight}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.primary, background: COLORS.badgeBg, padding: '2px 7px', borderRadius: 3 }}>
                  {TIPO_LABEL[t.tipo] || t.tipo}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: URGENCIA_COLOR[t.urgencia] || COLORS.textMuted }}>
                  {t.urgencia?.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.descricao}</div>
              {t.data && <div style={{ fontSize: 12, color: COLORS.textFaint, marginTop: 3 }}>Data: {dateBr(t.data)}</div>}
            </div>
          ))}
        </Card>
        <Card style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Aguardando Resposta de Terceiros</div>
          {data.aguardando_terceiros.length === 0 && (
            <div style={{ fontSize: 12.5, color: COLORS.textFaint }}>Nada pendente com terceiros.</div>
          )}
          {data.aguardando_terceiros.map((w, i) => (
            <div key={i} style={{ padding: '10px 0', borderTop: `1px solid ${COLORS.borderLight}` }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{w.descricao}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
