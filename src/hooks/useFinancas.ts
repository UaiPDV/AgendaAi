/**
 * Hook para gerenciar finanças
 */

import { useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Transacao } from '@/types';

interface ResumoFinanceiro {
	gastoMes: number;
	gastoPendente: number;
	proximoPagamento: {
		valor: number;
		data: string;
	};
}

export function useFinancas() {
	const [transacoes, setTransacoes] = useState<Transacao[]>([]);
	const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchFinancas() {
			try {
				setLoading(true);
				setError(null);

				const transacoesData = await apiRequest<Transacao[]>(
					API_ENDPOINTS.TRANSACOES
				);

				// Calcular resumo a partir das transações
				const gastoMes = transacoesData
					.filter((t) => t.status === 'pago')
					.reduce((acc, t) => acc + t.valor, 0);
				
				const gastoPendente = transacoesData
					.filter((t) => t.status === 'pendente')
					.reduce((acc, t) => acc + t.valor, 0);
				
				const proximasPendentes = transacoesData
					.filter((t) => t.status === 'pendente')
					.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
				
				const proximoPagamento = proximasPendentes.length > 0 
					? { valor: proximasPendentes[0].valor, data: proximasPendentes[0].data }
					: { valor: 0, data: '' };

				if (isMounted) {
					setTransacoes(transacoesData);
					setResumo({ gastoMes, gastoPendente, proximoPagamento });
				}
			} catch (err) {
				if (isMounted) {
					setError('Erro ao carregar dados financeiros');
					console.error(err);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchFinancas();

		return () => {
			isMounted = false;
		};
	}, []);

	return { transacoes, resumo, loading, error };
}
