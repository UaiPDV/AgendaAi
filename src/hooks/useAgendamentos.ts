/**
 * Hook para gerenciar agendamentos
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { AgendamentoAPI } from '@/types/estabelecimento';

interface UseAgendamentosOptions {
	usuarioId?: string;
	estabelecimentoId?: string;
	autoLoad?: boolean;
}

interface UseAgendamentosReturn {
	agendamentos: AgendamentoAPI[];
	loading: boolean;
	error: string | null;
	cancelarAgendamento: (id: string) => Promise<boolean>;
	confirmarAgendamento: (id: string) => Promise<boolean>;
	reagendarAgendamento: (
		id: string,
		novaData: string,
		novoHorario: string
	) => Promise<boolean>;
	refetch: () => Promise<void>;
}

export function useAgendamentos(
	options: UseAgendamentosOptions = {}
): UseAgendamentosReturn {
	const { usuarioId, estabelecimentoId, autoLoad = true } = options;

	const [agendamentos, setAgendamentos] = useState<AgendamentoAPI[]>([]);
	const [loading, setLoading] = useState(autoLoad);
	const [error, setError] = useState<string | null>(null);

	const fetchAgendamentos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getAuthToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado');
			}

			// Constrói a URL com parâmetros de filtro
			let url = API_ENDPOINTS.AGENDAMENTOS;
			const params = new URLSearchParams();

			if (usuarioId) {
				params.append('usuarioId', usuarioId);
			}
			if (estabelecimentoId) {
				params.append('estabelecimentoId', estabelecimentoId);
			}

			if (params.toString()) {
				url += `?${params.toString()}`;
			}

			const data = await apiRequest<
				AgendamentoAPI[] | { agendamentos: AgendamentoAPI[] }
			>(url, {
				method: 'GET',
				token,
			});

			// A API retorna formato diferente para estabelecimentos (objeto com agendamentos[])
			// e para clientes (array direto)
			let agendamentosData: AgendamentoAPI[] = [];
			if (Array.isArray(data)) {
				agendamentosData = data;
			} else if (
				data &&
				typeof data === 'object' &&
				'agendamentos' in data
			) {
				agendamentosData = Array.isArray(data.agendamentos)
					? data.agendamentos
					: [];
			}

			setAgendamentos(agendamentosData);
		} catch (err) {
			setError('Erro ao carregar agendamentos');
			setAgendamentos([]); // Garante array vazio em caso de erro
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [usuarioId, estabelecimentoId]);

	useEffect(() => {
		if (autoLoad) {
			fetchAgendamentos();
		}
	}, [fetchAgendamentos, autoLoad]);

	const confirmarAgendamento = useCallback(
		async (id: string) => {
			try {
				const token = getAuthToken();
				if (!token) {
					throw new Error('Token de autenticação não encontrado');
				}

				await apiRequest(
					`${API_ENDPOINTS.AGENDAMENTO_BY_ID(id)}/confirmar`,
					{
						method: 'PATCH',
						token,
					}
				);

				await fetchAgendamentos();
				return true;
			} catch (err) {
				console.error('Erro ao confirmar agendamento:', err);
				return false;
			}
		},
		[fetchAgendamentos]
	);

	const cancelarAgendamento = useCallback(
		async (id: string) => {
			try {
				const token = getAuthToken();
				if (!token) {
					throw new Error('Token de autenticação não encontrado');
				}

				await apiRequest(
					`${API_ENDPOINTS.AGENDAMENTO_BY_ID(id)}/cancelar`,
					{
						method: 'PATCH',
						token,
					}
				);

				await fetchAgendamentos();
				return true;
			} catch (err) {
				console.error('Erro ao cancelar agendamento:', err);
				return false;
			}
		},
		[fetchAgendamentos]
	);

	const reagendarAgendamento = useCallback(
		async (id: string, novaData: string, novoHorario: string) => {
			try {
				const token = getAuthToken();
				if (!token) {
					throw new Error('Token de autenticação não encontrado');
				}

				await apiRequest(
					`${API_ENDPOINTS.AGENDAMENTO_BY_ID(id)}/reagendar`,
					{
						method: 'PUT',
						token,
						body: JSON.stringify({
							data: novaData,
							horario: novoHorario,
						}),
					}
				);

				await fetchAgendamentos();
				return true;
			} catch (err) {
				console.error('Erro ao reagendar agendamento:', err);
				return false;
			}
		},
		[fetchAgendamentos]
	);

	return {
		agendamentos,
		loading,
		error,
		confirmarAgendamento,
		cancelarAgendamento,
		reagendarAgendamento,
		refetch: fetchAgendamentos,
	};
}
