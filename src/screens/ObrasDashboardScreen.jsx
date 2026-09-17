import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useFilial } from '../filial/FilialContext';
import { KpiGrid, PanelList } from '../components/Dashboard';
import { LoadingState, ErrorState } from '../components/Common';
import { COLORS } from '../theme';

export default function ObrasDashboardScreen() {
  const { filialId } = useFilial();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/obras/dashboard')
      .then((res) => setRows(res.data || []))
      .catch(setError);
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    if (filialId === 'todas') return rows;
    return rows.filter((r) => String(r.filial_id) === String(filialId));
  }, [rows, filialId]);

  if (error) return <ErrorState error={error} />;
  if (!rows) return <LoadingState />;

  const totals = filtered.reduce(
    (acc, r) => ({
      usinas_operando: acc.usinas_operando + r.usinas_operando,
      alertas_criticos: acc.alertas_criticos + r.alertas_criticos,
      obras_em_andamento: acc.obras_em_andamento + r.obras_em_andamento,
      ocorrencias_abertas: acc.ocorrencias_abertas + r.ocorrencias_abertas,
    }),
    { usinas_operando: 0, alertas_criticos: 0, obras_em_andamento: 0, ocorrencias_abertas: 0 }
  );

  const kpis = [
    { label: 'Usinas Operando Normal', value: String(totals.usinas_operando), color: COLORS.primary },
    { label: 'Equipamentos em Alerta', value: String(totals.alertas_criticos), color: totals.alertas_criticos > 0 ? COLORS.danger : COLORS.text },
    { label: 'Obras em Andamento', value: String(totals.obras_em_andamento), color: COLORS.text },
    { label: 'Ocorrências (30 dias)', value: String(totals.ocorrencias_abertas), color: COLORS.text },
  ];

  const panelItems = filtered.map((r) => ({
    title: r.filial,
    detail: `${r.usinas_operando} usinas OK · ${r.alertas_criticos} alertas · ${r.ocorrencias_abertas} ocorrências (30d)`,
    color: r.alertas_criticos > 0 ? COLORS.danger : COLORS.success,
  }));

  return (
    <div>
      <KpiGrid kpis={kpis} />
      {filialId === 'todas' && <PanelList title="Panorama por Filial" items={panelItems} />}
    </div>
  );
}
