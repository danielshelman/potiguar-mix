import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import { LoadingState, ErrorState, EmptyState } from '../components/Common';

const columns = [
  { key: 'codigo', label: 'Corpo de Prova' },
  { key: 'idade_dias', label: 'Idade (dias)' },
  { key: 'resistencia_esperada_mpa', label: 'Resist. Esperada (MPa)' },
  { key: 'data_coleta', label: 'Data Coleta', type: 'date' },
];

export default function AgendaRupturaScreen() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/qualidade/corpos-de-prova/agenda-ruptura').then((res) => setRows(res.data)).catch(setError);
  }, []);

  if (error) return <ErrorState error={error} />;
  if (!rows) return <LoadingState />;
  if (rows.length === 0) return <EmptyState label="Nenhum corpo de prova aguardando ruptura." />;

  return <DataTable columns={columns} rows={rows} onRowClick={(row) => navigate(`/prod-qualidade/${row.id}`)} />;
}
