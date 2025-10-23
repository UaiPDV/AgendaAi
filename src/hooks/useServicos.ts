/**
 * Hook para gerenciamento de serviços
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type {
	ServicoDetalhado,
	NovoServicoForm,
} from '@/types/estabelecimento';

interface UseServicosReturn {
	servicos: ServicoDetalhado[];
	loading: boolean;
	error: string | null;
	criarServico: (data: NovoServicoForm) => Promise<void>;
	atualizarServico: (
		id: string,
		data: Partial<NovoServicoForm>
	) => Promise<void>;
	excluirServico: (id: string) => Promise<void>;
	recarregar: () => Promise<void>;
}

export function useServicos(estabelecimentoId?: number): UseServicosReturn {
	const [servicos, setServicos] = useState<ServicoDetalhado[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const carregar = useCallback(async () => {
		if (!estabelecimentoId) {
			setServicos([]);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await apiRequest<ServicoDetalhado[]>(
				API_ENDPOINTS.ESTABELECIMENTO_SERVICOS(estabelecimentoId)
			);
			setServicos(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao carregar serviços'
			);
			console.error('Erro ao carregar serviços:', err);
		} finally {
			setLoading(false);
		}
	}, [estabelecimentoId]);

	useEffect(() => {
		carregar();
	}, [carregar]);

	const criarServico = async (data: NovoServicoForm) => {
		try {
			await apiRequest(
				API_ENDPOINTS.ESTABELECIMENTO_SERVICOS(estabelecimentoId!),
				{
					method: 'POST',
					body: JSON.stringify({
						...data,
						estabelecimentoId,
					}),
				}
			);
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error ? err.message : 'Erro ao criar serviço'
			);
		}
	};

	const atualizarServico = async (
		id: string,
		data: Partial<NovoServicoForm>
	) => {
		try {
			await apiRequest(`/api/servicos/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error ? err.message : 'Erro ao atualizar serviço'
			);
		}
	};

	const excluirServico = async (id: string) => {
		try {
			await apiRequest(`/api/servicos/${id}`, {
				method: 'DELETE',
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error ? err.message : 'Erro ao excluir serviço'
			);
		}
	};

	return {
		servicos,
		loading,
		error,
		criarServico,
		atualizarServico,
		excluirServico,
		recarregar: carregar,
	};
}
