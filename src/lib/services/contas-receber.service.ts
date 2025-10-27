/**
 * Service para gerenciamento de contas a receber
 */

import { API_BASE_URL } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';

export interface ContaReceber {
	id: number;
	estabelecimento_id: number;
	descricao: string;
	valor: number;
	data_vencimento: string;
	data_recebimento?: string;
	status: 'pendente' | 'recebido' | 'vencido';
	categoria: string;
	observacoes?: string;
	created_at?: string;
	updated_at?: string;
}

export interface ResumoContasReceber {
	totalReceber: number;
	totalVencido: number;
	totalRecebidoMes: number;
	proximoRecebimento: ContaReceber | null;
}

/**
 * Busca contas a receber do estabelecimento
 */
export async function getContasReceber(params?: {
	status?: string;
	dataInicio?: string;
	dataFim?: string;
}): Promise<ContaReceber[]> {
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
		? `${API_BASE_URL}/api/contas-receber?${queryParams.toString()}`
		: `${API_BASE_URL}/api/contas-receber`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao buscar contas a receber',
		}));
		throw new Error(error.message || 'Erro ao buscar contas a receber');
	}

	return response.json();
}

/**
 * Busca resumo de contas a receber
 */
export async function getResumoContasReceber(): Promise<ResumoContasReceber> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-receber/resumo`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao buscar resumo de contas a receber',
		}));
		throw new Error(
			error.message || 'Erro ao buscar resumo de contas a receber'
		);
	}

	return response.json();
}

/**
 * Cria nova conta a receber
 */
export async function createContaReceber(
	contaData: Omit<
		ContaReceber,
		'id' | 'estabelecimento_id' | 'status' | 'created_at' | 'updated_at'
	>
): Promise<ContaReceber> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-receber`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(contaData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao criar conta a receber',
		}));
		throw new Error(error.message || 'Erro ao criar conta a receber');
	}

	return response.json();
}

/**
 * Atualiza conta a receber
 */
export async function updateContaReceber(
	id: number,
	contaData: Partial<
		Omit<
			ContaReceber,
			'id' | 'estabelecimento_id' | 'created_at' | 'updated_at'
		>
	>
): Promise<ContaReceber> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-receber/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(contaData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao atualizar conta a receber',
		}));
		throw new Error(error.message || 'Erro ao atualizar conta a receber');
	}

	return response.json();
}

/**
 * Marca conta como recebida
 */
export async function marcarContaComoRecebida(
	id: number
): Promise<ContaReceber> {
	const token = getAuthToken();
	const response = await fetch(
		`${API_BASE_URL}/api/contas-receber/${id}/receber`,
		{
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao marcar conta como recebida',
		}));
		throw new Error(error.message || 'Erro ao marcar conta como recebida');
	}

	return response.json();
}

/**
 * Deleta conta a receber
 */
export async function deleteContaReceber(id: number): Promise<void> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/api/contas-receber/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'Erro ao deletar conta a receber',
		}));
		throw new Error(error.message || 'Erro ao deletar conta a receber');
	}
}
