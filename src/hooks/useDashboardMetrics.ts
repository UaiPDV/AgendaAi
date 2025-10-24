/**
 * Hook para métricas do dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { getAgendamentos } from '@/lib/services/agendamento.service';
import { getUserData } from '@/lib/utils/auth';
import type {
	DashboardMetrics,
	AgendamentoListItem,
} from '@/types/estabelecimento';
import type { Agendamento } from '@/types/cliente';

interface UseDashboardMetricsReturn {
	metrics: DashboardMetrics;
	proximosAgendamentos: AgendamentoListItem[];
	loading: boolean;
	error: string | null;
	recarregar: () => Promise<void>;
}

export function useDashboardMetrics(
	estabelecimentoId?: number
): UseDashboardMetricsReturn {
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

	const calcularMetricas = (
		agendamentos: Agendamento[]
	): DashboardMetrics => {
		const hoje = new Date();
		hoje.setHours(0, 0, 0, 0);

		const inicioSemana = new Date(hoje);
		inicioSemana.setDate(hoje.getDate() - hoje.getDay());

		const fimSemana = new Date(inicioSemana);
		fimSemana.setDate(inicioSemana.getDate() + 7);

		const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
		const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

		let agendamentosHoje = 0;
		let agendamentosSemana = 0;
		let receitaMes = 0;
		let totalMes = 0;
		let canceladosMes = 0;

		agendamentos.forEach((agendamento) => {
			const dataAgendamento = new Date(agendamento.data);

			// Hoje
			if (dataAgendamento.toDateString() === hoje.toDateString()) {
				agendamentosHoje++;
			}

			// Semana
			if (
				dataAgendamento >= inicioSemana &&
				dataAgendamento < fimSemana
			) {
				agendamentosSemana++;
			}

			// Mês
			if (dataAgendamento >= inicioMes && dataAgendamento <= fimMes) {
				totalMes++;
				if (agendamento.status === 'cancelado') {
					canceladosMes++;
				}
				if (agendamento.status === 'concluido') {
					receitaMes += parseFloat(agendamento.preco || '0');
				}
			}
		});

		const taxaCancelamento =
			totalMes > 0 ? (canceladosMes / totalMes) * 100 : 0;

		return {
			agendamentosHoje,
			agendamentosSemana,
			receitaMes,
			taxaCancelamento,
		};
	};

	const carregar = useCallback(async () => {
		// Se não tem estabelecimentoId, tenta obter do usuário logado
		let estabId = estabelecimentoId;
		if (!estabId) {
			const user = getUserData();
			if (user && user.tipo === 'estabelecimento') {
				estabId = user.id as number;
			} else {
				setLoading(false);
				setError('Estabelecimento não identificado');
				return;
			}
		}

		try {
			setLoading(true);
			setError(null);

			const agendamentos = await getAgendamentos();

			// Filtrar por estabelecimento
			const agendamentosEstabelecimento = agendamentos.filter(
				(a: Agendamento) => a.estabelecimentoId === estabId
			);

			// Calcular métricas
			const calculatedMetrics = calcularMetricas(
				agendamentosEstabelecimento
			);
			setMetrics(calculatedMetrics);

			// Próximos agendamentos (futuros, ordenados por data)
			const hoje = new Date();
			const proximos = agendamentosEstabelecimento
				.filter(
					(a: Agendamento) =>
						new Date(a.data) >= hoje && a.status !== 'cancelado'
				)
				.sort(
					(a: Agendamento, b: Agendamento) =>
						new Date(a.data).getTime() - new Date(b.data).getTime()
				)
				.slice(0, 5);

			setProximosAgendamentos(proximos);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao carregar métricas'
			);
			console.error('Erro ao carregar métricas:', err);
		} finally {
			setLoading(false);
		}
	}, [estabelecimentoId]);

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
