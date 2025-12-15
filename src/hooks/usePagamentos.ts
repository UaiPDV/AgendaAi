/**
 * Hook para gerenciar métodos de pagamento
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { MetodoPagamento } from '@/types';

const apiTipoFromUi = (tipo: string) => {
	const map: Record<string, string> = {
		'cartao-credito': 'credito',
		'cartao-debito': 'debito',
		pix: 'pix',
	};
	return map[tipo] || tipo;
};

const uiTipoFromApi = (tipo: string) => {
	const map: Record<string, string> = {
		credito: 'cartao-credito',
		debito: 'cartao-debito',
		pix: 'pix',
	};
	return (map[tipo] as MetodoPagamento['tipo']) || (tipo as MetodoPagamento['tipo']);
};

export function usePagamentos() {
	const [metodos, setMetodos] = useState<MetodoPagamento[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMetodos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getAuthToken();
			if (!token) {
				setError('Usuário não autenticado');
				setLoading(false);
				return;
			}

			const data = await apiRequest<MetodoPagamento[]>(
				API_ENDPOINTS.METODOS_PAGAMENTO,
				{ token }
			);

			const normalized = data.map((metodo) => ({
				...metodo,
				tipo: uiTipoFromApi(metodo.tipo),
				principal: Boolean(metodo.principal),
			}));

			setMetodos(normalized);
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
				const token = getAuthToken();
				if (!token) return false;

				const payload = {
					tipo: apiTipoFromUi(metodo.tipo),
					descricao: metodo.descricao,
					principal: metodo.principal ?? false,
				};

				await apiRequest(API_ENDPOINTS.METODOS_PAGAMENTO, {
					method: 'POST',
					body: JSON.stringify(payload),
					token,
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
				const token = getAuthToken();
				if (!token) return false;

				await apiRequest(API_ENDPOINTS.METODO_PAGAMENTO_BY_ID(id), {
					method: 'DELETE',
					token,
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
