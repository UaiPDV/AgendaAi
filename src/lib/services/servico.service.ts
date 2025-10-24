/**
 * Serviço de Serviços
 * Comunicação com a API para operações relacionadas a serviços
 */

import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { Servico } from '@/types';

/**
 * Lista todos os serviços (público)
 */
export async function getServicos(): Promise<Servico[]> {
	return apiRequest<Servico[]>(API_ENDPOINTS.SERVICOS);
}

/**
 * Busca um serviço específico por ID (público)
 */
export async function getServicoById(id: string): Promise<Servico> {
	return apiRequest<Servico>(API_ENDPOINTS.SERVICO_BY_ID(id));
}

/**
 * Cria um novo serviço (requer autenticação de estabelecimento)
 */
export async function createServico(data: {
	nome: string;
	descricao?: string;
	duracao: string;
	preco: string;
	categoria?: string;
}): Promise<Servico> {
	const token = getAuthToken();
	return apiRequest<Servico>(API_ENDPOINTS.SERVICOS, {
		method: 'POST',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Atualiza um serviço (requer autenticação de estabelecimento)
 */
export async function updateServico(
	id: string,
	data: {
		nome?: string;
		descricao?: string;
		duracao?: string;
		preco?: string;
		categoria?: string;
	}
): Promise<Servico> {
	const token = getAuthToken();
	return apiRequest<Servico>(API_ENDPOINTS.SERVICO_BY_ID(id), {
		method: 'PUT',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Deleta um serviço (requer autenticação de estabelecimento)
 */
export async function deleteServico(id: string): Promise<void> {
	const token = getAuthToken();
	await apiRequest<void>(API_ENDPOINTS.SERVICO_BY_ID(id), {
		method: 'DELETE',
		token: token || undefined,
	});
}

/**
 * Busca os serviços de um estabelecimento específico
 */
export async function getServicosDoEstabelecimento(
	estabelecimentoId: number
): Promise<Servico[]> {
	return apiRequest<Servico[]>(
		API_ENDPOINTS.ESTABELECIMENTO_SERVICOS(estabelecimentoId)
	);
}
