import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { LookupsProvider } from './lookups/LookupsContext';
import { FilialProvider } from './filial/FilialContext';
import RequireAuth from './auth/RequireAuth';
import LoginPage from './auth/LoginPage';
import Layout from './layout/Layout';

import GenericListScreen from './screens/GenericListScreen';
import GenericDetailScreen from './screens/GenericDetailScreen';

import MeuDiaScreen from './screens/MeuDiaScreen';
import SolicitacaoCompraScreen from './screens/SolicitacaoCompraScreen';
import AprovacoesScreen from './screens/AprovacoesScreen';
import EstoqueKardexScreen from './screens/EstoqueKardexScreen';
import FinanceiroDashboardScreen from './screens/FinanceiroDashboardScreen';
import FluxoCaixaScreen from './screens/FluxoCaixaScreen';
import MedicaoRpsScreen from './screens/MedicaoRpsScreen';
import DreScreen from './screens/DreScreen';
import ObrasDashboardScreen from './screens/ObrasDashboardScreen';
import AgendaColetaScreen from './screens/AgendaColetaScreen';
import AgendaRupturaScreen from './screens/AgendaRupturaScreen';

const SPECIAL_ROUTES = [
  { path: 'dia-painel', element: <MeuDiaScreen /> },
  { path: 'comp-solicitacao', element: <SolicitacaoCompraScreen /> },
  { path: 'comp-aprovacoes', element: <AprovacoesScreen /> },
  { path: 'comp-estoque', element: <EstoqueKardexScreen /> },
  { path: 'fin-dashboard', element: <FinanceiroDashboardScreen /> },
  { path: 'fin-fluxo', element: <FluxoCaixaScreen /> },
  { path: 'fin-medicao-rps', element: <MedicaoRpsScreen /> },
  { path: 'fin-dre', element: <DreScreen /> },
  { path: 'obras-dashboard', element: <ObrasDashboardScreen /> },
  { path: 'tech-coleta', element: <AgendaColetaScreen /> },
  { path: 'tech-ruptura', element: <AgendaRupturaScreen /> },
];

export default function App() {
  return (
    <AuthProvider>
      <LookupsProvider>
        <FilialProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/dia-painel" replace />} />
              {SPECIAL_ROUTES.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              <Route path=":screenId" element={<GenericListScreen />} />
              <Route path=":screenId/:id" element={<GenericDetailScreen />} />
              <Route path="*" element={<Navigate to="/dia-painel" replace />} />
            </Route>
          </Routes>
        </FilialProvider>
      </LookupsProvider>
    </AuthProvider>
  );
}
