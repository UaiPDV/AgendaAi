/**
 * Hook para métricas do dashboard
 * Consome dados da API /api/dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type {
	DashboardMetrics,
	AgendamentoListItem,
} from '@/types/estabelecimento';

interface UseDashboardMetricsReturn {
	metrics: DashboardMetrics;
	proximosAgendamentos: AgendamentoListItem[];
	loading: boolean;
	error: string | null;
	recarregar: () => Promise<void>;
}

interface DashboardApiResponse {
	agendamentosHoje: number;
	agendamentosSemana: number;
	faturamentoHoje: number;
	faturamentoMes: number;
	clientesAtivos: number;
	avaliacaoMedia: number;
	proximosAgendamentos: Array<{
		id: string;
		data: string;
		horario: string;
		status: string;
		servico: string;
		profissional: string;
		clienteNome: string;
		preco: string;
	}>;
}

export function useDashboardMetrics(): UseDashboardMetricsReturn {
	const [metrics, setMetrics] = useState<DashboardMetrics>({
		agendamentosHoje: 0,
		agendamentosSemana: 0,
		receitaMes: 0,
		taxaCancelamento: 0,
	});
	const [proximosAgendamentos, setProximosAgendamentos] = useState<
		AgendamentoListItem[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const carregar = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getAuthToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado');
			}

			// Busca métricas do dashboard da API
			const data = await apiRequest<DashboardApiResponse>(
				'/api/dashboard/metrics',
				{
					method: 'GET',
					token,
				}
			);

			// Atualiza as métricas
			setMetrics({
				agendamentosHoje: data.agendamentosHoje || 0,
				agendamentosSemana: data.agendamentosSemana || 0,
				receitaMes: data.faturamentoMes || 0,
				taxaCancelamento: 0, // Será calculado pela API em futuras atualizações
			});

			// Atualiza próximos agendamentos (garante que sempre tenha valores e tipo correto)
			const proximosComValoresPadrao: AgendamentoListItem[] = (
				data.proximosAgendamentos || []
			).map((agendamento) => ({
				id: agendamento.id,
				data: agendamento.data,
				horario: agendamento.horario,
				status: agendamento.status as
					| 'confirmado'
					| 'pendente'
					| 'cancelado'
					| 'concluido',
				servico: agendamento.servico || 'Serviço não definido',
				profissional:
					agendamento.profissional || 'Profissional não definido',
				clienteNome: agendamento.clienteNome || 'Cliente',
				preco: agendamento.preco || '0',
			}));

			setProximosAgendamentos(proximosComValoresPadrao);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao carregar métricas'
			);
			console.error('Erro ao carregar métricas:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		carregar();
	}, [carregar]);

	return {
		metrics,
		proximosAgendamentos,
		loading,
		error,
		recarregar: carregar,
	};
}
