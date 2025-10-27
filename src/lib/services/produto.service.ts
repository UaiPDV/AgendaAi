/**
 * Service para gerenciamento de produtos
 */

import { API_BASE_URL } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';

export interface Produto {
	id: number;
	estabelecimento_id: number;
	nome: string;
	descricao: string;
	preco: number;
	categoria: string;
	estoque: number;
	ativo: boolean;
	created_at?: string;
	updated_at?: string;
}

/**
 * Busca produtos do estabelecimento logado
 */
export async function getProdutosDoEstabelecimento(): Promise<Produto[]> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/produtos`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao buscar produtos',
		}));
		throw new Error(error.message || 'Erro ao buscar produtos');
	}

	return response.json();
}

/**
 * Busca produto por ID
 */
export async function getProdutoById(id: number): Promise<Produto> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao buscar produto',
		}));
		throw new Error(error.message || 'Erro ao buscar produto');
	}

	return response.json();
}

/**
 * Cria novo produto
 */
export async function createProduto(
	produtoData: Omit<
		Produto,
		'id' | 'estabelecimento_id' | 'created_at' | 'updated_at'
	>
): Promise<Produto> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/produtos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(produtoData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao criar produto',
		}));
		throw new Error(error.message || 'Erro ao criar produto');
	}

	return response.json();
}

/**
 * Atualiza produto
 */
export async function updateProduto(
	id: number,
	produtoData: Partial<
		Omit<Produto, 'id' | 'estabelecimento_id' | 'created_at' | 'updated_at'>
	>
): Promise<Produto> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(produtoData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao atualizar produto',
		}));
		throw new Error(error.message || 'Erro ao atualizar produto');
	}

	return response.json();
}

/**
 * Deleta produto
 */
export async function deleteProduto(id: number): Promise<void> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao deletar produto',
		}));
		throw new Error(error.message || 'Erro ao deletar produto');
	}
}
