import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { listAll } from '../api/entities';
import { useAuth } from '../auth/AuthContext';

const LookupsContext = createContext(null);

function toMap(rows, labelFn) {
  const map = {};
  for (const row of rows) map[row.id] = labelFn(row);
  return map;
}

const emptyLookups = {
  filiais: {},
  clientes: {},
  fornecedores: {},
  tracos: {},
  contratos: {},
  ordensProducao: {},
  loaded: false,
};

export function LookupsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [lookups, setLookups] = useState(emptyLookups);

  const reload = useCallback(async () => {
    try {
      const [filiais, clientes, fornecedores, tracos, contratos, ordens] = await Promise.all([
        listAll('filiais'),
        listAll('clientes'),
        listAll('fornecedores'),
        listAll('tracos'),
        listAll('contratos'),
        listAll('ordens-producao'),
      ]);
      setLookups({
        filiais: toMap(filiais, (f) => f.nome),
        clientes: toMap(clientes, (c) => c.nome),
        fornecedores: toMap(fornecedores, (f) => f.nome),
        tracos: toMap(tracos, (t) => t.codigo),
        contratos: toMap(contratos, (c) => c.codigo),
        ordensProducao: toMap(ordens, (o) => o.codigo),
        loaded: true,
      });
    } catch {
      setLookups((prev) => ({ ...prev, loaded: true }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) reload();
    else setLookups(emptyLookups);
  }, [isAuthenticated, reload]);

  return <LookupsContext.Provider value={{ ...lookups, reload }}>{children}</LookupsContext.Provider>;
}

export function useLookups() {
  const ctx = useContext(LookupsContext);
  if (!ctx) throw new Error('useLookups precisa estar dentro de <LookupsProvider>');
  return ctx;
}
