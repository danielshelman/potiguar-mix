import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../theme';
import { useFilial } from '../filial/FilialContext';
import { useAuth } from '../auth/AuthContext';

function initials(nome) {
  if (!nome) return '--';
  const parts = nome.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Header({ title }) {
  const { filialId, setFilialId, canSwitch, options } = useFilial();
  const { usuario, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div
      style={{
        height: 64,
        flexShrink: 0,
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        gap: 20,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', background: COLORS.chipBg, borderRadius: 4, padding: 3, gap: 2 }}>
          {options.map((f) => {
            const active = String(filialId) === String(f.id);
            return (
              <div
                key={f.id}
                onClick={() => canSwitch && setFilialId(f.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 3,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: canSwitch ? 'pointer' : 'default',
                  color: active ? COLORS.text : COLORS.textMuted,
                  background: active ? COLORS.white : 'transparent',
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {f.nome}
              </div>
            );
          })}
        </div>
        <div style={{ width: 1, height: 24, background: COLORS.border, flexShrink: 0 }} />
        <div ref={menuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: COLORS.primary,
              color: COLORS.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            {initials(usuario?.nome)}
          </div>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 40,
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                minWidth: 200,
                zIndex: 20,
              }}
            >
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{usuario?.nome}</div>
                <div style={{ fontSize: 11.5, color: COLORS.textFaint, marginTop: 2 }}>{usuario?.email}</div>
              </div>
              <div
                onClick={logout}
                style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: COLORS.danger, cursor: 'pointer' }}
              >
                Sair
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
