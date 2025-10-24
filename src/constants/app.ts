/**
 * Constants específicas para a área do aplicativo (cliente)
 */

export const AGENDAMENTO_STATUS = {
	TODOS: 'todos',
	PENDENTE: 'pendente',
	CONFIRMADO: 'confirmado',
	CONCLUIDO: 'concluido',
	CANCELADO: 'cancelado',
} as const;

export const AGENDAMENTO_STATUS_LABELS = {
	[AGENDAMENTO_STATUS.TODOS]: 'Todos',
	[AGENDAMENTO_STATUS.PENDENTE]: 'Pendentes',
	[AGENDAMENTO_STATUS.CONFIRMADO]: 'Confirmados',
	[AGENDAMENTO_STATUS.CONCLUIDO]: 'Concluídos',
	[AGENDAMENTO_STATUS.CANCELADO]: 'Cancelados',
} as const;

export const PAGAMENTO_STATUS = {
	PAGO: 'pago',
	PENDENTE: 'pendente',
	CANCELADO: 'cancelado',
} as const;

export const TIPO_PAGAMENTO = {
	CARTAO_CREDITO: 'cartao-credito',
	CARTAO_DEBITO: 'cartao-debito',
	PIX: 'pix',
	DINHEIRO: 'dinheiro',
} as const;

export const TIPO_PAGAMENTO_ICONS = {
	[TIPO_PAGAMENTO.CARTAO_CREDITO]: '💳',
	[TIPO_PAGAMENTO.CARTAO_DEBITO]: '💳',
	[TIPO_PAGAMENTO.PIX]: '📱',
	[TIPO_PAGAMENTO.DINHEIRO]: '💵',
} as const;

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;
