/**
 * Service para gerenciamento de contas a pagar
 */

import { API_BASE_URL } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';

export interface ContaPagar {
	id: number;
	estabelecimento_id: number;
	descricao: string;
	valor: number;
	data_vencimento: string;
	data_pagamento?: string;
	status: 'pendente' | 'pago' | 'vencido';
	categoria: string;
	observacoes?: string;
	created_at?: string;
	updated_at?: string;
}

export interface ResumoContasPagar {
	totalPendente: number;
	totalVencido: number;
	totalPagoMes: number;
	proximoVencimento: ContaPagar | null;
}

/**
 * Busca contas a pagar do estabelecimento
 */
export async function getContasPagar(params?: {
	status?: string;
	dataInicio?: string;
	dataFim?: string;
}): Promise<ContaPagar[]> {
	const token = getAuthToken();
	const queryParams = new URLSearchParams();

	if (params?.status) {
		queryParams.append('status', params.status);
	}
	if (params?.dataInicio) {
		queryParams.append('dataInicio', params.dataInicio);
	}
	if (params?.dataFim) {
		queryParams.append('dataFim', params.dataFim);
	}

	const url = queryParams.toString()
		? `${API_BASE_URL}/api/contas-pagar?${queryParams.toString()}`
		: `${API_BASE_URL}/api/contas-pagar`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao buscar contas a pagar',
		}));
		throw new Error(error.message || 'Erro ao buscar contas a pagar');
	}

	return response.json();
}

/**
 * Busca resumo de contas a pagar
 */
export async function getResumoContasPagar(): Promise<ResumoContasPagar> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-pagar/resumo`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao buscar resumo de contas a pagar',
		}));
		throw new Error(
			error.message || 'Erro ao buscar resumo de contas a pagar'
		);
	}

	return response.json();
}

/**
 * Cria nova conta a pagar
 */
export async function createContaPagar(
	contaData: Omit<
		ContaPagar,
		'id' | 'estabelecimento_id' | 'status' | 'created_at' | 'updated_at'
	>
): Promise<ContaPagar> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-pagar`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(contaData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao criar conta a pagar',
		}));
		throw new Error(error.message || 'Erro ao criar conta a pagar');
	}

	return response.json();
}

/**
 * Atualiza conta a pagar
 */
export async function updateContaPagar(
	id: number,
	contaData: Partial<
		Omit<
			ContaPagar,
			'id' | 'estabelecimento_id' | 'created_at' | 'updated_at'
		>
	>
): Promise<ContaPagar> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-pagar/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(contaData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao atualizar conta a pagar',
		}));
		throw new Error(error.message || 'Erro ao atualizar conta a pagar');
	}

	return response.json();
}

/**
 * Marca conta como paga
 */
export async function marcarContaComoPaga(id: number): Promise<ContaPagar> {
	const token = getAuthToken();
	const response = await fetch(
		`${API_BASE_URL}/api/contas-pagar/${id}/pagar`,
		{
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao marcar conta como paga',
		}));
		throw new Error(error.message || 'Erro ao marcar conta como paga');
	}

	return response.json();
}

/**
 * Deleta conta a pagar
 */
export async function deleteContaPagar(id: number): Promise<void> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-pagar/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao deletar conta a pagar',
		}));
		throw new Error(error.message || 'Erro ao deletar conta a pagar');
	}
}
