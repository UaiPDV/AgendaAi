/**
 * Hook para gerenciar métodos de pagamento
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { MetodoPagamento } from '@/types';

export function usePagamentos() {
	const [metodos, setMetodos] = useState<MetodoPagamento[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMetodos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await apiRequest<MetodoPagamento[]>(
				API_ENDPOINTS.METODOS_PAGAMENTO
			);
			setMetodos(data);
		} catch (err) {
			setError('Erro ao carregar métodos de pagamento');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMetodos();
	}, [fetchMetodos]);

	const adicionarMetodo = useCallback(
		async (metodo: Omit<MetodoPagamento, 'id'>) => {
			try {
				await apiRequest(API_ENDPOINTS.METODOS_PAGAMENTO, {
					method: 'POST',
					body: JSON.stringify(metodo),
				});
				await fetchMetodos();
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		[fetchMetodos]
	);

	const removerMetodo = useCallback(
		async (id: string) => {
			try {
				await apiRequest(API_ENDPOINTS.METODO_PAGAMENTO_BY_ID(id), {
					method: 'DELETE',
				});
				await fetchMetodos();
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		[fetchMetodos]
	);

	return {
		metodos,
		loading,
		error,
		adicionarMetodo,
		removerMetodo,
		refetch: fetchMetodos,
	};
}
