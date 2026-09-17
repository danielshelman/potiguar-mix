import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLookups } from '../lookups/LookupsContext';

const FilialContext = createContext(null);

export function FilialProvider({ children }) {
  const { usuario } = useAuth();
  const { filiais } = useLookups();
  const isAdmin = usuario?.papel === 'admin';
  const [filialId, setFilialId] = useState(isAdmin ? 'todas' : usuario?.filial_id ?? 'todas');

  useEffect(() => {
    setFilialId(isAdmin ? 'todas' : usuario?.filial_id ?? 'todas');
  }, [isAdmin, usuario]);

  const value = useMemo(
    () => ({
      filialId,
      setFilialId: isAdmin ? setFilialId : () => {},
      isAdmin,
      canSwitch: isAdmin,
      filialNome: filialId === 'todas' ? 'Todas' : filiais[filialId],
      options: isAdmin
        ? [{ id: 'todas', nome: 'Todas' }, ...Object.entries(filiais).map(([id, nome]) => ({ id: Number(id), nome }))]
        : [{ id: usuario?.filial_id, nome: filiais[usuario?.filial_id] || '—' }],
    }),
    [filialId, isAdmin, filiais, usuario]
  );

  return <FilialContext.Provider value={value}>{children}</FilialContext.Provider>;
}

export function useFilial() {
  const ctx = useContext(FilialContext);
  if (!ctx) throw new Error('useFilial precisa estar dentro de <FilialProvider>');
  return ctx;
}
