import { COLORS, cardStyle, buttonPrimaryStyle } from '../theme';

export function Card({ children, style }) {
  return <div style={{ ...cardStyle, ...style }}>{children}</div>;
}

export function PrimaryButton({ children, onClick, disabled, style, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...buttonPrimaryStyle,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ fontSize: 13, color: COLORS.primary, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}
    >
      {children}
    </div>
  );
}

export function LoadingState({ label = 'Carregando…' }) {
  return <div style={{ padding: 40, textAlign: 'center', color: COLORS.textFaint, fontSize: 13 }}>{label}</div>;
}

export function ErrorState({ error, onRetry }) {
  return (
    <div
      style={{
        background: COLORS.dangerBg,
        border: `1px solid ${COLORS.dangerBorder}`,
        borderRadius: 4,
        padding: '14px 16px',
        color: COLORS.dangerText,
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Não foi possível carregar os dados</div>
      <div style={{ opacity: 0.85 }}>{error?.message || 'Erro desconhecido'}</div>
      {onRetry && (
        <div style={{ marginTop: 10, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }} onClick={onRetry}>
          Tentar novamente
        </div>
      )}
    </div>
  );
}

export function EmptyState({ label = 'Nenhum registro encontrado.' }) {
  return <div style={{ padding: 30, textAlign: 'center', color: COLORS.textFaint, fontSize: 13 }}>{label}</div>;
}
