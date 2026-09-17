// Extraído do handoff de design (Claude Design) do Potiguar Mix.
export const COLORS = {
  primary: '#176d82',
  bg: '#F5F7F6',
  sidebarBg: '#0F1515',
  sidebarText: '#BDDED7',
  sidebarMuted: '#6F8B86',
  border: '#DCE3E1',
  borderLight: '#EEF2F1',
  text: '#101615',
  textMuted: '#5B6664',
  textFaint: '#8A9694',
  white: '#FFFFFF',
  chipBg: '#EEF2F1',
  danger: '#B3261E',
  dangerBg: '#FBEAE8',
  dangerBorder: '#E7B2AC',
  dangerText: '#8A2A20',
  success: '#1E7A46',
  warning: '#8A6D1B',
  info: '#1E5F8A',
  neutralStatus: '#6B7674',
  badgeBg: '#E4EFED',
};

export const STATUS_COLORS = {
  'A vencer': COLORS.warning, Vencido: COLORS.danger, Pago: COLORS.success,
  Solicitado: COLORS.warning, Aprovado: COLORS.primary, Entregue: COLORS.info, Faturado: COLORS.success,
  Ativo: COLORS.success, Inativo: COLORS.neutralStatus,
  'Em Conferência': COLORS.warning, Contestada: COLORS.danger, Fechada: COLORS.success, Aprovada: COLORS.primary,
  Pendente: COLORS.danger, Vinculada: COLORS.primary, Divergente: COLORS.danger, Conciliada: COLORS.success,
  'Operando Normal': COLORS.success, Atenção: COLORS.warning, Crítico: COLORS.danger, Parado: COLORS.danger,
  'Em andamento': COLORS.primary, 'Em Andamento': COLORS.primary, Paralisada: COLORS.danger, 'Concluída': COLORS.success,
  Baixa: COLORS.textMuted, Média: COLORS.warning, Alta: COLORS.danger, 'Crítica': COLORS.danger,
  Programada: COLORS.warning, 'Em Produção': COLORS.primary, Cancelada: COLORS.neutralStatus,
  Carregando: COLORS.warning, 'Em Trânsito': COLORS.info, Reprovado: COLORS.danger, Aguardando: COLORS.warning, 'Concluído': COLORS.success,
  'Em Aberto': COLORS.warning, Ganha: COLORS.success, Perdida: COLORS.danger,
  Conciliado: COLORS.success,
  Coletado: COLORS.success, 'Em Execução': COLORS.primary,
  'Em Reajuste': COLORS.warning, Encerrado: COLORS.neutralStatus,
  'A Pagar': COLORS.warning, 'Aguardando Aprovação': COLORS.warning, Rejeitado: COLORS.danger,
  'Em Aberto ': COLORS.warning,
};

export function statusColor(status) {
  return STATUS_COLORS[status] || COLORS.textMuted;
}

export const radius = '4px';

export const cardStyle = {
  background: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  borderRadius: radius,
};

export const buttonPrimaryStyle = {
  background: COLORS.primary,
  color: COLORS.white,
  fontWeight: 700,
  fontSize: 13,
  padding: '10px 20px',
  borderRadius: radius,
  cursor: 'pointer',
  border: 'none',
  display: 'inline-block',
};

export const inputStyle = {
  width: '100%',
  fontSize: 13.5,
  fontWeight: 600,
  border: `1px solid ${COLORS.border}`,
  borderRadius: radius,
  padding: '9px 12px',
  color: COLORS.text,
  background: COLORS.white,
};

export const labelStyle = {
  fontSize: 11,
  color: COLORS.textFaint,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  marginBottom: 5,
  fontWeight: 600,
};
