import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEntityScreen } from './entityScreens';
import { get } from '../api/entities';
import { useLookups } from '../lookups/LookupsContext';
import { Card, SecondaryLink, LoadingState, ErrorState } from '../components/Common';
import StatusPill from '../components/StatusPill';
import StatusEditor from '../components/StatusEditor';
import { COLORS, labelStyle } from '../theme';
import { money, dateBr } from '../utils/format';
import { getDetailExtra } from './detailExtras';

function fieldValue(col, record, lookups) {
  if (col.render) return col.render(record, lookups);
  const raw = record[col.key];
  if (col.type === 'money') return money(raw);
  if (col.type === 'date') return dateBr(raw);
  if (raw === null || raw === undefined || raw === '') return '—';
  return String(raw);
}

export default function GenericDetailScreen() {
  const { screenId, id } = useParams();
  const navigate = useNavigate();
  const config = getEntityScreen(screenId);
  const lookups = useLookups();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!config) return;
    setLoading(true);
    setError(null);
    get(config.resource, id)
      .then(setRecord)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [config, id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!config) return null;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (!record) return null;

  const statusCol = config.columns.find((c) => c.type === 'status');
  const Extra = config.detailExtra ? getDetailExtra(config.detailExtra) : null;

  return (
    <div>
      <SecondaryLink onClick={() => navigate(`/${screenId}`)}>&larr; Voltar</SecondaryLink>
      <Card style={{ padding: 24, maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{record[config.titleKey] ?? `#${record.id}`}</div>
          {statusCol && config.statusOptions && !config.onlyStatus && !config.noStatusEditor ? (
            <StatusEditor
              resource={config.resource}
              id={record.id}
              statusKey={statusCol.key}
              value={record[statusCol.key]}
              options={config.statusOptions}
              onChanged={refresh}
            />
          ) : statusCol ? (
            <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 4, background: COLORS.bg }}>
              <StatusPill status={record[statusCol.key]} />
            </span>
          ) : null}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          {config.columns
            .filter((c) => c.key !== config.titleKey)
            .map((c) => (
              <div key={c.key}>
                <div style={labelStyle}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {c.type === 'status' ? <StatusPill status={record[c.key]} /> : fieldValue(c, record, lookups)}
                </div>
              </div>
            ))}
        </div>
      </Card>
      {Extra && (
        <div style={{ maxWidth: 760, marginTop: 16 }}>
          <Extra record={record} refresh={refresh} />
        </div>
      )}
    </div>
  );
}
