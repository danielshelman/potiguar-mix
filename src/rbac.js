// Espelha src/middleware/roleAccess.js do backend, apenas para decidir o que
// mostrar na navegação. A autorização de verdade é sempre aplicada pela API.
const SCREEN_READ_ROLES = {
  'dia-painel': null, // qualquer papel autenticado

  'crm-clientes': ['admin', 'comercial', 'financeiro'],

  'prod-tracos': ['admin', 'comercial', 'producao', 'qualidade'],
  'prod-qualidade': ['admin', 'producao', 'qualidade'],
  'tech-coleta': ['admin', 'producao', 'qualidade'],
  'tech-ruptura': ['admin', 'producao', 'qualidade'],

  'prod-ordens': ['admin', 'producao', 'qualidade'],
  'prod-bomba': ['admin', 'producao', 'qualidade'],
  'prod-dosagem': ['admin', 'producao', 'qualidade'],
  'prod-expedicao': ['admin', 'producao', 'qualidade'],

  'comp-solicitacao': ['admin', 'compras', 'financeiro'],
  'comp-cotacao': ['admin', 'compras', 'financeiro'],
  'comp-aprovacoes': ['admin', 'financeiro', 'compras', 'producao'],
  'comp-pedidos': ['admin', 'compras', 'financeiro'],
  'comp-fornecedores': ['admin', 'compras', 'financeiro'],
  'comp-fiscal': ['admin', 'compras', 'financeiro'],
  'comp-medicao': ['admin', 'compras', 'financeiro'],
  'comp-estoque': ['admin', 'compras', 'producao', 'operacao'],

  'fin-dashboard': ['admin', 'financeiro'],
  'fin-pagar': ['admin', 'financeiro'],
  'fin-receber': ['admin', 'financeiro'],
  'fin-fluxo': ['admin', 'financeiro'],
  'fin-medicao-rps': ['admin', 'financeiro'],
  'fin-conciliacao': ['admin', 'financeiro'],
  'fin-comissoes': ['admin', 'financeiro'],

  'fin-dre': ['admin', 'financeiro'],
  'fin-fechamento': ['admin', 'financeiro'],
  'fin-pagamentos': ['admin', 'financeiro'],
  'fin-notas': ['admin', 'compras', 'financeiro'],

  'obras-dashboard': ['admin', 'operacao'],
  'obras-frota': ['admin', 'operacao'],
  'obras-andamento': ['admin', 'comercial', 'financeiro', 'producao', 'operacao'],
  'obras-ocorrencias': ['admin', 'operacao'],
};

export function canAccess(papel, screenId) {
  if (papel === 'admin') return true;
  const allowed = SCREEN_READ_ROLES[screenId];
  if (allowed === null || allowed === undefined) return true;
  return allowed.includes(papel);
}

export default SCREEN_READ_ROLES;
