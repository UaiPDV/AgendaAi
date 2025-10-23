/**
 * Hook para gerenciar avaliações
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Avaliacao } from '@/types';

export function useAvaliacoes() {
	const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAvaliacoes = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await apiRequest<Avaliacao[]>(API_ENDPOINTS.AVALIACOES);
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
				await apiRequest(API_ENDPOINTS.AVALIACOES, {
					method: 'POST',
					body: JSON.stringify({
						agendamentoId,
						nota,
						comentario,
						usuarioId: 'user-1', // TODO: Pegar do contexto de autenticação
					}),
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
