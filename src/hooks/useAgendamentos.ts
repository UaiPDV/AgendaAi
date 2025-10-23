/**
 * Hook para gerenciar agendamentos
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Agendamento } from '@/types';

export function useAgendamentos(usuarioId?: string) {
	const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAgendamentos = useCallback(async () => {
		if (!usuarioId) return;

		try {
			setLoading(true);
			setError(null);
			const data = await apiRequest<Agendamento[]>(
				`${API_ENDPOINTS.AGENDAMENTOS}?usuarioId=${usuarioId}`
			);
			setAgendamentos(data);
		} catch (err) {
			setError('Erro ao carregar agendamentos');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [usuarioId]);

	useEffect(() => {
		fetchAgendamentos();
	}, [fetchAgendamentos]);

	const cancelarAgendamento = useCallback(
		async (id: string) => {
			try {
				await apiRequest(API_ENDPOINTS.AGENDAMENTO_BY_ID(id), {
					method: 'PATCH',
					body: JSON.stringify({ status: 'cancelado' }),
				});
				await fetchAgendamentos();
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		[fetchAgendamentos]
	);

	const reagendarAgendamento = useCallback(
		async (id: string, novaData: string, novoHorario: string) => {
			try {
				await apiRequest(API_ENDPOINTS.AGENDAMENTO_BY_ID(id), {
					method: 'PATCH',
					body: JSON.stringify({ data: novaData, horario: novoHorario }),
				});
				await fetchAgendamentos();
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		[fetchAgendamentos]
	);

	return {
		agendamentos,
		loading,
		error,
		cancelarAgendamento,
		reagendarAgendamento,
		refetch: fetchAgendamentos,
	};
}
