/**
 * Serviço de Profissionais
 * Comunicação com a API para operações relacionadas a profissionais
 */

import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { Profissional } from '@/types';

/**
 * Lista todos os profissionais (público)
 */
export async function getProfissionais(): Promise<Profissional[]> {
	return apiRequest<Profissional[]>(API_ENDPOINTS.PROFISSIONAIS);
}

/**
 * Busca um profissional específico por ID (público)
 */
export async function getProfissionalById(id: string): Promise<Profissional> {
	return apiRequest<Profissional>(API_ENDPOINTS.PROFISSIONAL_BY_ID(id));
}

/**
 * Cria um novo profissional (requer autenticação de estabelecimento)
 */
export async function createProfissional(data: {
	nome: string;
	telefone?: string;
	especialidades?: string[];
}): Promise<Profissional> {
	const token = getAuthToken();
	return apiRequest<Profissional>(API_ENDPOINTS.PROFISSIONAIS, {
		method: 'POST',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Atualiza um profissional (requer autenticação de estabelecimento)
 */
export async function updateProfissional(
	id: string,
	data: {
		nome?: string;
		telefone?: string;
		especialidades?: string[];
	}
): Promise<Profissional> {
	const token = getAuthToken();
	return apiRequest<Profissional>(API_ENDPOINTS.PROFISSIONAL_BY_ID(id), {
		method: 'PUT',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Deleta um profissional (requer autenticação de estabelecimento)
 */
export async function deleteProfissional(id: string): Promise<void> {
	const token = getAuthToken();
	await apiRequest<void>(API_ENDPOINTS.PROFISSIONAL_BY_ID(id), {
		method: 'DELETE',
		token: token || undefined,
	});
}

/**
 * Busca os profissionais de um estabelecimento específico
 */
export async function getProfissionaisDoEstabelecimento(
	estabelecimentoId: number
): Promise<Profissional[]> {
	return apiRequest<Profissional[]>(
		API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(estabelecimentoId)
	);
}
