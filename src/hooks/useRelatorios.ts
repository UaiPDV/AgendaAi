/**
 * Hook para gerenciar relatórios - Consumindo API real
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';

export interface ServicoMaisAgendado {
	servico_nome: string;
	count: number;
}

export interface DesempenhoProfissional {
	profissional_nome: string;
	count: number;
}

export interface TaxaCancelamento {
	totalAgendamentos: number;
	agendamentosCancelados: number;
	taxaCancelamentoPercentual: number;
}

interface UseRelatoriosReturn {
	servicosMaisAgendados: ServicoMaisAgendado[];
	desempenhoProfissionais: DesempenhoProfissional[];
	taxaCancelamento: TaxaCancelamento | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useRelatorios(): UseRelatoriosReturn {
	const [servicosMaisAgendados, setServicosMaisAgendados] = useState<
		ServicoMaisAgendado[]
	>([]);
	const [desempenhoProfissionais, setDesempenhoProfissionais] = useState<
		DesempenhoProfissional[]
	>([]);
	const [taxaCancelamento, setTaxaCancelamento] =
		useState<TaxaCancelamento | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRelatorios = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getAuthToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado');
			}

			// Busca os três relatórios em paralelo
			const [servicos, profissionais, taxa] = await Promise.all([
				apiRequest<ServicoMaisAgendado[]>(
					'/api/relatorios/servicos-mais-agendados',
					{
						method: 'GET',
						token,
					}
				),
				apiRequest<DesempenhoProfissional[]>(
					'/api/relatorios/desempenho-profissionais',
					{
						method: 'GET',
						token,
					}
				),
				apiRequest<TaxaCancelamento>(
					'/api/relatorios/taxa-cancelamento',
					{
						method: 'GET',
						token,
					}
				),
			]);

			setServicosMaisAgendados(servicos);
			setDesempenhoProfissionais(profissionais);
			setTaxaCancelamento(taxa);
		} catch (err) {
			setError('Erro ao carregar relatórios');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRelatorios();
	}, [fetchRelatorios]);

	return {
		servicosMaisAgendados,
		desempenhoProfissionais,
		taxaCancelamento,
		loading,
		error,
		refetch: fetchRelatorios,
	};
}
