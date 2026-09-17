import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { COLORS, cardStyle, inputStyle, buttonPrimaryStyle, labelStyle } from '../theme';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, senha);
      const dest = location.state?.from || '/dia-painel';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || 'Não foi possível entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.sidebarBg,
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <form onSubmit={handleSubmit} style={{ ...cardStyle, width: 380, padding: 32, background: COLORS.white }}>
        <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 18, letterSpacing: '0.02em' }}>POTIGUAR MIX</div>
        <div style={{ color: COLORS.textFaint, fontSize: 12, marginTop: 4, marginBottom: 26 }}>
          Sistema de Gestão · Concretos Especiais e Locações Ltda.
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={labelStyle}>E-mail</div>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="usuario@potiguar.com"
          />
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={labelStyle}>Senha</div>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{ color: COLORS.danger, fontSize: 12.5, marginBottom: 14, fontWeight: 600 }}>{error}</div>
        )}

        <button type="submit" disabled={loading} style={{ ...buttonPrimaryStyle, width: '100%', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
