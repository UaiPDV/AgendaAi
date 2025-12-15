/**
 * Hook para gerenciar avaliações
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { Avaliacao } from '@/types';

export function useAvaliacoes() {
	const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAvaliacoes = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getAuthToken();
			if (!token) {
				setError('Usuário não autenticado');
				setLoading(false);
				return;
			}

			const data = await apiRequest<Avaliacao[]>(
				API_ENDPOINTS.AVALIACOES_ME,
				{ token }
			);
			setAvaliacoes(data);
		} catch (err) {
			setError('Erro ao carregar avaliações');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAvaliacoes();
	}, [fetchAvaliacoes]);

	const avaliar = useCallback(
		async (agendamentoId: string, nota: number, comentario: string) => {
			try {
				const token = getAuthToken();
				if (!token) return false;

				await apiRequest(API_ENDPOINTS.AVALIACOES, {
					method: 'POST',
					body: JSON.stringify({
						agendamento_id: agendamentoId,
						nota,
						comentario,
					}),
					token,
				});
				await fetchAvaliacoes();
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		[fetchAvaliacoes]
	);

	return {
		avaliacoes,
		loading,
		error,
		avaliar,
		refetch: fetchAvaliacoes,
	};
}
