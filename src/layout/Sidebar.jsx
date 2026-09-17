import { useNavigate, useLocation } from 'react-router-dom';
import { NAV } from '../nav';
import { COLORS } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { canAccess } from '../rbac';

const PAPEL_LABELS = {
  admin: 'Administrador',
  financeiro: 'Financeiro',
  compras: 'Compras',
  producao: 'Produção',
  qualidade: 'Qualidade',
  comercial: 'Comercial',
  operacao: 'Obras / Operação',
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();
  const currentScreen = location.pathname.split('/')[1] || '';

  const modules = NAV.map((mod) => ({
    ...mod,
    items: mod.items.filter((it) => canAccess(usuario?.papel, it.id)),
  })).filter((mod) => mod.items.length > 0);

  return (
    <div style={{ width: 256, flexShrink: 0, background: COLORS.sidebarBg, color: COLORS.sidebarText, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15, letterSpacing: '0.04em' }}>POTIGUAR MIX</div>
        <div style={{ color: COLORS.sidebarMuted, fontSize: 11, marginTop: 3, lineHeight: 1.4 }}>
          Concretos Especiais e Locações Ltda.
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0' }}>
        {modules.map((mod) => (
          <div key={mod.key} style={{ marginBottom: 18 }}>
            <div style={{ padding: '0 20px 8px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', color: '#5C7A75' }}>
              {mod.label}
            </div>
            {mod.items.map((it) => {
              const active = currentScreen === it.id;
              return (
                <div
                  key={it.id}
                  onClick={() => navigate(`/${it.id}`)}
                  style={{
                    padding: '9px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: active ? COLORS.primary : 'transparent',
                    color: active ? COLORS.white : COLORS.sidebarText,
                  }}
                >
                  {it.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: COLORS.white, fontSize: 13, fontWeight: 600 }}>{usuario?.nome}</div>
        <div style={{ color: COLORS.sidebarMuted, fontSize: 11, marginTop: 2 }}>
          {PAPEL_LABELS[usuario?.papel] || usuario?.papel} · uso administrativo
        </div>
      </div>
    </div>
  );
}
