import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEntityScreen } from './entityScreens';
import { list, create } from '../api/entities';
import { useFilial } from '../filial/FilialContext';
import DataTable from '../components/DataTable';
import GenericCreateForm from '../components/GenericCreateForm';
import { Card, PrimaryButton, LoadingState, ErrorState, EmptyState } from '../components/Common';
import { COLORS } from '../theme';
import { money } from '../utils/format';
import { getCustomForm } from './customForms';

export default function GenericListScreen() {
  const { screenId } = useParams();
  const navigate = useNavigate();
  const { filialId } = useFilial();
  const config = getEntityScreen(screenId);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Todos');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [showForm, setShowForm] = useState(false);

  const statusFilterKey = config?.statusFilterKey || 'status';

  useEffect(() => {
    setStatus('Todos');
    setSearch('');
    setSortKey(null);
    setShowForm(false);
  }, [screenId]);

  useEffect(() => {
    if (!config) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = { limit: 200 };
    if (!config.ignoreFilial && filialId !== 'todas') params.filial_id = filialId;
    if (config.onlyStatus) params.status = config.onlyStatus;
    else if (status !== 'Todos') params.status = status;
    if (search) params.search = search;

    const timer = setTimeout(() => {
      list(config.resource, params)
        .then((res) => {
          if (!cancelled) setRows(res?.data || []);
        })
        .catch((err) => {
          if (!cancelled) setError(err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config, filialId, status, search]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  if (!config) return <EmptyState label="Tela não configurada." />;

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleCreate(payload) {
    await create(config.resource, payload);
    setStatus('Todos');
    setSearch('');
    const params = { limit: 200 };
    if (!config.ignoreFilial && filialId !== 'todas') params.filial_id = filialId;
    const res = await list(config.resource, params);
    setRows(res?.data || []);
    setShowForm(false);
  }

  async function refreshAfterCustomForm() {
    const params = { limit: 200 };
    if (!config.ignoreFilial && filialId !== 'todas') params.filial_id = filialId;
    const res = await list(config.resource, params);
    setRows(res?.data || []);
    setShowForm(false);
  }

  if (showForm) {
    const CustomForm = config.customForm ? getCustomForm(config.customForm) : null;
    if (CustomForm) {
      return <CustomForm onCancel={() => setShowForm(false)} onSubmitted={refreshAfterCustomForm} />;
    }
    return (
      <GenericCreateForm
        fields={config.createFields || []}
        onSubmit={handleCreate}
        onCancel={() => setShowForm(false)}
        submitLabel={config.newButtonLabel?.replace('+ ', '') || 'Salvar'}
        requireFilial={!config.ignoreFilial}
      />
    );
  }

  const totalMoneyCol = config.showTotal ? config.columns.find((c) => c.type === 'money') : null;
  const total = totalMoneyCol ? sortedRows.reduce((s, r) => s + (Number(r[totalMoneyCol.key]) || 0), 0) : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {!config.onlyStatus && config.statusOptions && (
            <>
              {['Todos', ...config.statusOptions].map((s) => (
                <div
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: '6px 13px',
                    borderRadius: 4,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: status === s ? COLORS.primary : COLORS.chipBg,
                    color: status === s ? COLORS.white : COLORS.textMuted,
                  }}
                >
                  {s}
                </div>
              ))}
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(config.customForm || config.createFields) && (
            <PrimaryButton onClick={() => setShowForm(true)} style={{ fontSize: 12.5, padding: '8px 14px' }}>
              {config.newButtonLabel || '+ Novo'}
            </PrimaryButton>
          )}
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200, padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 13, color: COLORS.text }}
          />
        </div>
      </div>

      {config.note && (
        <div style={{ fontSize: 12, color: COLORS.textFaint, marginBottom: 10 }}>{config.note}</div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : sortedRows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DataTable
            columns={config.columns}
            rows={sortedRows}
            onRowClick={(row) => navigate(`/${screenId}/${row.id}`)}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <div style={{ fontSize: 12, color: COLORS.textFaint, marginTop: 10 }}>
            {sortedRows.length} {sortedRows.length === 1 ? 'registro encontrado' : 'registros encontrados'}
            {total !== null ? ` · Total do período: ${money(total)}` : ''}
          </div>
        </>
      )}
    </div>
  );
}
