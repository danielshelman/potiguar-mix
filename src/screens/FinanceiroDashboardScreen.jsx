import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useFilial } from '../filial/FilialContext';
import { KpiGrid } from '../components/Dashboard';
import { LoadingState, ErrorState } from '../components/Common';
import { COLORS } from '../theme';
import { money } from '../utils/format';

export default function FinanceiroDashboardScreen() {
  const { filialId } = useFilial();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    const qs = filialId !== 'todas' ? `?filial_id=${filialId}` : '';
    api
      .get(`/financeiro/dashboard${qs}`)
      .then(setData)
      .catch(setError);
  }, [filialId]);

  if (error) return <ErrorState error={error} />;
  if (!data) return <LoadingState />;

  const kpis = [
    { label: 'Total a Pagar', value: money(data.total_a_pagar), sub: '', color: COLORS.text },
    { label: 'Total a Receber', value: money(data.total_a_receber), sub: '', color: COLORS.text },
    { label: 'Contas a Pagar Vencidas', value: money(data.vencidos.pagar), sub: '', color: COLORS.danger },
    { label: 'Contas a Receber Vencidas', value: money(data.vencidos.receber), sub: '', color: COLORS.danger },
    { label: 'Saldo Projetado', value: money(data.saldo_projetado), sub: 'Próximas 4 semanas', color: COLORS.primary },
  ];

  return <KpiGrid kpis={kpis} />;
}
