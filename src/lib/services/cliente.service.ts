/**
 * Cliente Service
 *
 * Serviço responsável por todas as operações relacionadas a clientes.
 * Todas as requisições são autenticadas automaticamente com o token JWT.
 */

import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { Cliente } from '@/types';

/**
 * Dados necessários para criar um novo cliente
 */
export interface NovoClienteForm {
	nome: string;
	email?: string;
	telefone?: string;
}

/**
 * Dados para atualizar um cliente existente
 */
export type AtualizarClienteForm = Partial<NovoClienteForm>;

/**
 * Busca todos os clientes do estabelecimento logado
 */
export async function getClientesDoEstabelecimento(): Promise<Cliente[]> {
	const token = getAuthToken();
	return apiRequest<Cliente[]>(API_ENDPOINTS.ESTABELECIMENTO_CLIENTES('me'), {
		token: token || undefined,
	});
}

/**
 * Busca os detalhes de um cliente específico
 */
export async function getClienteById(id: string): Promise<Cliente> {
	const token = getAuthToken();
	return apiRequest<Cliente>(API_ENDPOINTS.CLIENTE(id), {
		token: token || undefined,
	});
}

/**
 * Cria um novo cliente no estabelecimento logado
 */
export async function createCliente(
	clienteData: NovoClienteForm
): Promise<Cliente> {
	const token = getAuthToken();
	return apiRequest<Cliente>(API_ENDPOINTS.ESTABELECIMENTO_CLIENTES('me'), {
		method: 'POST',
		body: JSON.stringify(clienteData),
		token: token || undefined,
	});
}

/**
 * Atualiza um cliente existente
 */
export async function updateCliente(
	id: string,
	clienteData: AtualizarClienteForm
): Promise<Cliente> {
	const token = getAuthToken();
	return apiRequest<Cliente>(API_ENDPOINTS.CLIENTE(id), {
		method: 'PUT',
		body: JSON.stringify(clienteData),
		token: token || undefined,
	});
}

/**
 * Remove um cliente
 */
export async function deleteCliente(id: string): Promise<void> {
	const token = getAuthToken();
	return apiRequest<void>(API_ENDPOINTS.CLIENTE(id), {
		method: 'DELETE',
		token: token || undefined,
	});
}
