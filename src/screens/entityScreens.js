// Config data-driven para as telas "genéricas" de lista/detalhe/criação.
// Cada entrada descreve: recurso da API, colunas da listagem, campos do
// formulário de criação genérico e (quando aplicável) extras de detalhe.
const money = { type: 'money' };
const date = { type: 'date' };
const status = { type: 'status' };

export const ENTITY_SCREENS = {
  'crm-clientes': {
    resource: 'clientes',
    titleKey: 'nome',
    columns: [
      { key: 'nome', label: 'Cliente' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'segmento', label: 'Segmento' },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['nome', 'cnpj', 'segmento'],
    customForm: 'cliente',
    newButtonLabel: '+ Novo Cliente',
    detailExtra: 'cliente',
    statusOptions: ['Ativo', 'Inativo'],
  },

  'prod-tracos': {
    resource: 'tracos',
    ignoreFilial: true,
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'Traço' },
      { key: 'classe', label: 'Classe' },
      { key: 'aplicacao', label: 'Aplicação' },
      { key: 'slump_alvo_mm', label: 'Slump Alvo (mm)' },
      { key: 'consumo_cimento_kg_m3', label: 'Consumo Cimento (kg/m³)' },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo', 'classe'],
    customForm: 'traco',
    newButtonLabel: '+ Novo Traço',
    detailExtra: 'traco',
    statusOptions: ['Ativo', 'Inativo'],
  },

  'prod-qualidade': {
    resource: 'corpos-de-prova',
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'Corpo de Prova' },
      { key: 'ordem_id', label: 'Ordem', render: (r, lk) => lk.ordensProducao[r.ordem_id] || r.ordem_id },
      { key: 'traco_id', label: 'Traço', render: (r, lk) => lk.tracos[r.traco_id] || r.traco_id },
      { key: 'data_moldagem', label: 'Data Moldagem', ...date },
      { key: 'slump_medido_mm', label: 'Slump Medido (mm)' },
      { key: 'resistencia_real_mpa', label: 'Resist. Real (MPa)' },
      { key: 'status_ruptura', label: 'Status', ...status },
    ],
    searchKeys: ['codigo'],
    createFields: [
      { key: 'codigo', label: 'Código do CP', required: true, placeholder: 'Ex.: CP-9010' },
      { key: 'ordem_id', label: 'Ordem de Produção', type: 'select', optionsFrom: 'ordensProducao', required: true },
      { key: 'traco_id', label: 'Traço', type: 'select', optionsFrom: 'tracos', required: true },
      { key: 'data_moldagem', label: 'Data de Moldagem', type: 'date', required: true },
      { key: 'responsavel', label: 'Responsável (Laboratório)' },
      { key: 'slump_medido_mm', label: 'Slump Medido (mm)', type: 'number' },
      { key: 'resistencia_esperada_mpa', label: 'Resistência Esperada (MPa)', type: 'number', required: true },
    ],
    newButtonLabel: '+ Novo Corpo de Prova',
    detailExtra: 'corpo-de-prova',
    statusFilterKey: 'status_ruptura',
    statusOptions: ['Aguardando', 'Aprovado', 'Reprovado'],
    // status_ruptura só muda via registro de resistência real (ver CorpoDeProvaExtra);
    // a API não aceita PATCH direto desse campo.
    noStatusEditor: true,
  },

  'prod-ordens': {
    resource: 'ordens-producao',
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'Ordem' },
      { key: 'contrato_id', label: 'Contrato', render: (r, lk) => lk.contratos[r.contrato_id] || r.contrato_id },
      { key: 'traco_id', label: 'Traço', render: (r, lk) => lk.tracos[r.traco_id] || r.traco_id },
      { key: 'volume_m3', label: 'Volume (m³)' },
      { key: 'data_prevista', label: 'Data Prevista', ...date },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo'],
    createFields: [
      { key: 'codigo', label: 'Código da Ordem', required: true, placeholder: 'Ex.: OP-510' },
      { key: 'contrato_id', label: 'Contrato', type: 'select', optionsFrom: 'contratos', required: true },
      { key: 'traco_id', label: 'Traço', type: 'select', optionsFrom: 'tracos', required: true },
      { key: 'volume_m3', label: 'Volume (m³)', type: 'number', required: true },
      { key: 'data_prevista', label: 'Data Prevista', type: 'date', required: true },
    ],
    newButtonLabel: '+ Nova Ordem',
    statusOptions: ['Programada', 'Em Produção', 'Concluída', 'Cancelada'],
    detailExtra: 'ordem-producao',
  },

  'prod-bomba': {
    resource: 'servicos-bomba',
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'OS Bomba' },
      { key: 'contrato_id', label: 'Contrato', render: (r, lk) => lk.contratos[r.contrato_id] || r.contrato_id },
      { key: 'equipamento', label: 'Equipamento' },
      { key: 'operador', label: 'Operador' },
      { key: 'volume_bombeado_m3', label: 'Volume (m³)' },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo', 'equipamento', 'operador'],
    createFields: [
      { key: 'codigo', label: 'Código', required: true, placeholder: 'Ex.: BM-205' },
      { key: 'contrato_id', label: 'Contrato', type: 'select', optionsFrom: 'contratos', required: true },
      { key: 'equipamento', label: 'Equipamento' },
      { key: 'operador', label: 'Operador' },
      { key: 'volume_bombeado_m3', label: 'Volume Bombeado (m³)', type: 'number' },
      { key: 'valor', label: 'Valor', type: 'number', required: true },
    ],
    newButtonLabel: '+ Novo Serviço de Bomba',
    statusOptions: ['Programada', 'Em Execução', 'Concluída'],
  },

  'prod-dosagem': {
    resource: 'apontamentos-dosagem',
    titleKey: 'id',
    columns: [
      { key: 'ordem_id', label: 'Ordem', render: (r, lk) => lk.ordensProducao[r.ordem_id] || r.ordem_id },
      { key: 'volume_dosado_m3', label: 'Volume Dosado (m³)' },
      { key: 'operador', label: 'Operador' },
      { key: 'horario', label: 'Horário', render: (r) => (r.horario ? new Date(r.horario).toLocaleString('pt-BR') : '—') },
      { key: 'status', label: 'Status', ...status },
    ],
    createFields: [
      { key: 'ordem_id', label: 'Ordem de Produção', type: 'select', optionsFrom: 'ordensProducao', required: true },
      { key: 'volume_dosado_m3', label: 'Volume Dosado (m³)', type: 'number', required: true },
      { key: 'operador', label: 'Operador' },
    ],
    newButtonLabel: '+ Novo Apontamento',
    statusOptions: ['Aguardando', 'Em Andamento', 'Concluído'],
  },

  'prod-expedicao': {
    resource: 'carregamentos',
    titleKey: 'codigo_nota',
    columns: [
      { key: 'codigo_nota', label: 'Nota de Carregamento' },
      { key: 'ordem_id', label: 'Ordem', render: (r, lk) => lk.ordensProducao[r.ordem_id] || r.ordem_id },
      { key: 'caminhao', label: 'Caminhão' },
      { key: 'motorista', label: 'Motorista' },
      { key: 'volume_m3', label: 'Volume (m³)' },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo_nota', 'caminhao', 'motorista'],
    customForm: 'carregamento',
    newButtonLabel: '+ Novo Carregamento',
    statusOptions: ['Carregando', 'Em Trânsito', 'Entregue'],
    detailExtra: 'carregamento',
  },

  'comp-cotacao': {
    resource: 'cotacoes',
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'Cotação' },
      { key: 'fornecedor_id', label: 'Fornecedor', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'item', label: 'Item' },
      { key: 'validade', label: 'Validade', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo', 'item'],
    customForm: 'cotacao',
    newButtonLabel: '+ Nova Cotação',
    statusOptions: ['Em Aberto', 'Ganha', 'Perdida'],
    detailExtra: 'cotacao',
  },

  'comp-pedidos': {
    resource: 'pedidos-compra',
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'Pedido' },
      { key: 'fornecedor_id', label: 'Fornecedor', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'data_pedido', label: 'Data', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo'],
    createFields: [
      { key: 'codigo', label: 'Código do Pedido', required: true, placeholder: 'Ex.: PC-3390' },
      { key: 'cotacao_id', label: 'Cotação Vencedora', type: 'number', required: true, placeholder: 'ID da cotação' },
      { key: 'fornecedor_id', label: 'Fornecedor', type: 'select', optionsFrom: 'fornecedores', required: true },
      { key: 'data_pedido', label: 'Data do Pedido', type: 'date' },
      { key: 'valor', label: 'Valor', type: 'number', required: true },
    ],
    newButtonLabel: '+ Novo Pedido',
    statusOptions: ['Solicitado', 'Aprovado', 'Entregue', 'Faturado'],
    detailExtra: 'pedido-compra',
  },

  'comp-fornecedores': {
    resource: 'fornecedores',
    ignoreFilial: true,
    titleKey: 'nome',
    columns: [
      { key: 'nome', label: 'Fornecedor' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'categoria', label: 'Categoria' },
      { key: 'contato', label: 'Contato' },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['nome', 'cnpj', 'categoria'],
    createFields: [
      { key: 'nome', label: 'Nome / Razão Social', required: true },
      { key: 'cnpj', label: 'CNPJ', required: true, placeholder: '00.000.000/0001-00' },
      { key: 'categoria', label: 'Categoria', placeholder: 'Ex.: Insumos - Cimento' },
      { key: 'contato', label: 'Contato' },
    ],
    newButtonLabel: '+ Novo Fornecedor',
  },

  'comp-fiscal': {
    resource: 'documentos-fiscais',
    titleKey: 'numero_documento',
    columns: [
      { key: 'numero_documento', label: 'Documento' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'fornecedor_id', label: 'Emitente', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'emissao', label: 'Emissão', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['numero_documento'],
    customForm: 'nf',
    newButtonLabel: '+ Nova Nota Fiscal',
    statusOptions: ['Pendente', 'Vinculada', 'Divergente', 'Conciliada'],
  },

  'fin-notas': {
    resource: 'documentos-fiscais',
    titleKey: 'numero_documento',
    showTotal: true,
    columns: [
      { key: 'numero_documento', label: 'Documento' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'fornecedor_id', label: 'Emitente', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'emissao', label: 'Emissão', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['numero_documento'],
    statusOptions: ['Pendente', 'Vinculada', 'Divergente', 'Conciliada'],
  },

  'comp-medicao': {
    resource: 'medicoes-fornecedor',
    titleKey: 'id',
    columns: [
      { key: 'fornecedor_id', label: 'Fornecedor', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'periodo', label: 'Período' },
      { key: 'volume_medido_m3', label: 'Volume Medido (m³)' },
      { key: 'valor_apurado', label: 'Valor Apurado', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    createFields: [
      { key: 'fornecedor_id', label: 'Fornecedor', type: 'select', optionsFrom: 'fornecedores', required: true },
      { key: 'periodo', label: 'Período', required: true, placeholder: 'Ex.: Agosto/2026' },
      { key: 'volume_medido_m3', label: 'Volume Medido (m³)', type: 'number' },
      { key: 'valor_apurado', label: 'Valor Apurado', type: 'number' },
    ],
    newButtonLabel: '+ Nova Medição',
    statusOptions: ['Em Conferência', 'Contestada', 'Aprovada', 'Fechada'],
  },

  'fin-pagar': {
    resource: 'contas-pagar',
    titleKey: 'codigo',
    columns: [
      { key: 'fornecedor_id', label: 'Fornecedor', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'codigo', label: 'Código' },
      { key: 'categoria', label: 'Categoria' },
      { key: 'vencimento', label: 'Vencimento', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo', 'categoria'],
    createFields: [
      { key: 'codigo', label: 'Código', required: true, placeholder: 'Ex.: CP-1050' },
      { key: 'fornecedor_id', label: 'Fornecedor', type: 'select', optionsFrom: 'fornecedores', required: true },
      { key: 'categoria', label: 'Categoria', placeholder: 'Ex.: Insumos - Cimento' },
      { key: 'vencimento', label: 'Vencimento', type: 'date', required: true },
      { key: 'valor', label: 'Valor', type: 'number', required: true },
      { key: 'forma_pagamento', label: 'Forma de Pagamento', placeholder: 'Boleto, PIX, TED…' },
    ],
    newButtonLabel: '+ Nova Conta a Pagar',
    statusOptions: ['A vencer', 'Vencido', 'Pago'],
    detailExtra: 'conta-pagar',
  },

  'fin-pagamentos': {
    resource: 'contas-pagar',
    titleKey: 'codigo',
    onlyStatus: 'Pago',
    showTotal: true,
    columns: [
      { key: 'fornecedor_id', label: 'Fornecedor', render: (r, lk) => lk.fornecedores[r.fornecedor_id] || r.fornecedor_id },
      { key: 'codigo', label: 'Código' },
      { key: 'vencimento', label: 'Vencimento', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo'],
  },

  'fin-receber': {
    resource: 'contas-receber',
    titleKey: 'codigo',
    columns: [
      { key: 'contrato_id', label: 'Contrato', render: (r, lk) => lk.contratos[r.contrato_id] || r.contrato_id },
      { key: 'cliente_id', label: 'Cliente', render: (r, lk) => lk.clientes[r.cliente_id] || r.cliente_id },
      { key: 'medicao', label: 'Medição' },
      { key: 'prazo', label: 'Prazo', ...date },
      { key: 'valor', label: 'Valor', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo', 'medicao'],
    createFields: [
      { key: 'codigo', label: 'Código', required: true, placeholder: 'Ex.: CR-510' },
      { key: 'contrato_id', label: 'Contrato', type: 'select', optionsFrom: 'contratos', required: true },
      { key: 'cliente_id', label: 'Cliente', type: 'select', optionsFrom: 'clientes', required: true },
      { key: 'medicao', label: 'Medição', placeholder: 'Ex.: Medição 09/2026' },
      { key: 'prazo', label: 'Prazo', type: 'date', required: true },
      { key: 'valor', label: 'Valor', type: 'number', required: true },
    ],
    newButtonLabel: '+ Nova Conta a Receber',
    statusOptions: ['A vencer', 'Vencido', 'Pago'],
  },

  'fin-conciliacao': {
    resource: 'conciliacoes-bancarias',
    titleKey: 'conta_bancaria',
    columns: [
      { key: 'data', label: 'Data', ...date },
      { key: 'conta_bancaria', label: 'Conta Bancária' },
      { key: 'valor_erp', label: 'Valor ERP', ...money },
      { key: 'valor_extrato', label: 'Valor Extrato', ...money },
      { key: 'divergencia', label: 'Divergência', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    createFields: [
      { key: 'conta_bancaria', label: 'Conta Bancária', required: true },
      { key: 'data', label: 'Data', type: 'date' },
      { key: 'valor_erp', label: 'Valor ERP', type: 'number', required: true },
      { key: 'valor_extrato', label: 'Valor Extrato', type: 'number' },
    ],
    newButtonLabel: '+ Nova Conciliação',
    statusOptions: ['Conciliado', 'Divergente', 'Pendente'],
    // status e divergencia sao sempre recalculados pela API a partir de valor_erp/valor_extrato.
    noStatusEditor: true,
  },

  'fin-comissoes': {
    resource: 'comissoes',
    titleKey: 'nome',
    columns: [
      { key: 'tipo', label: 'Tipo' },
      { key: 'nome', label: 'Nome' },
      { key: 'periodo', label: 'Período' },
      { key: 'base_calculo', label: 'Base de Cálculo', ...money },
      { key: 'percentual', label: '%' },
      { key: 'valor', label: 'Comissão', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['nome'],
    createFields: [
      { key: 'tipo', label: 'Tipo', type: 'select', options: [
        { value: 'Vendedor', label: 'Vendedor' }, { value: 'Motorista', label: 'Motorista' }, { value: 'Bombista', label: 'Bombista' },
      ], required: true },
      { key: 'nome', label: 'Nome', required: true },
      { key: 'periodo', label: 'Período', required: true, placeholder: 'Ex.: Agosto/2026' },
      { key: 'base_calculo', label: 'Base de Cálculo (R$)', type: 'number', required: true },
      { key: 'percentual', label: 'Percentual (%)', type: 'number', required: true },
    ],
    newButtonLabel: '+ Nova Comissão',
    statusOptions: ['A Pagar', 'Pago'],
  },

  'fin-fechamento': {
    resource: 'fechamentos-mensais',
    ignoreFilial: false,
    titleKey: 'mes',
    columns: [
      { key: 'mes', label: 'Mês' },
      { key: 'receitas', label: 'Receitas', ...money },
      { key: 'despesas', label: 'Despesas', ...money },
      { key: 'resultado', label: 'Resultado', ...money },
      { key: 'status', label: 'Status', ...status },
    ],
    createFields: [
      { key: 'mes', label: 'Mês (AAAA-MM)', required: true, placeholder: '2026-09' },
    ],
    newButtonLabel: '+ Fechar Mês (calcula comissões)',
    statusOptions: ['Em Aberto', 'Fechado'],
  },

  'obras-frota': {
    resource: 'manutencoes-frota',
    titleKey: 'equipamento',
    columns: [
      { key: 'equipamento', label: 'Equipamento' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['equipamento'],
    createFields: [
      { key: 'equipamento', label: 'Equipamento', required: true },
      { key: 'tipo', label: 'Tipo', placeholder: 'Ex.: Usina Dosadora' },
    ],
    newButtonLabel: '+ Novo Equipamento',
    statusOptions: ['Operando Normal', 'Atenção', 'Crítico', 'Parado'],
    detailExtra: 'frota',
  },

  'obras-andamento': {
    resource: 'contratos',
    titleKey: 'codigo',
    columns: [
      { key: 'codigo', label: 'Contrato' },
      { key: 'cliente_id', label: 'Cliente', render: (r, lk) => lk.clientes[r.cliente_id] || r.cliente_id },
      { key: 'preco_m3', label: 'Preço (m³)', ...money },
      { key: 'vigencia_fim', label: 'Vigência até', ...date },
      { key: 'status', label: 'Status', ...status },
    ],
    searchKeys: ['codigo'],
    statusOptions: ['Ativo', 'Em Reajuste', 'Encerrado'],
    note: 'O schema atual não modela percentual de execução por contrato; a tela mostra os contratos e seu status de vigência.',
  },

  'obras-ocorrencias': {
    resource: 'ocorrencias',
    titleKey: 'tipo',
    dateColumnForFilter: 'data',
    columns: [
      { key: 'data', label: 'Data', render: (r) => (r.data ? new Date(r.data).toLocaleDateString('pt-BR') : '—') },
      { key: 'tipo', label: 'Tipo' },
      { key: 'descricao', label: 'Descrição' },
      { key: 'severidade', label: 'Severidade', ...status },
    ],
    searchKeys: ['tipo', 'descricao'],
    createFields: [
      { key: 'tipo', label: 'Tipo', required: true, placeholder: 'Ex.: Falha de Equipamento' },
      { key: 'descricao', label: 'Descrição', type: 'textarea', fullWidth: true },
      { key: 'severidade', label: 'Severidade', type: 'select', required: true, options: [
        { value: 'Baixa', label: 'Baixa' }, { value: 'Média', label: 'Média' }, { value: 'Alta', label: 'Alta' }, { value: 'Crítica', label: 'Crítica' },
      ] },
    ],
    newButtonLabel: '+ Nova Ocorrência',
    statusFilterKey: 'severidade',
    statusOptions: ['Baixa', 'Média', 'Alta', 'Crítica'],
  },
};

export function getEntityScreen(id) {
  return ENTITY_SCREENS[id];
}
