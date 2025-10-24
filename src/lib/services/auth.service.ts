/**
 * Serviço de Autenticação
 * Gerencia comunicação com a API de autenticação
 */

import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type {
	LoginCredentials,
	RegisterClienteData,
	RegisterEstabelecimentoData,
	AuthResponse,
} from '@/types';

/**
 * Faz login na API
 */
export async function login(
	credentials: LoginCredentials
): Promise<AuthResponse> {
	return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, {
		method: 'POST',
		body: JSON.stringify(credentials),
	});
}

/**
 * Registra um novo cliente
 */
export async function registerCliente(
	data: RegisterClienteData
): Promise<AuthResponse> {
	return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER_CLIENTE, {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

/**
 * Registra um novo estabelecimento
 */
export async function registerEstabelecimento(
	data: RegisterEstabelecimentoData
): Promise<AuthResponse> {
	return apiRequest<AuthResponse>(
		API_ENDPOINTS.AUTH_REGISTER_ESTABELECIMENTO,
		{
			method: 'POST',
			body: JSON.stringify(data),
		}
	);
}
