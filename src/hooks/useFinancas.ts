/**
 * Hook para gerenciar finanças - Consumindo API real
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';

export interface FinancasEstabelecimento {
	tipo: 'estabelecimento';
	ganhosMes: number;
	ganhoTotal: number;
}

export interface FinancasCliente {
	tipo: 'cliente';
	gastoMes: number;
	gastoTotal: number;
	pagamentosPendentes: number;
}

export type FinancasData = FinancasEstabelecimento | FinancasCliente;

interface UseFinancasReturn {
	data: FinancasData | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useFinancas(): UseFinancasReturn {
	const [data, setData] = useState<FinancasData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchFinancas = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getAuthToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado');
			}

			const response = await apiRequest<FinancasData>(
				'/api/financas/me',
				{
					method: 'GET',
					token,
				}
			);

			setData(response);
		} catch (err) {
			setError('Erro ao carregar dados financeiros');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchFinancas();
	}, [fetchFinancas]);

	return {
		data,
		loading,
		error,
		refetch: fetchFinancas,
	};
}
