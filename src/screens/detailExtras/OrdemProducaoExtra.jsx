import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Common';
import StatusPill from '../../components/StatusPill';
import { COLORS } from '../../theme';
import { listAll } from '../../api/entities';

export default function OrdemProducaoExtra({ record }) {
  const navigate = useNavigate();
  const [carregamentos, setCarregamentos] = useState([]);
  const [corpos, setCorpos] = useState([]);

  useEffect(() => {
    listAll('carregamentos').then((rows) => setCarregamentos(rows.filter((c) => c.ordem_id === record.id)));
    listAll('corpos-de-prova').then((rows) => setCorpos(rows.filter((c) => c.ordem_id === record.id)));
  }, [record.id]);

  if (carregamentos.length === 0 && corpos.length === 0) return null;

  return (
    <div>
      {carregamentos.length > 0 && (
        <Card style={{ overflowX: 'auto', overflowY: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 13, fontWeight: 700 }}>Carregamentos desta Ordem</div>
          {carregamentos.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/prod-expedicao/${c.id}`)}
              style={{ padding: '10px 18px', borderTop: `1px solid ${COLORS.borderLight}`, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13 }}
            >
              <span style={{ fontWeight: 600 }}>{c.codigo_nota}</span>
              <StatusPill status={c.status} />
            </div>
          ))}
        </Card>
      )}
      {corpos.length > 0 && (
        <Card style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 13, fontWeight: 700 }}>Corpos de Prova desta Ordem</div>
          {corpos.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/prod-qualidade/${c.id}`)}
              style={{ padding: '10px 18px', borderTop: `1px solid ${COLORS.borderLight}`, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13 }}
            >
              <span style={{ fontWeight: 600 }}>{c.codigo}</span>
              <StatusPill status={c.status_ruptura} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
