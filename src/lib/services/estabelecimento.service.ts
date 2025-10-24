/**
 * Serviço de Estabelecimento
 * Comunicação com a API para operações relacionadas a estabelecimentos
 */

import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { Estabelecimento, Servico, Profissional } from '@/types';

/**
 * Busca os dados do estabelecimento logado
 */
export async function getEstabelecimentoLogado(): Promise<Estabelecimento> {
	const token = getAuthToken();
	return apiRequest<Estabelecimento>(`${API_ENDPOINTS.ESTABELECIMENTOS}/me`, {
		token: token || undefined,
	});
}

/**
 * Busca um estabelecimento específico por ID (público)
 */
export async function getEstabelecimentoById(
	id: number
): Promise<Estabelecimento> {
	return apiRequest<Estabelecimento>(API_ENDPOINTS.ESTABELECIMENTO_BY_ID(id));
}

/**
 * Lista todos os estabelecimentos (público)
 */
export async function getEstabelecimentos(
	search?: string
): Promise<Estabelecimento[]> {
	const endpoint = search
		? `${API_ENDPOINTS.ESTABELECIMENTOS}?search=${encodeURIComponent(
				search
		  )}`
		: API_ENDPOINTS.ESTABELECIMENTOS;
	return apiRequest<Estabelecimento[]>(endpoint);
}

/**
 * Atualiza os dados do estabelecimento logado
 */
export async function updateEstabelecimentoLogado(data: {
	nome?: string;
	telefone?: string;
	endereco?: string;
	horarioFuncionamento?: string;
	imagem?: string;
}): Promise<Estabelecimento> {
	const token = getAuthToken();
	return apiRequest<Estabelecimento>(`${API_ENDPOINTS.ESTABELECIMENTOS}/me`, {
		method: 'PUT',
		body: JSON.stringify(data),
		token: token || undefined,
	});
}

/**
 * Busca os serviços de um estabelecimento
 */
export async function getServicosEstabelecimento(
	estabelecimentoId: number
): Promise<Servico[]> {
	return apiRequest<Servico[]>(
		API_ENDPOINTS.ESTABELECIMENTO_SERVICOS(estabelecimentoId)
	);
}

/**
 * Busca os profissionais de um estabelecimento
 */
export async function getProfissionaisEstabelecimento(
	estabelecimentoId: number
): Promise<Profissional[]> {
	return apiRequest<Profissional[]>(
		API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(estabelecimentoId)
	);
}
