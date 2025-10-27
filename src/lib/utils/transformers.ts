/**
 * Utilitários para transformação de dados da API
 */

import type { AgendamentoAPI } from '@/types/estabelecimento';
import type { Agendamento } from '@/types/cliente';

/**
 * Converte AgendamentoAPI para Agendamento
 */
export function transformAgendamentoAPI(api: AgendamentoAPI): Agendamento {
	return {
		id: api.id,
		servico: api.servico_nome_real,
		profissional: api.profissional_nome_real,
		data: api.data,
		horario: api.horario,
		usuarioId: api.usuario_id,
		estabelecimentoId: api.estabelecimento_id,
		preco: api.preco.toString(),
		status: api.status,
		estabelecimento: api.usuario_nome, // ou outro campo relevante
	};
}

/**
 * Converte array de AgendamentoAPI para Agendamento
 */
export function transformAgendamentosAPI(
	apiAgendamentos: AgendamentoAPI[]
): Agendamento[] {
	return apiAgendamentos.map(transformAgendamentoAPI);
}
