/**
 * Serviço de Agendamentos
 * Comunicação com a API para operações relacionadas a agendamentos
 */

import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { Agendamento } from '@/types';

/**
 * Lista todos os agendamentos (requer autenticação)
 */
export async function getAgendamentos(): Promise<Agendamento[]> {
	const token = getAuthToken();
	return apiRequest<Agendamento[]>(API_ENDPOINTS.AGENDAMENTOS, {
		token: token || undefined,
	});
}

/**
 * Busca um agendamento específico por ID (requer autenticação)
 */
export async function getAgendamentoById(id: string): Promise<Agendamento> {
	const token = getAuthToken();
	return apiRequest<Agendamento>(API_ENDPOINTS.AGENDAMENTO_BY_ID(id), {
		token: token || undefined,
	});
}

/**
 * Cria um novo agendamento (requer autenticação)
 */
export async function createAgendamento(data: {
	servicoId: string;
	profissionalId: string;
	data: string;
	horario: string;
	estabelecimentoId: number;
}): Promise<Agendamento> {
	const token = getAuthToken();
	return apiRequest<Agendamento>(API_ENDPOINTS.AGENDAMENTOS, {
		method: 'POST',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Atualiza um agendamento (requer autenticação)
 */
export async function updateAgendamento(
	id: string,
	data: {
		status?: string;
		data?: string;
		horario?: string;
	}
): Promise<Agendamento> {
	const token = getAuthToken();
	return apiRequest<Agendamento>(API_ENDPOINTS.AGENDAMENTO_BY_ID(id), {
		method: 'PUT',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Cancela um agendamento (requer autenticação)
 */
export async function cancelAgendamento(id: string): Promise<void> {
	const token = getAuthToken();
	await apiRequest<void>(API_ENDPOINTS.AGENDAMENTO_BY_ID(id), {
		method: 'DELETE',
		token: token || undefined,
	});
}
